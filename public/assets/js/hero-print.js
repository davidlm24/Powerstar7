/*
 * The home hero's picture: a Hairline line figure (hairline/responsive.js on
 * the Hairline kernel, hairline/kernel.js, @lucasmarkes/hairline, MIT) mounted
 * in a hidden svg, and printed into a canvas as a three-ink Bayer dither in
 * the site's own inks whenever the drawing changes.
 *
 * - Nothing is redrawn unless the svg changes (a MutationObserver), so at
 *   rest the page does no work.
 * - The idle loop walks the figure's tour with pointer events of its own and
 *   prints a cursor where it is. A real hand (a trusted event) takes over,
 *   and the loop comes back after it leaves. It runs only with motion allowed
 *   and only while the hero is on screen.
 * - The figure's print hints (data-tone) give each surface its ink and
 *   density. Paper is opaque on the objects and clear around them, so the
 *   hero's own ground shows through.
 * - Until the first print, and without JS, the still (hero-responsive.png),
 *   the same print at rest, is what shows.
 */
(function () {
  var box = document.querySelector('[data-hero-print]');
  if (!box || !window.HTMLCanvasElement || !window.HL) return;

  var stage = box.querySelector('.hero__stage'), canvas = box.querySelector('.hero__canvas'), readEl = box.querySelector('.hero__read');
  var ctx = canvas.getContext('2d');
  var off = document.createElement('canvas'), oc = off.getContext('2d', { willReadFrequently: true });
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* The inks, from the site's tokens: blue, purple, ink (one per channel), and the paper. */
  function rgb(name, fallback) {
    var v = getComputedStyle(box).getPropertyValue(name).trim() || fallback;
    oc.fillStyle = '#000'; oc.fillStyle = v;
    var h = oc.fillStyle;
    return h[0] === '#' ? [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)] : [0, 0, 0];
  }
  var INK = [rgb('--blue', '#0e6fff'), rgb('--purple', '#7b5bff'), rgb('--ink', '#1c1b17')];
  var PAPER = rgb('--paper', '#f5f2eb');
  var BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21].map(function (v) { return (v + 0.5) / 64; });

  /* data-tone: [ink, density]. 0 blue, 1 purple, 2 ink. */
  var TONES = {
    paper: [0, 0], pot: [0, 0.3], pad: [0, 0.2], glass: [0, 0.34], card: [0, 0.46], accent: [0, 1],
    leaf: [1, 0.5], soft: [1, 0.62], art: [1, 0.8], bezel: [2, 0.86], ink: [2, 1],
  };
  function ch(k, d) { return 'rgb(' + (k === 0 ? d * 255 : 0) + ',' + (k === 1 ? d * 255 : 0) + ',' + (k === 2 ? d * 255 : 0) + ')'; }
  function style(el) {
    var c = el.classList, t = el.getAttribute('data-tone');
    if (c.contains('dot')) return { fill: c.contains('m') ? ch(2, 1) : c.contains('off') ? ch(1, 0.7) : ch(0, 1) };
    var stroke = ch(2, 1), w = 1.1;
    if (c.contains('sil')) w = 1.35;
    if (c.contains('lo')) { stroke = ch(1, 0.85); w = 1; }
    if (c.contains('hi')) { stroke = ch(0, 1); w = 2.1; }
    var fill = t === 'shadow' ? 'shadow' : t && TONES[t] ? ch(TONES[t][0], TONES[t][1]) : c.contains('nf') || c.contains('fo') ? null : 'plate';
    return { fill: fill, stroke: c.contains('fo') ? null : stroke, w: w, dash: c.contains('dash') };
  }
  function shape(el) {
    var t = el.tagName.toLowerCase(), n = function (a) { return Number(el.getAttribute(a)) || 0; };
    if (t === 'path') { var d = el.getAttribute('d'); return d ? new Path2D(d) : null; }
    var p = new Path2D();
    if (t === 'circle') p.arc(n('cx'), n('cy'), n('r'), 0, Math.PI * 2);
    else if (t === 'ellipse') p.ellipse(n('cx'), n('cy'), n('rx'), n('ry'), 0, 0, Math.PI * 2);
    else return null;
    return p;
  }
  /* A ground shadow: a blue dot field that thins out from its middle. */
  function shade(el) {
    var b = el.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    var rg = oc.createRadialGradient(cx, cy, 0, cx, cy, Math.max(b.width, b.height) / 2);
    rg.addColorStop(0, ch(0, 0.5)); rg.addColorStop(0.7, ch(0, 0.2)); rg.addColorStop(1, ch(0, 0.04));
    return rg;
  }
  /* A classic arrow pointer, tip at the origin, in viewBox units. */
  var ARROW = new Path2D('M0 0 L0 15.5 L4.1 11.7 L6.9 18.1 L9.7 16.9 L7 10.6 L12.4 10.4 Z');

  var svg = null, queued = false, cursor = null;
  function dirty() { if (!queued) { queued = true; requestAnimationFrame(paint); } }

  function paint() {
    queued = false;
    if (!svg) return;
    // a dot is a whole number of device pixels and the canvas sits on the device grid:
    // any resampling breaks the Bayer cells into visible blocks
    var r = stage.getBoundingClientRect(), dpr = window.devicePixelRatio || 1, q = Math.max(1, Math.round(dpr));
    var W = Math.max(1, Math.floor((r.width * dpr) / q)), H = Math.floor(W * 0.8);
    if (off.width !== W || off.height !== H) {
      off.width = canvas.width = W; off.height = canvas.height = H;
      canvas.style.width = (W * q) / dpr + 'px'; canvas.style.height = (H * q) / dpr + 'px';
    }
    canvas.style.transform = 'translate(' + -((r.left * dpr) % 1) / dpr + 'px,' + -((r.top * dpr) % 1) / dpr + 'px)';
    var s = W / 400, px = dpr / q / s;
    oc.setTransform(1, 0, 0, 1, 0, 0);
    oc.clearRect(0, 0, W, H);
    oc.setTransform(s, 0, 0, s, 0, 0);
    oc.lineJoin = oc.lineCap = 'round';
    var g = oc.createLinearGradient(0, 40, 0, 300);
    g.addColorStop(0, ch(0, 0.04)); g.addColorStop(1, ch(0, 0.16));
    var els = svg.querySelectorAll('path, circle, ellipse');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], p = shape(el);
      if (!p) continue;
      var st = style(el);
      // shadows are half alpha: inked where the dots fall, clear where they do not
      oc.globalAlpha = st.fill === 'shadow' ? 0.5 : 1;
      if (st.fill) { oc.fillStyle = st.fill === 'plate' ? g : st.fill === 'shadow' ? shade(el) : st.fill; oc.fill(p); }
      if (st.stroke) {
        oc.strokeStyle = st.stroke; oc.lineWidth = Math.max(st.w * px, 1.05 / s);
        oc.setLineDash(st.dash ? [px * 2, px * 4] : []);
        oc.stroke(p);
      }
    }
    oc.globalAlpha = 1;
    if (cursor) {
      oc.setLineDash([]);
      oc.translate(cursor[0], cursor[1]);
      oc.fillStyle = '#000'; oc.fill(ARROW);
      oc.strokeStyle = ch(2, 1); oc.lineWidth = Math.max(1.3 * px, 1.05 / s); oc.stroke(ARROW);
    }
    // the strongest channel picks the ink and the Bayer cell decides whether it prints;
    // an unprinted pixel is paper on an object (full alpha) and clear anywhere else
    var src = oc.getImageData(0, 0, W, H), out = ctx.createImageData(W, H), a = src.data, b = out.data;
    for (var y = 0, j = 0; y < H; y++) for (var x = 0; x < W; x++, j += 4) {
      if (!a[j + 3]) continue;
      var k = a[j] >= a[j + 1] && a[j] >= a[j + 2] ? 0 : a[j + 1] >= a[j + 2] ? 1 : 2;
      var c = a[j + k] / 255 > BAYER[(x & 7) + ((y & 7) << 3)] ? INK[k] : a[j + 3] === 255 ? PAPER : null;
      if (c) { b[j] = c[0]; b[j + 1] = c[1]; b[j + 2] = c[2]; b[j + 3] = 255; }
    }
    ctx.putImageData(out, 0, 0);
    box.classList.add('is-live');
  }

  /* The idle loop: the figure's tour, walked with pointer events of its own. */
  function idle(stops) {
    var TRAVEL = 900, DWELL = 1300, REST = 1900, BACK = 1500;
    var i = 0, at = null, from = null, t0 = 0, until = performance.now() + 1200, hand = false, seen = true, raf = 0;
    function send(type, p) {
      var r = stage.getBoundingClientRect();
      stage.dispatchEvent(new PointerEvent(type, { pointerType: 'mouse', pointerId: 7, bubbles: true, clientX: r.left + (p[0] / 400) * r.width, clientY: r.top + (p[1] / 320) * r.height }));
    }
    function frame(now) {
      raf = 0;
      if (hand || !seen) return;
      if (from) {
        var k = HL.EASE_LIFT(Math.min(1, (now - t0) / TRAVEL)), s = stops[i];
        at = [from[0] + (s[0] - from[0]) * k, from[1] + (s[1] - from[1]) * k];
        cursor = at; send('pointermove', at); dirty();
        if (k >= 1) { from = null; until = now + DWELL; i = (i + 1) % stops.length; }
      } else if (now >= until) {
        if (stops[i] === null) {
          if (at) { send('pointerleave', at); at = null; cursor = null; dirty(); }
          until = now + REST; i = (i + 1) % stops.length;
        } else { from = at || [400, 300]; t0 = now; }
      }
      raf = requestAnimationFrame(frame);
    }
    function go() { if (!raf && !hand && seen) raf = requestAnimationFrame(frame); }
    stage.addEventListener('pointermove', function (e) { if (e.isTrusted) { hand = true; at = null; from = null; cursor = null; dirty(); } });
    stage.addEventListener('pointerleave', function (e) { if (e.isTrusted) { hand = false; until = performance.now() + BACK; i = 0; go(); } });
    new IntersectionObserver(function (en) { seen = en[0].isIntersecting; go(); }).observe(stage);
    go();
  }

  window.hairline = function (figure) {
    HL.inject(document);
    stage.setAttribute('data-hairline', figure.name);
    svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    var read = {
      set textContent(v) { if (readEl) readEl.textContent = v === 'rest' ? '' : v + 'px'; },
      get textContent() { return readEl ? readEl.textContent : ''; },
    };
    figure.mount({ stage: stage, svg: svg, read: read }, figure.range[1]);
    new MutationObserver(dirty).observe(svg, { subtree: true, childList: true, attributes: true, attributeFilter: ['d', 'class', 'cx', 'cy'] });
    new ResizeObserver(dirty).observe(stage);
    if (motion) idle(figure.tour || HL.LAP);
    dirty();
  };
})();
