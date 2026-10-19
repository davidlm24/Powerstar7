/* Wires the dither engine (dither.js) to the site: the home hero, the
   service icons and the page figures. Loaded by Base.astro after site.js on
   the pages that opt in (the `dither` prop), and armed by html.dither, which
   the inline head script sets when motion is allowed and a canvas exists,
   and withdraws after 2.5s if this script never reports ready, so a
   blocked or slow script can never leave a picture blank.

   Each illustration keeps its static <img> as the initial and no-JS
   render; a canvas is drawn at rest first and only then placed over it, so
   the swap is invisible. The hero's picture is the one exception: its img
   is hidden from first paint (Home.astro) so the develop entrance can play
   from nothing.

   With reduced motion none of this runs (no html.dither): the static dots
   and the CSS fallbacks are what shows. */
(function () {
  'use strict';
  var D = window.Dither, html = document.documentElement;
  if (!D || !html.classList.contains('dither')) return;
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };
  var pointerEffects = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var armed = function () { return html.classList.contains('dither'); };

  /* --- Upgrade one illustration to a live canvas ---------------------------- */

  function upgrade(illo, rest) {
    var canvas = document.createElement('canvas');
    var st = new D.Sticker(canvas, illo.getAttribute('data-illo'), { ink: illo.getAttribute('data-ink') });
    return st.ready.then(function () {
      st.set(rest || {});
      if (armed()) {
        illo.appendChild(canvas);
        illo.classList.add('is-live');
      }
      return st;
    });
  }

  /* Fields load when their picture is near the screen. A rect check, not
     IntersectionObserver: it also fires in a background tab or a hidden
     preview pane, where the observer starves. */
  var near = [];
  var check = function () {
    var h = window.innerHeight || 800;
    near = near.filter(function (n) {
      var r = n.el.getBoundingClientRect();
      if (r.top < h * 1.5 && r.bottom > -h * 0.5) { n.fn(); return false; }
      return true;
    });
  };
  var whenNear = function (el, fn) { near.push({ el: el, fn: fn }); };
  var queued = false;
  var schedule = function () {
    if (queued || !near.length) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; check(); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  /* --- Service icons: full ink, relit from the pointer --------------------- */

  /* The same hover as the home hero's picture (David, 2026-10-19: "same as
     hero illustration hover effect, with opacity always at 100"): the print
     rests at full ink and, while the lane or row is pointed at, is relit
     from the pointer, light near it and dense away from it. It never drops
     below full; leaving fades the light back out. */
  if (pointerEffects) {
    each('[data-illo-zone]', function (zone) {
      var illo = zone.querySelector('.illo--icon');
      if (!illo) return;
      whenNear(zone, function () {
        upgrade(illo).then(function (st) { D.hover(zone, st, 'lit', {}); });
      });
    });

    /* --- Page figures and asides: full at rest, relit from the pointer ----- */

    each('.illo--field, .illo--aside', function (illo) {
      whenNear(illo, function () {
        upgrade(illo).then(function (st) { D.hover(illo.parentElement, st, 'lit', {}); });
      });
    });
  }

  /* --- The home hero ---------------------------------------------------------- */

  var hero = document.querySelector('.hero');
  if (!hero) {
    window.__ditherReady = true;
  } else {
    var pic = hero.querySelector('.hero__pic');
    var deskIllo = pic && pic.querySelector('.hero__desk');
    var sealIllo = pic && pic.querySelector('.hero__check');

    /* The wash: fine dots drifting behind the copy, never under text. Where
       there is no WebGL the CSS wash stays. */
    var dots = hero.querySelector('.hero__dots');
    if (dots) {
      var texts = function () {
        return Array.prototype.slice.call(hero.querySelectorAll('.hero__l1, .hero__l2, .lead, .btn, .callout, [data-wash-clear]'))
          .concat(Array.prototype.slice.call(document.querySelectorAll('.site-header .wordmark, .site-header .nav a, .site-header .nav-toggle')));
      };
      var wash = new D.Wash(dots, hero, { cell: 1, max: 0.16, feather: 90, texts: texts });
      if (!wash.gl) {
        dots.remove();
      } else {
        hero.classList.add('has-dots');
        wash.start();
        /* The dots answer the pointer: a soft glow where the cursor is
           (David, 2026-10-19), still cleared off every line of text. */
        if (pointerEffects) wash.mode = 'glow';
        if (document.fonts) document.fonts.ready.then(function () { wash.resize(); });
        // Nothing to draw once the hero has scrolled away.
        var washVisible = true;
        window.addEventListener('scroll', function () {
          var r = hero.getBoundingClientRect(), vis = r.bottom > 0;
          if (vis !== washVisible) { washVisible = vis; if (vis) wash.start(); else wash.pause(); }
        }, { passive: true });
      }
    }

    /* The landing: the picture develops layer by layer, the seal is stamped
       and develops as it lands, then the highlight wipes in (CSS, keyed on
       .is-run). The CSS clock starts with .is-run, so it can never run ahead
       of the fields. */
    if (deskIllo && sealIllo) {
      Promise.all([upgrade(deskIllo, { reveal: 0 }), upgrade(sealIllo, { reveal: 0 })]).then(function (both) {
        var desk = both[0], seal = both[1];
        window.__ditherReady = true;
        if (!armed()) { desk.set({}); seal.set({}); return; }
        hero.classList.add('is-run');
        setTimeout(function () {
          desk.tween(1000, function (p) { return D.ENTER.layers(p, desk.f.layers); });
        }, 200);
        setTimeout(function () { seal.tween(380, D.ENTER.develop); }, 900);
        if (pointerEffects) {
          D.hover(pic, desk, function () { return hero.classList.contains('is-run') && !desk.anim ? 'lit' : 'none'; }, {});
        }
      }, function () {
        // A field failed to load: show the static picture.
        html.classList.remove('dither');
      });
    } else {
      window.__ditherReady = true;
    }
  }

  check();
})();
