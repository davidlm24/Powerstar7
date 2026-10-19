/* Dither lab engine (src/pages/lab/dither.astro). Exploration only: nothing
   on the real pages loads this.

   Two things live here:

   Sticker  re-dithers an illustration live. It loads the continuous ink of a
            sticker (scripts/illustrations.mjs) and thresholds it against the
            same 8x8 Bayer matrix the build uses, so with every effect at rest
            it draws exactly the pixels of the static PNG. Effects bend the
            ink or the threshold before the comparison, which is why they
            read as the PRINT changing rather than as a filter on top of it.

   Wash     the hero's blue and purple wash, drawn as fine dithered dots
            (WebGL) instead of soft gradients, kept clear of all text.

   Reduced motion: every tween jumps to its end and no loop starts. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 8x8 Bayer, built the way scripts/illo/dither.mjs builds it, so the
     thresholds match the static stickers pixel for pixel. */
  var B8 = new Float32Array(64);
  (function () {
    var m = [[0]];
    for (var n = 1; n < 8; n *= 2) {
      var b = [];
      for (var j = 0; j < n * 2; j++) b.push(new Array(n * 2));
      for (j = 0; j < n; j++) for (var i = 0; i < n; i++) {
        var v = m[j][i] * 4;
        b[j][i] = v; b[j][i + n] = v + 2; b[j + n][i] = v + 3; b[j + n][i + n] = v + 1;
      }
      m = b;
    }
    for (j = 0; j < 8; j++) for (i = 0; i < 8; i++) B8[j * 8 + i] = (m[j][i] + 0.5) / 64;
  })();

  /* Little-endian RGBA as one word: the sticker palette. */
  var rgba = function (r, g, b) { return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0; };
  var PAPER = rgba(252, 250, 246);   // --paper-hi
  var BLUE = rgba(12, 98, 224);      // --blue-fn
  /* The wash dots are see-through, so a dot is a tint and not a solid
     pixel: 55% of --blue / --purple. Solid dots read as noise. */
  var rgbaA = function (r, g, b, a) { return ((Math.round(a * 255) << 24) | (b << 16) | (g << 8) | r) >>> 0; };
  var WASH_BLUE = rgbaA(14, 111, 255, 0.55);
  var WASH_PURPLE = rgbaA(123, 91, 255, 0.55);

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ease = function (p) { return 1 - Math.pow(1 - p, 3); };

  /* --- Fields ------------------------------------------------------------ */

  var cache = {};
  function loadField(name, hi) {
    var key = name + (hi ? '@2x' : '');
    if (cache[key]) return cache[key];
    cache[key] = new Promise(function (resolve, reject) {
      var img = new Image();
      img.src = '/assets/dither/' + key + '.png';
      img.decode().then(function () {
        var W = img.naturalWidth, H = img.naturalHeight, N = W * H;
        var c = document.createElement('canvas');
        c.width = W; c.height = H;
        var x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(img, 0, 0);
        var d = x.getImageData(0, 0, W, H).data;
        var ink = new Float32Array(N), back = new Uint8Array(N), layer = new Uint8Array(N), layers = 0;
        for (var k = 0; k < N; k++) {
          ink[k] = (d[k * 4] * 256 + d[k * 4 + 2]) / 65535;
          back[k] = d[k * 4 + 1] >= 128 ? 1 : 0;
          layer[k] = back[k] ? d[k * 4 + 1] - 128 : 0;
          if (layer[k] > layers) layers = layer[k];
        }
        resolve({ W: W, H: H, ink: ink, back: back, layer: layer, layers: layers });
      }, reject);
    });
    return cache[key];
  }

  /* --- Sticker ----------------------------------------------------------- */

  /**
   * state (all optional; the defaults draw the static sticker):
   *   reveal  0..1, or an array per layer: paper dissolves in first, then
   *           the dots develop in Bayer order
   *   wipe    { p, ax, ay, band }: reveal travels along (ax, ay)
   *   gain    ink multiplier (density): 0.3 = a sparse, resting print
   *   block   coarse dither: one threshold per block x block CSS px
   *   ox, oy  Bayer offset: shifting it makes the grain crawl
   *   sweep   { pos, w, amt }: a band of light across the print
   *   ripple  { x, y, t, amt }: rings from a point, in CSS px
   *   lens    { x, y, r, block }: coarse dither inside a circle
   */
  function Sticker(canvas, name) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.s = (window.devicePixelRatio || 1) >= 1.5 ? 2 : 1;
    this.state = {};
    this.anim = 0;
    var self = this;
    this.ready = loadField(name, this.s === 2).then(function (f) {
      self.f = f;
      canvas.width = f.W;
      canvas.height = f.H;
      self.img = self.ctx.createImageData(f.W, f.H);
      self.px = new Uint32Array(self.img.data.buffer);
      self.draw();
      return self;
    });
  }

  Sticker.prototype.set = function (state) {
    this.state = state || {};
    this.draw();
  };

  /* Per-pixel Bayer thresholds for one size, shared by every sticker of it. */
  var thresholds = {};
  function thresholdsFor(W, H) {
    var key = W + 'x' + H;
    if (thresholds[key]) return thresholds[key];
    var T = new Float32Array(W * H);
    for (var j = 0; j < H; j++) for (var i = 0; i < W; i++) T[j * W + i] = B8[(j & 7) * 8 + (i & 7)];
    return (thresholds[key] = T);
  }

  var RIP_R = 270;                   // CSS px; past this the rings are under 2% ink

  Sticker.prototype.draw = function () {
    var f = this.f;
    if (!f) return;
    var S = this.state, W = f.W, H = f.H, sc = this.s;
    var ink = f.ink, back = f.back, lay = f.layer, px = this.px;
    var T = this.T || (this.T = thresholdsFor(W, H));
    var gain = S.gain == null ? 1 : S.gain;
    var rev = S.reveal == null ? 1 : S.reveal, revA = typeof rev === 'object' ? rev : null;
    var wipe = S.wipe, wn = wipe ? wipe.ax + wipe.ay : 1;
    var block = Math.max(1, Math.round((S.block || 1) * sc));
    var ox = S.ox | 0, oy = S.oy | 0;
    var sw = S.sweep, rip = S.ripple, lens = S.lens;
    var r, v, k, i, j;

    /* Ripple as a radial lookup, in half device pixels: one sqrt and one
       read per pixel instead of a sin and an exp. */
    var prof = null, rx = 0, ry = 0, R2 = 0;
    if (rip) {
      var n = Math.ceil(RIP_R * sc * 2);
      prof = this.prof && this.prof.length === n ? this.prof : (this.prof = new Float32Array(n));
      for (var q = 0; q < n; q++) {
        var dc = q / 2 / sc;
        prof[q] = rip.amt * Math.sin(dc * 0.22 - rip.t) * Math.exp(-dc / 90);
      }
      rx = rip.x * sc; ry = rip.y * sc; R2 = (n / 2) * (n / 2) - 1;
    }

    /* Fast path: the threshold is the plain per-pixel one. Covers rest,
       densify, develop, layers and ripple: almost every frame. */
    if (block === 1 && !lens && !wipe && !sw && !ox && !oy) {
      for (j = 0; j < H; j++) {
        var row = j * W, ddy = j - ry, dy2 = ddy * ddy, rowRip = prof && dy2 < R2;
        for (i = 0; i < W; i++) {
          k = row + i;
          if (!back[k]) { px[k] = 0; continue; }
          r = revA ? revA[lay[k] - 1] : rev;
          v = ink[k];
          if (r < 1) {
            if (r * 1.6 <= T[k]) { px[k] = 0; continue; }
            v *= r * 1.6 - 0.6 > 0 ? r * 1.6 - 0.6 : 0;
          }
          v *= gain;
          if (rowRip && v > 0) {
            var ddx = i - rx, d2 = ddx * ddx + dy2;
            if (d2 < R2) v += prof[(Math.sqrt(d2) * 2) | 0];
          }
          px[k] = v > T[k] ? BLUE : PAPER;
        }
      }
      this.ctx.putImageData(this.img, 0, 0);
      return;
    }

    var lensB = lens ? Math.max(1, Math.round((lens.block || 3) * sc)) : 1;
    var lr2 = lens ? lens.r * lens.r : 0;
    for (j = 0; j < H; j++) {
      for (i = 0; i < W; i++) {
        k = j * W + i;
        var bs = block;
        if (lens) {
          var lx = i / sc - lens.x, ly = j / sc - lens.y;
          if (lx * lx + ly * ly < lr2) bs = lensB;
        }
        var ii = i, jj = j, kk = k, t;
        if (bs > 1) {
          var bi = (i / bs) | 0, bj = (j / bs) | 0;
          ii = bi * bs; jj = bj * bs; kk = jj * W + ii;
          t = B8[((bj + oy) & 7) * 8 + ((bi + ox) & 7)];
        } else {
          t = B8[((j + oy) & 7) * 8 + ((i + ox) & 7)];
        }
        if (!back[kk]) { px[k] = 0; continue; }

        r = revA ? revA[lay[kk] - 1] : rev;
        if (wipe) {
          var sp = ((ii / W) * wipe.ax + (jj / H) * wipe.ay) / wn;
          r = Math.min(r, clamp((wipe.p * (1 + wipe.band) - sp) / wipe.band));
        }
        v = ink[kk];
        if (r < 1) {
          if (r * 1.6 <= t) { px[k] = 0; continue; }   // paper first...
          v *= clamp(r * 1.6 - 0.6);                    // ...then the dots
        }
        v *= gain;
        if (sw && v > 0) {
          var qq = (ii / W + (jj / H) * 0.4 - sw.pos) / sw.w;
          if (qq > -3 && qq < 3) v -= sw.amt * Math.exp(-qq * qq);   // only inside the band
        }
        if (prof && v > 0) {
          var ex = ii - rx, ey = jj - ry, e2 = ex * ex + ey * ey;
          if (e2 < R2) v += prof[(Math.sqrt(e2) * 2) | 0];
        }
        px[k] = v > t ? BLUE : PAPER;
      }
    }
    this.ctx.putImageData(this.img, 0, 0);
  };

  /** Run fn(p) from 0 to 1 over ms, once; cancels whatever ran before. */
  Sticker.prototype.tween = function (ms, fn, done) {
    var self = this;
    this.stop();
    if (reduce) { this.set(fn(1)); if (done) done(); return; }
    var t0 = 0;
    var step = function (now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / ms);
      self.set(fn(p));
      if (p < 1) self.anim = requestAnimationFrame(step);
      else { self.anim = 0; if (done) done(); }
    };
    this.anim = requestAnimationFrame(step);
  };

  /** Run fn(seconds) every frame (at most fps) until stop(). */
  Sticker.prototype.loop = function (fn, fps) {
    var self = this, gap = 1000 / (fps || 60), last = 0, t0 = 0;
    this.stop();
    if (reduce) return;
    var step = function (now) {
      if (!t0) t0 = now;
      if (now - last >= gap - 1) { last = now; self.set(fn((now - t0) / 1000)); }
      self.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  };

  Sticker.prototype.stop = function () {
    if (this.anim) cancelAnimationFrame(this.anim);
    this.anim = 0;
  };

  /** Pointer position in the sticker's own CSS px (its 1x box). */
  Sticker.prototype.point = function (e) {
    var r = this.canvas.getBoundingClientRect(), f = this.f;
    var w = f ? f.W / this.s : r.width, h = f ? f.H / this.s : r.height;
    return { x: ((e.clientX - r.left) / r.width) * w, y: ((e.clientY - r.top) / r.height) * h };
  };

  /* --- Entrances, as state functions of p -------------------------------- */

  var ENTER = {
    /* Paper dissolves in, then the dots develop in Bayer order. */
    develop: function (p) { return { reveal: ease(p) }; },
    /* A dithered edge travels down the print. */
    scan: function (p) { return { wipe: { p: ease(p), ax: 0, ay: 1, band: 0.35 } }; },
    /* Coarse to fine: 16, 8, 4, 2, 1 px dots while the ink comes up. */
    resup: function (p) {
      var steps = [16, 8, 4, 2, 1], n = Math.min(steps.length - 1, Math.floor(p * steps.length));
      return { block: steps[n], reveal: Math.min(1, p * 2.2), gain: 0.55 + 0.45 * p };
    },
    /* A diagonal sweep that leaves the finished print behind it. */
    sweep: function (p) {
      return { wipe: { p: ease(p), ax: 1, ay: 0.6, band: 0.25 }, sweep: { pos: -0.2 + 1.6 * p, w: 0.08, amt: 0.6 * (1 - p) } };
    },
    /* Each layer of a layered scene develops in turn (the hero desk). */
    layers: function (p, n) {
      var r = [];
      for (var l = 0; l < n; l++) {
        var a = (l / n) * 0.55;
        r.push(ease(clamp((p - a) / 0.45)));
      }
      return { reveal: r };
    },
  };

  /* --- Hover behaviours: attach to a zone, drive a sticker --------------- */

  /**
   * Hover on a zone drives a sticker. kind and rest may be functions, read on
   * every enter, so the lab can switch them live. Every kind first brings the
   * ink up to full (from a sparse resting print, when rest.gain < 1), then
   * runs its effect; leaving fades back to rest.
   *   densify  only that
   *   sweep    a band of light passes over the print once
   *   crawl    the Bayer grid marches, so the grain shimmers (12 fps)
   *   ripple   rings spread from the pointer
   *   lens     a circle of coarse dither follows the pointer
   */
  function hover(zone, st, kind, rest) {
    var K = typeof kind === 'function' ? kind : function () { return kind; };
    var R = typeof rest === 'function' ? rest : function () { return rest || {}; };
    var on = false, pt = null, k = null, g = null;
    var restGain = function () { var r = R(); return r.gain == null ? 1 : r.gain; };
    var effect = function () {
      if (k === 'sweep') {
        st.tween(700, function (p) { return { gain: 1, sweep: { pos: -0.3 + 1.8 * p, w: 0.1, amt: 0.75 } }; });
      } else if (k === 'crawl') {
        st.loop(function (t) { var n = Math.floor(t * 12); return { ox: n, oy: n >> 1 }; }, 12);
      } else if (k === 'ripple') {
        st.loop(function (t) { return { ripple: { x: pt ? pt.x : 0, y: pt ? pt.y : 0, t: t * 7, amt: 0.32 } }; }, 60);
      } else if (k === 'lens') {
        st.set({ lens: { x: pt ? pt.x : -999, y: pt ? pt.y : -999, r: 46, block: 3 } });
      }
    };
    var enter = function (e) {
      k = K();
      if (!k || k === 'none' || !st.f) return;
      on = true;
      if (e && e.clientX != null) pt = st.point(e);
      if (g == null) g = restGain();
      var from = g;
      if (from >= 0.999) { effect(); return; }
      st.tween(300, function (p) { g = from + (1 - from) * ease(p); return { gain: g }; }, function () { if (on) effect(); });
    };
    var leave = function () {
      if (!on) return;
      on = false;
      var last = st.state, to = restGain();
      g = last.gain == null ? 1 : last.gain;
      var from = g;
      st.tween(k === 'ripple' ? 520 : 380, function (p) {
        g = from + (to - from) * ease(p);
        var s = { gain: g };
        if (last.ripple) s.ripple = { x: last.ripple.x, y: last.ripple.y, t: last.ripple.t + p * 3.5, amt: last.ripple.amt * (1 - p) };
        return s;
      });
    };
    zone.addEventListener('pointerenter', enter);
    zone.addEventListener('pointerleave', leave);
    zone.addEventListener('focusin', function () { if (!on) enter(); });
    zone.addEventListener('focusout', function (e) { if (!zone.contains(e.relatedTarget)) leave(); });
    zone.addEventListener('pointermove', function (e) {
      if (!st.f) return;
      pt = st.point(e);
      if (k === 'lens' && on && !st.anim && !reduce) st.set({ lens: { x: pt.x, y: pt.y, r: 46, block: 3 } });
    });
    return { reset: function () { on = false; g = null; st.stop(); st.set(R()); } };
  }

  /* --- Wash -------------------------------------------------------------- */

  /**
   * The hero wash as dots. Two blobs, blue top-left and purple top-right, at
   * the same places as the CSS wash, drifting slowly through a flow field.
   * mode 'glow' brightens dots near the pointer, 'rings' sends rings out
   * from it.
   *
   * Fine by default: one dot per CSS pixel (opts.cell). At that grain a 2D
   * canvas would cost ~150ms a frame, so it is a WebGL fragment shader; the
   * 2D path is the fallback, at no finer than 3px a dot.
   *
   * Never behind text: textRects() measures every line box of the text it
   * is given (and the whole box of a button), and the dots fade to nothing
   * on a Gaussian over `feather` px, so neighbouring lines merge into one
   * soft clearing instead of a stack of boxes. Measured per line, not per block, so the
   * dots still run close around a short last line.
   */
  var MAX_RECTS = 48;

  function textRects(host, els, pad) {
    var hr = host.getBoundingClientRect(), out = [];
    var add = function (r) {
      if (r.width < 1 || r.height < 1 || out.length >= MAX_RECTS) return;
      out.push([r.left - hr.left - pad, r.top - hr.top - pad, r.right - hr.left + pad, r.bottom - hr.top + pad]);
    };
    els.forEach(function (el) {
      if (el.matches('.btn, button')) { add(el.getBoundingClientRect()); return; }
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, range = document.createRange();
      while ((n = w.nextNode())) {
        if (!n.nodeValue.trim()) continue;
        range.selectNodeContents(n);
        Array.prototype.forEach.call(range.getClientRects(), add);
      }
    });
    return out;
  }

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 u_res;uniform vec2 u_size;uniform float u_dpr;uniform float u_cell;uniform float u_t;uniform float u_max;',
    'uniform vec3 u_ptr;uniform float u_mode;uniform float u_feather;',
    'uniform vec4 u_rects[' + MAX_RECTS + '];uniform float u_n;',
    // 8x8 Bayer by bit interleaving; +0.5/64 so zero ink is never a dot
    'float b2(vec2 a){a=floor(a);return fract(a.x*.5+a.y*a.y*.75);}',
    'float b8(vec2 a){return b2(a*.25)*.0625+b2(a*.5)*.25+b2(a)+.5/64.;}',
    'void main(){',
    '  vec2 dev=vec2(gl_FragCoord.x,u_res.y-gl_FragCoord.y);',
    '  vec2 c=floor(dev/u_cell);',
    '  vec2 css=(c+.5)*u_cell/u_dpr;',
    '  float x=css.x/u_size.x,y=css.y/u_size.y,asp=u_size.x/u_size.y,t=u_t;',
    '  float n=.5+.5*sin(x*7.*asp*.35+t*.35+sin(y*5.-t*.22)*1.6);',
    '  vec2 bc=vec2(.26+.05*sin(t*.11),.16+.05*cos(t*.09));',
    '  vec2 pc=vec2(.78+.05*cos(t*.13),.28+.06*sin(t*.1));',
    '  vec2 db=vec2((x-bc.x)*asp*.55,y-bc.y),dp=vec2((x-pc.x)*asp*.55,y-pc.y);',
    '  float ib=u_max*exp(-dot(db,db)*5.5)*(.55+.45*n);',
    '  float ip=u_max*exp(-dot(dp,dp)*6.)*(.55+.45*(1.-n));',
    '  if(u_ptr.z>.5){float d=length(css-u_ptr.xy);',
    '    if(u_mode<1.5)ib+=.3*exp(-d*d/16000.);',
    '    else ib+=.26*max(0.,sin(d/11.-t*5.))*exp(-d/170.);}',
    '  float keep=1.;',
    '  for(int i=0;i<' + MAX_RECTS + ';i++){if(float(i)>=u_n)break;vec4 r=u_rects[i];',
    '    vec2 o=max(max(r.xy-css,css-r.zw),0.);float q=length(o)/u_feather;keep=min(keep,1.-exp(-q*q*3.));}',
    '  ib*=keep;ip*=keep;',
    '  float th=b8(c),th2=b8(c+4.);',
    '  if(ib>th)gl_FragColor=vec4(vec3(14.,111.,255.)/255.*.55,.55);',
    '  else if(ip>th2)gl_FragColor=vec4(vec3(123.,91.,255.)/255.*.55,.55);',
    '  else gl_FragColor=vec4(0.);',
    '}',
  ].join('\n');

  function Wash(canvas, host, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.host = host;
    this.cell = opts.cell || 1;
    this.max = opts.max || 0.16;
    this.feather = opts.feather || 90;
    this.texts = opts.texts || function () { return []; };
    this.mode = 'flow';
    this.pt = null;
    this.raf = 0;
    this.rects = [];
    this.gl = opts.noGL ? null : this.initGL();
    if (!this.gl) {
      this.ctx = canvas.getContext('2d');
      this.small = document.createElement('canvas');
      this.sctx = this.small.getContext('2d');
    }
    var self = this;
    this.resize();
    window.addEventListener('resize', function () { self.resize(); if (!self.raf && self.on) self.frame(self.t || 0); });
    host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect();
      self.pt = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    host.addEventListener('pointerleave', function () { self.pt = null; });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) self.pause(); else if (self.on) self.start();
    });
  }

  Wash.prototype.initGL = function () {
    var gl = this.canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    var sh = function (type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    var self = this;
    ['u_res', 'u_size', 'u_dpr', 'u_cell', 'u_t', 'u_max', 'u_ptr', 'u_mode', 'u_feather', 'u_rects', 'u_n'].forEach(function (n) {
      self.u[n] = gl.getUniformLocation(pr, n);
    });
    return gl;
  };

  Wash.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var r = this.host.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.dpr = dpr;
    this.rects = textRects(this.host, this.texts(), 6);
    if (this.gl) {
      this.canvas.width = Math.round(this.w * dpr);
      this.canvas.height = Math.round(this.h * dpr);
      this.canvas.style.width = this.w + 'px';
      this.canvas.style.height = this.h + 'px';
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      var flat = new Float32Array(MAX_RECTS * 4);
      this.rects.forEach(function (q, i) { flat.set(q, i * 4); });
      this.gl.uniform4fv(this.u.u_rects, flat);
      this.gl.uniform1f(this.u.u_n, this.rects.length);
      return;
    }
    // 2D fallback: never finer than 3 CSS px a dot
    this.cd = Math.max(1, Math.round(Math.max(3, this.cell) * dpr));
    this.cols = Math.max(1, Math.ceil((this.w * dpr) / this.cd));
    this.rows = Math.max(1, Math.ceil((this.h * dpr) / this.cd));
    this.cssCell = this.cd / dpr;
    this.small.width = this.cols;
    this.small.height = this.rows;
    this.canvas.width = this.cols * this.cd;
    this.canvas.height = this.rows * this.cd;
    this.canvas.style.width = this.canvas.width / dpr + 'px';
    this.canvas.style.height = this.canvas.height / dpr + 'px';
    this.img = this.sctx.createImageData(this.cols, this.rows);
    this.px = new Uint32Array(this.img.data.buffer);
  };

  Wash.prototype.frame = function (t) {
    if (this.gl) {
      var gl = this.gl, u = this.u, pt = this.pt;
      gl.uniform2f(u.u_res, this.canvas.width, this.canvas.height);
      gl.uniform2f(u.u_size, this.w, this.h);
      gl.uniform1f(u.u_dpr, this.dpr);
      gl.uniform1f(u.u_cell, Math.max(1, Math.round(this.cell * this.dpr)));
      gl.uniform1f(u.u_t, t);
      gl.uniform1f(u.u_max, this.max);
      gl.uniform3f(u.u_ptr, pt ? pt.x : 0, pt ? pt.y : 0, pt && this.mode !== 'flow' ? 1 : 0);
      gl.uniform1f(u.u_mode, this.mode === 'glow' ? 1 : 2);
      gl.uniform1f(u.u_feather, this.feather);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return;
    }
    var C = this.cols, R = this.rows, px = this.px, cs = this.cssCell, M = this.max, F = this.feather;
    var aspect = this.w / this.h, pnt = this.pt, rects = this.rects, mode = this.mode;
    var bx = 0.26 + 0.05 * Math.sin(t * 0.11), by = 0.16 + 0.05 * Math.cos(t * 0.09);
    var ppx = 0.78 + 0.05 * Math.cos(t * 0.13), ppy = 0.28 + 0.06 * Math.sin(t * 0.1);
    for (var r = 0; r < R; r++) {
      var yc = (r + 0.5) * cs, y = yc / this.h;
      for (var c = 0; c < C; c++) {
        var xc = (c + 0.5) * cs, x = xc / this.w, k = r * C + c;
        var n = 0.5 + 0.5 * Math.sin(x * 7 * aspect * 0.35 + t * 0.35 + Math.sin(y * 5 - t * 0.22) * 1.6);
        var dxb = (x - bx) * aspect * 0.55, dyb = y - by;
        var dxp = (x - ppx) * aspect * 0.55, dyp = y - ppy;
        var ib = M * Math.exp(-(dxb * dxb + dyb * dyb) * 5.5) * (0.55 + 0.45 * n);
        var ip = M * Math.exp(-(dxp * dxp + dyp * dyp) * 6) * (0.55 + 0.45 * (1 - n));
        if (pnt && mode !== 'flow') {
          var ex = xc - pnt.x, ey = yc - pnt.y, d = Math.sqrt(ex * ex + ey * ey);
          if (mode === 'glow') ib += 0.3 * Math.exp(-(d * d) / 16000);
          else ib += 0.26 * Math.max(0, Math.sin(d / 11 - t * 5)) * Math.exp(-d / 170);
        }
        var keep = 1;
        for (var q = 0; q < rects.length && keep > 0; q++) {
          var rc = rects[q];
          var ox = Math.max(rc[0] - xc, 0, xc - rc[2]), oy = Math.max(rc[1] - yc, 0, yc - rc[3]);
          var q2 = (ox * ox + oy * oy) / (F * F), kq = 1 - Math.exp(-q2 * 3);
          if (kq < keep) keep = kq;
        }
        ib *= keep; ip *= keep;
        var th = B8[(r & 7) * 8 + (c & 7)];
        px[k] = ib > th ? WASH_BLUE : ip > B8[((r + 4) & 7) * 8 + ((c + 4) & 7)] ? WASH_PURPLE : 0;
      }
    }
    this.sctx.putImageData(this.img, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.small, 0, 0, this.canvas.width, this.canvas.height);
  };

  Wash.prototype.start = function () {
    var self = this, last = 0, t0 = performance.now() - (this.t || 0) * 1000;
    this.on = true;
    if (reduce) { this.frame(0); return; }
    if (this.raf) return;
    var step = function (now) {
      self.raf = requestAnimationFrame(step);
      if (now - last < 1000 / 24 - 1) return;                       // 24 fps is plenty for drift
      last = now;
      self.t = (now - t0) / 1000;
      self.frame(self.t);
    };
    this.raf = requestAnimationFrame(step);
  };

  Wash.prototype.pause = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  };

  Wash.prototype.stopAll = function () {
    this.on = false;
    this.pause();
  };

  window.Dither = { Sticker: Sticker, Wash: Wash, textRects: textRects, ENTER: ENTER, hover: hover, reduce: reduce, ease: ease, clamp: clamp };
})();
