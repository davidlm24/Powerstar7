/* Wires the dither lab page (src/pages/lab/dither.astro) to dither.js. */
(function () {
  'use strict';
  var D = window.Dither;
  if (!D) return;

  var root = document.querySelector('.dz');
  var hero = document.querySelector('.dz-hero');
  if (!root || !hero) return;
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };

  var sticker = function (canvas) { return new D.Sticker(canvas, canvas.getAttribute('data-dither')); };

  /* --- Controls: each fieldset writes its value to a data attribute ------ */
  var restSel = document.querySelector('[data-rest]');
  var targets = { bg: hero, enter: hero, fill: hero, hover: hero, dot: root, cell: root, rest: restSel };
  each('fieldset[data-for]', function (fs) {
    var key = fs.getAttribute('data-for');
    fs.addEventListener('change', function (e) {
      targets[key].setAttribute('data-' + key, e.target.value);
      if (key === 'bg') setBg();
      if (key === 'cell') { wash.cell = parseFloat(e.target.value); wash.resize(); wash.frame(wash.t || 0); }
      if (key === 'enter' || key === 'fill') runHero();
      if (key === 'rest') resetIcons();
      if (key === 'dot') sheens.forEach(function (s) { s.resize(); });
    });
  });

  /* --- Hero: background ---------------------------------------------------- */
  var heroTexts = function () {
    return Array.prototype.slice.call(hero.querySelectorAll('.dz-hero__l, .lead, .btn, .callout'))
      .concat(Array.prototype.slice.call(document.querySelectorAll('.site-header .wordmark, .site-header .nav a')));
  };
  var wash = new D.Wash(hero.querySelector('.dz-hero__dots'), hero, { cell: 1, max: 0.16, feather: 90, texts: heroTexts });
  if (document.fonts) document.fonts.ready.then(function () { wash.resize(); });
  function setBg() {
    var bg = hero.getAttribute('data-bg');
    if (bg === 'wash') { wash.stopAll(); return; }
    wash.mode = bg === 'dots' ? 'flow' : bg;
    wash.start();
  }
  setBg();

  /* --- Hero: the picture ---------------------------------------------------- */
  var desk = sticker(hero.querySelector('.dz-desk'));
  var seal = sticker(hero.querySelector('.dz-check'));

  function runHero() {
    var mode = hero.getAttribute('data-enter');
    hero.classList.remove('is-run');
    void hero.offsetWidth;                         // restart the CSS animations
    Promise.all([desk.ready, seal.ready]).then(function () {
      hero.classList.add('is-ready', 'is-run');
      if (mode === 'slap' || D.reduce) {
        desk.stop(); desk.set({});
        seal.stop(); seal.set({});
        return;
      }
      desk.set({ reveal: 0 });
      seal.set({ reveal: 0 });
      setTimeout(function () {
        desk.tween(1000, function (p) {
          return mode === 'layers' ? D.ENTER.layers(p, desk.f.layers) : D.ENTER[mode](p);
        });
      }, 200);
      // The seal is stamped (CSS) at 900ms and develops while it lands.
      setTimeout(function () { seal.tween(380, D.ENTER.develop); }, 900);
    });
  }
  runHero();
  document.querySelector('[data-replay="hero"]').addEventListener('click', runHero);

  D.hover(hero.querySelector('.dz-hero__pic'), desk, function () {
    return hero.classList.contains('is-run') && !desk.anim ? hero.getAttribute('data-hover') : 'none';
  }, {});

  /* --- Icons --------------------------------------------------------------- */
  var restState = function () { return restSel.getAttribute('data-rest') === 'sparse' ? { gain: 0.3 } : {}; };
  var icons = [];
  each('.dz-card', function (card) {
    var c = card.querySelector('canvas');
    var st = sticker(c);
    st.ready.then(function () { st.set(restState()); });
    icons.push(D.hover(card, st, c.getAttribute('data-kind'), restState));
  });
  function resetIcons() { icons.forEach(function (h) { h.reset(); }); }

  /* --- Figures: play on view ---------------------------------------------- */
  var figs = {};
  each('.dz-figc', function (c) {
    var st = sticker(c);
    var kind = c.getAttribute('data-enter');
    var play = function () { st.ready.then(function () { st.tween(1100, D.ENTER[kind]); }); };
    figs[c.getAttribute('data-dither')] = { st: st, play: play, played: false };
    st.ready.then(function () { if (!D.reduce) st.set({ reveal: 0 }); });
  });
  var seenAll = function () {
    Object.keys(figs).forEach(function (k) {
      var f = figs[k], r = f.st.canvas.getBoundingClientRect();
      if (!f.played && r.top < innerHeight * 0.85 && r.bottom > 0) { f.played = true; f.play(); }
    });
  };
  // A scroll check rather than IntersectionObserver: it also works in a
  // background tab or a hidden preview pane, where the observer starves.
  window.addEventListener('scroll', seenAll, { passive: true });
  Object.keys(figs).forEach(function (k) { figs[k].st.ready.then(seenAll); });
  each('[data-replay]', function (b) {
    var k = b.getAttribute('data-replay');
    if (figs[k]) b.addEventListener('click', function () { figs[k].play(); });
  });

  /* --- Gallery: every illustration, at rest ------------------------------- */
  each('.dz-gallery canvas', function (c) { sticker(c); });

  /* --- CSS-only buttons: arm the reverse animation after the first hover --- */
  each('.dz-b-dissolve, .dz-uline, .dz-link', function (el) {
    var arm = function () { el.classList.add('dz-armed'); };
    el.addEventListener('pointerenter', arm, { once: true });
    el.addEventListener('focus', arm, { once: true });
  });
  each('.dz a[href="#"]', function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* --- Dot sheen ----------------------------------------------------------- */
  var B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function Sheen(btn) {
    var c = btn.querySelector('canvas'), x = c.getContext('2d'), pt = null, on = 0, raf = 0, self = this;
    this.resize = function () {
      var dot = parseFloat(getComputedStyle(root).getPropertyValue('--dot')) || 1;
      var r = btn.getBoundingClientRect();
      self.dot = dot;
      c.width = Math.max(1, Math.ceil(r.width / dot));
      c.height = Math.max(1, Math.ceil(r.height / dot));
      self.img = x.createImageData(c.width, c.height);
      self.px = new Uint32Array(self.img.data.buffer);
      draw();
    };
    var draw = function () {
      var W = c.width, H = c.height, px = self.px, d = self.dot;
      for (var j = 0; j < H; j++) for (var i = 0; i < W; i++) {
        var v = 0;
        if (pt && on > 0) {
          var dx = i * d - pt.x, dy = j * d - pt.y;
          v = 0.75 * on * Math.exp(-(dx * dx + dy * dy) / 2400);
        }
        px[j * W + i] = v > (B4[(j & 3) * 4 + (i & 3)] + 0.5) / 16 ? 0xffff6f0e : 0;   // --blue
      }
      x.putImageData(self.img, 0, 0);
    };
    var fade = function (to) {
      cancelAnimationFrame(raf);
      if (D.reduce) { on = to; draw(); return; }
      var from = on, t0 = 0;
      var step = function (now) {
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / 220);
        on = from + (to - from) * p;
        draw();
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      pt = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (on >= 1) draw();
    });
    btn.addEventListener('pointerenter', function () { fade(1); });
    btn.addEventListener('pointerleave', function () { fade(0); });
    btn.addEventListener('focus', function () { var r = btn.getBoundingClientRect(); pt = { x: r.width / 2, y: r.height / 2 }; fade(1); });
    btn.addEventListener('blur', function () { fade(0); });
    this.resize();
  }
  var sheens = [];
  each('.dz-b-sheen', function (b) { sheens.push(new Sheen(b)); });
  window.addEventListener('resize', function () { sheens.forEach(function (s) { s.resize(); }); });
})();
