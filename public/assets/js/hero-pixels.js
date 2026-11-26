/* Hero pixels (HeroPixels.astro), round 6: one field of small square cells
   over the whole hero.
   - The drawings (browser, phone, check; 60 x 42 cells each) are placed
     around the stage ([data-px-stage]) at a slightly different spot each
     time, with some pixels moved sideways, some missing, short rows shifted
     like a glitch, and strays scattered around them. A few of the misplaced
     pixels blink while a drawing holds; then it dissolves into the next.
   - Every other cell rests at its own faint opacity, and a few light up at
     random and fade, denser near the drawing.
   Drawing: one value per cell, written into a cols x rows image, scaled up
   without smoothing, then cut into squares by a tiled mask. Two draw calls a
   frame, at most ~30 frames a second, and nothing while the hero is off
   screen, the tab is hidden, or the footer's Animation switch is off
   (html.motion-off). With reduced motion nothing runs at all, and the still
   (HeroPixelsStill + the field's empty squares) stays. */
(function () {
  'use strict';
  var mq = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;
  // Each field includes this script; run it once.
  if (window.__heroPx) return;
  window.__heroPx = 1;

  var CELL = 5, FIT = 66, HOLD = 2800, MOVE = 1000, TICK = 33;
  var TONE = { '#': 1, ':': 0.35 };
  var root = document.documentElement;

  // A fixed pseudo-random value in [0, 1) per cell.
  var hash = function (x, y) {
    var h = Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  // A seeded generator (mulberry32), so a scattered drawing is the same for
  // as long as it is shown.
  var rng = function (s) {
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  var setup = function (box) {
    var cv = box.querySelector('canvas'), ctx = cv && cv.getContext && cv.getContext('2d'), F;
    // A hero field has drawings and a stage; a corner field (no frames)
    // only gathers its pixels around data-focus.
    var stage = box.parentNode && box.parentNode.querySelector('[data-px-stage]');
    try { F = JSON.parse(box.getAttribute('data-frames')); } catch (e) {}
    if (!F || F.length < 2 || !stage) { F = null; stage = null; }
    if (!ctx || box.__px) return;
    box.__px = 1;

    var FR = F ? F[0].length : 0, FC = F ? F[0][0].length : 0;
    var focus = (box.getAttribute('data-focus') || '1 0').split(' ').map(Number);
    var off = document.createElement('canvas'), octx = off.getContext('2d'), img;
    var tile = document.createElement('canvas'), pat;
    var W = 1, H = 1, cell = 1, cols = 0, rows = 0, N = 0, ox = 0, oy = 0;
    var amb, dens, dr, drT, sp, spT, dl, next, blink = [];
    var f = 0, nx = 0, cycle = 0, moving = false, mt = 0, left = HOLD;
    var raf = 0, last = 0, seen = true, dead = false, from, to, cm = 1, i;

    // --px-ink as [r, g, b]; the canvas normalises any CSS colour it accepts.
    var ink = function () {
      var s = getComputedStyle(box).getPropertyValue('--px-ink').trim(), m;
      ctx.fillStyle = '#ffffff';
      if (s) ctx.fillStyle = s;
      s = String(ctx.fillStyle);
      if (/^#[0-9a-f]{6}$/i.test(s)) { m = parseInt(s.slice(1), 16); return [m >> 16, (m >> 8) & 255, m & 255]; }
      m = /^rgba?\(/.test(s) && s.match(/[\d.]+/g);
      return m && m.length > 2 ? [+m[0], +m[1], +m[2]] : [255, 255, 255];
    };
    var colour = function () {
      var e = cm * cm * (3 - 2 * cm);
      return [0, 1, 2].map(function (k) { return Math.round(from[k] + (to[k] - from[k]) * e); });
    };

    // Drawing k, placed and scattered (seed: which showing this is).
    var place = function (k, seed) {
      var R = rng(seed * 7919 + k * 104729 + 17), T = new Float32Array(N), bl = [];
      var put = function (x, y, v, b) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) return;
        var j = y * cols + x;
        if (v > T[j]) T[j] = v;
        if (b) bl.push({ i: j, v: v, on: true, t: 0 });
      };
      var bx = ox + Math.round((R() - 0.5) * 8), by = oy + Math.round((R() - 0.5) * 6), x, y, v, r;
      if (!F) {
        // Corner: a cluster of scattered pixels around the focus, thinning
        // with distance, half of them blinking.
        var rad = Math.max(10, Math.min(cols, rows) * 0.55);
        for (var m = 0; m < 90; m++) {
          var an = R() * 6.2832, dd = Math.pow(R(), 1.5) * rad;
          put(Math.round(ox + Math.cos(an) * dd * 1.4), Math.round(oy + Math.sin(an) * dd), R() < 0.35 ? 1 : 0.4, R() < 0.5);
        }
        return { T: T, bl: bl };
      }
      for (y = 0; y < FR; y++) {
        var row = F[k][y], s0 = -1, s1 = -1, sh = 0;
        // Now and then a short run of the row slides 1-2 cells, like a glitch.
        if (R() < 0.09) { s0 = (R() * FC) | 0; s1 = s0 + 5 + ((R() * 12) | 0); sh = (R() < 0.5 ? -1 : 1) * (1 + ((R() * 2) | 0)); }
        for (x = 0; x < FC; x++) {
          v = TONE[row.charAt(x)];
          if (!v) continue;
          r = R();
          var gx = bx + x + (x >= s0 && x <= s1 ? sh : 0);
          if (r < 0.04) continue; // missing
          if (r < 0.1) { put(gx + (R() < 0.5 ? -1 : 1) * (1 + ((R() * 3) | 0)), by + y, v, true); continue; } // misplaced
          put(gx, by + y, v, false);
        }
      }
      // Strays around the drawing, thinning with distance.
      var cx = bx + FC / 2, cy = by + FR / 2;
      for (var n = 0; n < 70; n++) {
        var a = R() * 6.2832, d = 0.5 + Math.pow(R(), 1.7) * 0.9;
        put(Math.round(cx + Math.cos(a) * d * FC * 0.72), Math.round(cy + Math.sin(a) * d * FR * 0.72), R() < 0.3 ? 1 : 0.35, R() < 0.5);
      }
      return { T: T, bl: bl };
    };

    // The grid follows the field; the stage's box sets the cell size and
    // where the drawings sit. Called on every resize.
    var build = function () {
      var br = box.getBoundingClientRect(), sr = stage && stage.getBoundingClientRect();
      if (!br.width || !br.height || (sr && !sr.width)) return false;
      var dp = W / br.width;
      cell = Math.max(2, Math.round((sr ? Math.min(CELL, sr.width / FIT) : CELL) * dp));
      cols = Math.ceil(W / cell); rows = Math.ceil(H / cell); N = cols * rows;
      if (sr) {
        ox = Math.round(((sr.left + sr.width / 2 - br.left) * dp) / cell - FC / 2);
        oy = Math.round(((sr.top + sr.height / 2 - br.top) * dp) / cell - FR / 2);
        box.style.setProperty('--fade-at', Math.round(sr.top - br.top) + 'px');
      } else {
        ox = Math.round(focus[0] * (cols - 1)); oy = Math.round(focus[1] * (rows - 1));
      }

      off.width = cols; off.height = rows;
      img = octx.createImageData(cols, rows);
      tile.width = tile.height = cell;
      var tc = tile.getContext('2d'), s = Math.max(1, Math.round(cell * 0.8)), o = Math.floor((cell - s) / 2);
      tc.clearRect(0, 0, cell, cell); tc.fillStyle = '#000'; tc.fillRect(o, o, s, s);
      pat = ctx.createPattern(tile, 'repeat');

      amb = new Float32Array(N); dens = new Float32Array(N); dl = new Float32Array(N);
      sp = new Float32Array(N); spT = new Float32Array(N);
      var cx = ox + FC / 2, cy = oy + FR / 2, reach = Math.max(cols, rows) * 0.7, x, y, h, p;
      for (i = 0; i < N; i++) {
        x = i % cols; y = (i / cols) | 0; h = hash(x, y);
        p = Math.max(0, 1 - Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy) * 1.6) / reach);
        dens[i] = 0.25 + 0.75 * p;
        amb[i] = 0.02 + (0.03 + 0.11 * h * h) * dens[i];
        // When this cell changes in a dissolve: mostly random, a slight diagonal drift.
        dl[i] = (0.8 * hash(x + 7, y + 3) + 0.2 * Math.max(0, Math.min(1, (x - ox + y - oy) / (FC + FR || cols + rows)))) * MOVE;
      }
      var cur = place(f, cycle);
      dr = cur.T; drT = new Float32Array(dr); blink = cur.bl;
      moving = false; left = HOLD;
      return true;
    };

    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      if (dead || !N) return;
      var c = colour(), d = img.data, j, p, v;
      for (j = 0, p = 0; j < N; j++, p += 4) {
        v = (dr[j] > amb[j] ? dr[j] : amb[j]) + sp[j];
        d[p] = c[0]; d[p + 1] = c[1]; d[p + 2] = c[2]; d[p + 3] = v >= 1 ? 255 : v * 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, cols * cell, rows * cell);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    };

    var go = function () {
      nx = F ? (f + 1) % F.length : 0; cycle++;
      next = place(nx, cycle);
      blink = []; moving = true; mt = 0;
    };

    var running = function () { return seen && !document.hidden && !dead && !root.classList.contains('motion-off'); };

    var step = function (now) {
      raf = 0;
      if (!running()) return;
      raf = requestAnimationFrame(step);
      if (last && now - last < TICK) return;
      var dt = last ? Math.min(now - last, 100) : TICK, j, e, b;
      last = now;
      var up = 1 - Math.exp(-dt / 90), down = 1 - Math.exp(-dt / 220);
      var sUp = 1 - Math.exp(-dt / 60), sDown = 1 - Math.exp(-dt / 900);

      if (moving) {
        mt += dt;
        for (j = 0; j < N; j++) if (dl[j] <= mt) drT[j] = next.T[j];
        if (mt >= MOVE + 500) { moving = false; f = nx; blink = next.bl; left = HOLD; }
      } else {
        left -= dt;
        if (left <= 0) go();
        // Misplaced pixels and strays blink while the drawing holds.
        for (j = 0; j < blink.length; j++) {
          b = blink[j];
          if (now < b.t) continue;
          b.on = !b.on || Math.random() < 0.5;
          b.t = now + 300 + Math.random() * 1500;
          drT[b.i] = b.on ? b.v : 0;
        }
      }

      // Random cells light up, more of them near the drawing.
      for (j = Math.round((N / 1500) * (dt / TICK)); j > 0; j--) {
        e = (Math.random() * N) | 0;
        if (spT[e] === 0 && sp[e] < 0.03 && Math.random() < dens[e]) spT[e] = (0.3 + Math.random() * 0.5) * dens[e];
      }

      for (j = 0; j < N; j++) {
        e = drT[j] - dr[j];
        if (e > 0.004 || e < -0.004) dr[j] += e * (e > 0 ? up : down); else dr[j] = drT[j];
        if (spT[j]) { sp[j] += (spT[j] - sp[j]) * sUp; if (sp[j] >= spT[j] * 0.92) spT[j] = 0; }
        else if (sp[j]) { sp[j] -= sp[j] * sDown; if (sp[j] < 0.004) sp[j] = 0; }
      }
      if (cm < 1) cm = Math.min(1, cm + dt / 420);
      draw();
    };

    // Stopped (off screen, hidden tab, Animation off): settle and hold still;
    // the drawing finishes where it is and the sparks go out.
    var sync = function () {
      if (running()) { if (!raf) { last = 0; raf = requestAnimationFrame(step); } return; }
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (root.classList.contains('motion-off') && N) {
        if (moving) { for (i = 0; i < N; i++) drT[i] = next.T[i]; moving = false; f = nx; blink = next.bl; left = HOLD; }
        for (i = 0; i < blink.length; i++) { blink[i].on = true; drT[blink[i].i] = blink[i].v; }
        dr.set(drT); sp.fill(0); spT.fill(0); cm = 1;
        draw();
      }
    };

    var resize = function (w, h) {
      W = Math.max(1, Math.round(w)); H = Math.max(1, Math.round(h));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      if (build()) draw();
    };

    var r0 = box.getBoundingClientRect(), d0 = Math.min(window.devicePixelRatio || 1, 2);
    from = to = ink();
    resize(r0.width * d0, r0.height * d0);
    box.classList.add('is-live');
    if (stage) stage.style.visibility = 'hidden';

    // Crisp squares: size the canvas in device pixels when the browser can
    // report them (this observer also fires when the zoom or DPR changes).
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function (es) {
        var en = es[es.length - 1], dp = en && en.devicePixelContentBoxSize && en.devicePixelContentBoxSize[0];
        if (dp) { resize(dp.inlineSize, dp.blockSize); return; }
        var r = box.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
        resize(r.width * d, r.height * d);
      });
      try { ro.observe(box, { box: 'device-pixel-content-box' }); } catch (e) { ro.observe(box); }
    } else {
      addEventListener('resize', function () {
        var r = box.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
        resize(r.width * d, r.height * d);
      });
    }

    if (window.IntersectionObserver) new IntersectionObserver(function (es) { seen = es[es.length - 1].isIntersecting; sync(); }).observe(box);
    document.addEventListener('visibilitychange', sync);
    addEventListener('motionchange', sync);
    // Theme switch: cross-fade the ink to the new --px-ink over ~420ms.
    addEventListener('themechange', function () {
      from = colour(); to = ink(); cm = 0;
      if (!running()) { cm = 1; draw(); }
    });
    if (mq && mq.addEventListener) mq.addEventListener('change', function () {
      if (!mq.matches) return;
      dead = true; sync(); draw();
      box.classList.remove('is-live');
      if (stage) stage.style.visibility = '';
    });

    sync();
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-hero-pixels]'), setup);
})();
