/* =========================================================================
   DesignActiv — site behaviour
   =========================================================================

   Seven things earn their place here: the mobile nav, the sticky header's
   scrolled hairline, the contact form, the section entrances, the footer
   year, the hero wash, and the euro/real toggle on the prices. The entrances came back on 2026-10-16 at David's
   call (the taste-skill audit's motion layer): each section's parts once, in
   order, never for reduced motion, and never able to leave content hidden.

   The cursor-revealed mark field left with the dark bands it lived on — dark
   is the footer's alone now, and the footer has no field.

   The header frost and the button sheen came back deliberately, each as one
   rAF-throttled listener rather than the unthrottled handlers they replaced.
   The sheen is drawn in dots now, the same Bayer print as the illustrations.

   No dependencies, no external requests. With JavaScript off the navigation
   stays open and the form falls back to the browser's own validation.
   ========================================================================= */
(function () {
  'use strict';

  /* Pointer-driven effects are registered only where there is a real pointer
     and the visitor has not asked for less motion. Read once, used by both
     the hero wash and the button sheen, so the two can never disagree. */
  var pointerEffects =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ----------------------------------------- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (toggle && nav) {
    var mq = window.matchMedia('(max-width: 60rem)');

    var setOpen = function (open) {
      nav.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute(
        'aria-label',
        open ? toggle.dataset.labelClose : toggle.dataset.labelOpen
      );
      // Stop the page scrolling behind the open panel.
      document.body.style.overflow = open && mq.matches ? 'hidden' : '';
    };

    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(nav.dataset.open !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && mq.matches) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.dataset.open === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (
        nav.dataset.open === 'true' &&
        mq.matches &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        setOpen(false);
      }
    });

    // Returning to desktop width must clear the mobile-only state.
    mq.addEventListener('change', function () {
      if (!mq.matches) setOpen(false);
    });
  }

  /* ---------- Sticky header frost ---------------------------------------- */

  /* Toggles one class once the page has moved. rAF-throttled: the flag lives
     outside the callback so a burst of scroll events schedules a single frame,
     and the listener is passive so it never blocks scrolling.

     No threshold games and no hysteresis — the transition is a fade, so a
     class that flips on and off around the boundary looks like a fade, not a
     flicker. */
  var header = document.querySelector('.site-header');

  if (header) {
    var frostQueued = false;

    var applyFrost = function () {
      frostQueued = false;
      header.classList.toggle('is-stuck', window.scrollY > 4);
    };

    window.addEventListener(
      'scroll',
      function () {
        if (frostQueued) return;
        frostQueued = true;
        window.requestAnimationFrame(applyFrost);
      },
      { passive: true }
    );

    // Reloading part-way down a page must not start unfrosted.
    applyFrost();
  }

  /* ---------- The print coming up ---------------------------------------- */

  /* Text that changes in answer to the visitor prints in dots (global.css
     .print-now): the class is taken off and put back, with a layout read
     between so the browser sees two changes and restarts the keyframes.
     The CSS is keyed on html.reveal, so with reduced motion or no masks
     this is a class toggle and nothing more. Screen readers are untouched:
     the text is set first, in full. */
  var reprint = function (el) {
    el.classList.remove('print-now');
    void el.offsetWidth;
    el.classList.add('print-now');
  };

  /* ---------- Contact form ----------------------------------------------- */

  var form = document.querySelector('form[data-contact]');

  if (form) {
    var statusEl = form.querySelector('.form__status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var copy = JSON.parse(form.dataset.copy || '{}');

    /* The reply prints in dots each time it changes, and once the message
       has gone the form keeps .is-sent (Contact.astro: the corner goes
       dense and stays), so the end of the only thing a visitor DOES on this
       site is answered in the site's own ink and not only in 15px of text. */
    var setStatus = function (kind, text) {
      if (!statusEl) return;
      statusEl.dataset.kind = kind;
      statusEl.textContent = text;
      reprint(statusEl);
      form.classList.toggle('is-sent', kind === 'ok');
    };

    /* Authored validation, deliberately not reportValidity().

       The browser's own bubble shows one error at a time, disappears on
       blur, cannot be styled — and is written in the *browser's* locale.
       A German visitor reading an English form got German error text, on a
       page that controls every other pixel. This site is bilingual by
       design, so the strings come from the page (data-copy) and always
       match the language the visitor is actually reading. */

    var FIELDS = [
      { id: 'name', message: copy.name },
      { id: 'email', message: copy.email },
      { id: 'message', message: copy.message },
    ];

    var errorFor = function (input) {
      var holder = document.getElementById(input.id + '-error');
      if (!holder) {
        holder = document.createElement('p');
        holder.id = input.id + '-error';
        holder.className = 'field__error';
        input.insertAdjacentElement('afterend', holder);
      }
      return holder;
    };

    var clearError = function (input) {
      input.removeAttribute('aria-invalid');
      var holder = document.getElementById(input.id + '-error');
      if (holder) holder.textContent = '';
    };

    var showError = function (input, text) {
      var holder = errorFor(input);
      holder.textContent = text;
      input.setAttribute('aria-invalid', 'true');
      var described = (input.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter(Boolean);
      if (described.indexOf(holder.id) === -1) described.push(holder.id);
      input.setAttribute('aria-describedby', described.join(' '));
    };

    var validate = function () {
      var firstBad = null;
      var count = 0;

      FIELDS.forEach(function (spec) {
        var input = form.querySelector('#' + spec.id);
        if (!input) return;

        var value = input.value.trim();
        var message = spec.message;
        var bad = !value;

        // Deliberately forgiving: catches typos, not unusual-but-valid addresses.
        if (!bad && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          bad = true;
          message = copy.emailFormat;
        }

        if (bad) {
          showError(input, message);
          if (!firstBad) firstBad = input;
          count++;
        } else {
          clearError(input);
        }
      });

      if (count) {
        setStatus(
          'error',
          count === 1 ? copy.one : String(copy.many).replace('{n}', count)
        );
        if (firstBad) firstBad.focus();
      }

      return count === 0;
    };

    // Clear a field's error as soon as the visitor fixes it.
    form.addEventListener('input', function (e) {
      if (e.target.id && e.target.getAttribute('aria-invalid')) clearError(e.target);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      // Honeypot: accept and discard, so a bot learns nothing from the reply.
      var trap = form.querySelector('input[name="website"]');
      if (trap && trap.value) {
        setStatus('ok', copy.ok);
        form.reset();
        return;
      }

      var endpoint = form.dataset.endpoint;
      var email = form.dataset.mailto;
      var data = new FormData(form);
      data.delete('website');

      if (!endpoint) {
        /* No handler configured yet. The previous site opened a mailto: and
           then reported success — whether or not a mail client existed, and
           whether or not anything was ever sent. It cannot know, so it no
           longer claims to: the message says what it is attempting. */
        if (!email) {
          setStatus('error', String(copy.unconfigured).replace('{email}', ''));
          return;
        }
        /* The subject prefix comes from the page's copy like every other
           string here, so a Portuguese visitor is not handed an English
           subject line. The English fallback only covers a page that
           predates the key; with no topic, there is no dangling dash. */
        window.location.href =
          'mailto:' + email +
          '?subject=' + encodeURIComponent(
            [copy.subject || 'Website enquiry', data.get('topic')].filter(Boolean).join(' — ')
          ) +
          '&body=' + encodeURIComponent(
            (data.get('name') || '') + '\n' +
            (data.get('email') || '') + '\n' +
            (data.get('company') || '') + '\n\n' +
            (data.get('message') || '')
          );
        setStatus('busy', String(copy.mailtoOpening).replace('{email}', email));
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setStatus('busy', copy.sending);

      fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          setStatus('ok', copy.ok);
          form.reset();
        })
        .catch(function () {
          setStatus('error', String(copy.fail).replace('{email}', email || ''));
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ---------- Section entrances ----------------------------------------- */

  /* Armed by the .reveal class Base.astro sets before first paint (motion
     allowed, IntersectionObserver present). Each section's parts enter in
     order as they scroll in, 70ms apart within their section, once. The
     selector list matches global.css exactly. */
  var REVEAL = "h1, h2, .lead, .illo--field, .illo--aside, .svc-card, .point, .step, .project, .plan, .addons, .svc, .faq-item, .closing__link, .exhibit__body, .details, .prose > *, .how__item, .contact__inner > *, .notice, .updated";
  if (document.documentElement.classList.contains('reveal')) {
    var pending = [];
    Array.prototype.forEach.call(document.querySelectorAll('main > :not(.hero)'), function (section) {
      Array.prototype.forEach.call(section.querySelectorAll(REVEAL), function (el, i) {
        el.style.setProperty('--reveal-delay', Math.min(i, 6) * 70 + 'ms');
        pending.push(el);
      });
    });

    var enter = function (el) {
      el.classList.add('is-in');
      pending.splice(pending.indexOf(el), 1);
    };

    /* Whatever is on screen right now enters at once, with no observer in
       the way: a renderer that never scrolls or never ticks an observer
       (link previews, screenshots, a throttled tab) still shows the first
       screen. */
    var inView = function (el) {
      var r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
    };
    pending.slice().forEach(function (el) { if (inView(el)) enter(el); });
    window.__revealReady = true;

    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.target.classList.contains('is-in')) return;
        enter(entry.target);
        seen.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    pending.forEach(function (el) { seen.observe(el); });

    /* A second path for the same thing, in case the observer is starved:
       on scroll, anything that has reached the screen enters. */
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking || !pending.length) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        pending.slice().forEach(function (el) { if (inView(el)) enter(el); });
      });
    }, { passive: true });
  }

  /* ---------- Footer year ------------------------------------------------ */

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Hero wash follows the cursor -------------------------------- */

  /* The two colour fields shift a few percent against the pointer, in opposite
     directions, so the hero has a little parallax without becoming a toy. The
     drift animation keeps running underneath; this only moves the gradient
     centres, which is a paint, not a layout.

     clientX/clientY are stashed and the rect is read inside the frame — doing
     getBoundingClientRect() in the event handler would force layout on every
     pointer event, which is the cost the throttle exists to avoid. */
  var hero = document.querySelector('.hero');

  if (hero && pointerEffects) {
    var heroQueued = false;
    var heroPoint = null;

    var applyHero = function () {
      heroQueued = false;
      var r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var x = heroPoint ? ((heroPoint.x - r.left) / r.width) * 2 - 1 : 0;
      var y = heroPoint ? ((heroPoint.y - r.top) / r.height) * 2 - 1 : 0;
      hero.style.setProperty('--hx', Math.max(-1, Math.min(1, x)).toFixed(3));
      hero.style.setProperty('--hy', Math.max(-1, Math.min(1, y)).toFixed(3));
    };

    var scheduleHero = function () {
      if (heroQueued) return;
      heroQueued = true;
      window.requestAnimationFrame(applyHero);
    };

    hero.addEventListener(
      'pointermove',
      function (e) {
        heroPoint = { x: e.clientX, y: e.clientY };
        scheduleHero();
      },
      { passive: true }
    );

    // Leaving the hero returns the wash to centre rather than freezing it.
    hero.addEventListener(
      'pointerleave',
      function () {
        heroPoint = null;
        scheduleHero();
      },
      { passive: true }
    );
  }

  /* ---------- Button sheen: dots ------------------------------------------ */

  /* The sheen that follows the pointer across a button, drawn as ordered
     dither instead of a soft gradient (David, 2026-10-19: "buttons can use
     the dot sheen"), the same Bayer print the illustrations are made of.

     A canvas is added to a button the first time it is hovered or focused,
     under the label (z-index -1 inside the button's own stacking context),
     and the CSS gradient sheen is switched off on it (.has-dots). With no
     JavaScript the CSS sheen still works.

     Contrast is the cap. On the solid button the dots are --blue over the
     --blue-hover fill, and white on solid --blue is 4.43:1, which fails AA.
     So the dots never pass CAP_SOLID: at 60% the label's backdrop averages
     out at 5.4:1. The quiet button turns dark on hover (global.css), so its
     dots are the on-ink blue at no more than 38%: the paper label's backdrop
     averages 4.9:1 at the glow's centre. Inside .invert the swap goes light
     and the dots are ink at the same cap, which keeps that label near 10:1.

     One delegated, rAF-throttled pointer listener, as before; skipped on
     touch and for reduced motion (pointerEffects). Keyboard focus shows
     the dots at the centre, still, for everyone. */
  var CAP_SOLID = 0.6, CAP_QUIET = 0.38;
  var SPREAD_SOLID = 3600, SPREAD_QUIET = 2600;           // px²: the glow's reach

  /* 8x8 Bayer, the illustrations' matrix: 64 steps, so the glow fades
     smoothly even at the quiet button's low density. */
  var B8 = (function () {
    var m = [[0]];
    for (var n = 1; n < 8; n *= 2) {
      var b = [];
      for (var j = 0; j < n * 2; j++) b.push([]);
      for (j = 0; j < n; j++) for (var i = 0; i < n; i++) {
        var v = m[j][i] * 4;
        b[j][i] = v; b[j][i + n] = v + 2; b[j + n][i] = v + 3; b[j + n][i + n] = v + 1;
      }
      m = b;
    }
    var out = [];
    for (j = 0; j < 8; j++) for (i = 0; i < 8; i++) out.push((m[j][i] + 0.5) / 64);
    return out;
  })();

  var dotsFor = function (btn) {
    if (btn.__dots) return btn.__dots;
    var c = document.createElement('canvas');
    c.className = 'btn__dots';
    c.setAttribute('aria-hidden', 'true');
    btn.insertBefore(c, btn.firstChild);
    btn.classList.add('has-dots');
    var quiet = btn.classList.contains('btn--quiet');
    var onInk = quiet && btn.closest('.invert');
    var d = {
      c: c, x: c.getContext('2d'), on: 0, pt: null, raf: 0,
      cap: quiet ? CAP_QUIET : CAP_SOLID,
      spread: quiet ? SPREAD_QUIET : SPREAD_SOLID,
      // little-endian RGBA words: --blue, --ink, --on-ink-blue
      colour: !quiet ? 0xffff6f0e : onInk ? 0xff171b1c : 0xffff9d5c,
    };
    var r = btn.getBoundingClientRect();
    c.width = Math.max(1, Math.round(r.width));
    c.height = Math.max(1, Math.round(r.height));
    d.img = d.x.createImageData(c.width, c.height);
    d.px = new Uint32Array(d.img.data.buffer);
    btn.__dots = d;
    return d;
  };

  var drawDots = function (d) {
    var W = d.c.width, H = d.c.height, px = d.px, pt = d.pt, amt = d.cap * d.on;
    for (var j = 0; j < H; j++) for (var i = 0; i < W; i++) {
      var v = 0;
      if (pt && amt > 0) {
        var dx = i - pt.x, dy = j - pt.y;
        v = amt * Math.exp(-(dx * dx + dy * dy) / d.spread);
      }
      px[j * W + i] = v > B8[(j & 7) * 8 + (i & 7)] ? d.colour : 0;
    }
    d.x.putImageData(d.img, 0, 0);
  };

  /* Fade the dots in or out over 180ms: the density thins, Bayer order. */
  var fadeDots = function (d, to) {
    cancelAnimationFrame(d.raf);
    if (!pointerEffects) { d.on = to; drawDots(d); return; }
    var from = d.on, t0 = 0;
    var step = function (now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / 180);
      d.on = from + (to - from) * p;
      drawDots(d);
      if (p < 1) d.raf = requestAnimationFrame(step);
    };
    d.raf = requestAnimationFrame(step);
  };

  var buttonOf = function (e) {
    var btn = e.target.closest && e.target.closest('.btn');
    return btn && !btn.disabled ? btn : null;
  };

  /* sheenPending, not pending: every var in this file shares one function
     scope, and the section entrances above keep their waiting list in
     `pending`. The sheen used the same name, set it to null at start-up,
     and from then on every entrance callback threw after its first element
     (one part entered per observer callback, the rest stayed at opacity 0
     until another crossed) and the scroll fallback never ran. Found on
     2026-10-19 while verifying the print entrances. */
  if (pointerEffects) {
    var sheenPending = null;
    var queued = false;

    document.addEventListener('pointerover', function (e) {
      var btn = buttonOf(e);
      if (!btn || (e.relatedTarget && btn.contains(e.relatedTarget))) return;
      var d = dotsFor(btn), r = btn.getBoundingClientRect();
      d.pt = { x: e.clientX - r.left, y: e.clientY - r.top };
      fadeDots(d, 1);
    });

    document.addEventListener('pointerout', function (e) {
      var btn = buttonOf(e);
      if (!btn || !btn.__dots || (e.relatedTarget && btn.contains(e.relatedTarget))) return;
      if (btn.matches(':focus-visible')) return;
      fadeDots(btn.__dots, 0);
    });

    /* `queued` lives OUTSIDE `sheenPending` on purpose: it is replaced on
       every move, so a flag stored on it would read undefined each time and
       schedule a frame per event, the cost this throttle exists to avoid. */
    document.addEventListener(
      'pointermove',
      function (e) {
        var btn = buttonOf(e);
        if (!btn) return;
        sheenPending = { btn: btn, x: e.clientX, y: e.clientY };
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () {
          queued = false;
          if (!sheenPending) return;
          var d = dotsFor(sheenPending.btn), r = sheenPending.btn.getBoundingClientRect();
          d.pt = { x: sheenPending.x - r.left, y: sheenPending.y - r.top };
          if (d.on >= 1) drawDots(d);
          sheenPending = null;
        });
      },
      { passive: true }
    );
  }

  document.addEventListener('focusin', function (e) {
    var btn = buttonOf(e);
    if (!btn || !btn.matches(':focus-visible')) return;
    var d = dotsFor(btn);
    d.pt = { x: d.c.width / 2, y: d.c.height / 2 };
    fadeDots(d, 1);
  });

  document.addEventListener('focusout', function (e) {
    var btn = buttonOf(e);
    if (btn && btn.__dots && !btn.matches(':hover')) fadeDots(btn.__dots, 0);
  });

  /* ---------- Card dither: the proximity glow -------------------------------

     Cards (.dcard, global.css) carry a corner of Bayer dots at rest. On a
     fine pointer, a canvas is added under the card's content the first time
     it is hovered or focused, and draws a glow of dots around the POINTER
     (David, 2026-10-20: "on hover some proximity cursor animation, not just
     move outside"): the same ordered dither as everything else, coverage
     highest at the cursor and falling off with distance, so it thickens
     through blue to purple at its core, the tritone's two light inks.

     Never behind readable text. The text's line boxes (and the buttons)
     are measured when the card is entered, and the glow is multiplied by a
     clearing map that fades to nothing within ~18px of any of them, the way
     the hero wash keeps clear of the headline. Inside a dark card (.invert)
     the dots are the single on-ink blue, since the tritone's dark would
     vanish there.

     Cost: only the window round the pointer (3 sigma) is drawn each frame,
     from a lookup of the falloff, into one reused ImageData; the previous
     window is cleared, nothing else is touched. One delegated, rAF-
     throttled listener set, skipped on touch and for reduced motion
     (pointerEffects), where the CSS corner is all there is. */
  var CARD_SIGMA = 66;                    // css px: the glow's reach
  var CARD_PEAK = 0.56;                   // coverage at the pointer
  var CARD_CELL = 4, CARD_FEATHER = 26;   // the clearing map: cell and fade, css px
  /* little-endian RGBA words: --blue-fn (as the tritone), violet, --on-ink-blue */
  var CARD_BLUE = 0xfffd6f17, CARD_PURPLE = 0xffe43965, CARD_ON_INK = 0xffff9d5c;

  var dcardOf = function (el) {
    return el && el.closest ? el.closest('.dcard') : null;
  };

  /* The clearing map: 1 = free, falling to 0 beside text. */
  var dcardMeasure = function (card, d) {
    var r = card.getBoundingClientRect();
    d.w = r.width; d.h = r.height;
    d.cols = Math.max(1, Math.ceil(d.w / CARD_CELL));
    d.rows = Math.max(1, Math.ceil(d.h / CARD_CELL));
    d.c.width = Math.max(1, Math.round(d.w * d.dpr));
    d.c.height = Math.max(1, Math.round(d.h * d.dpr));
    var keep = d.keep && d.keep.length === d.cols * d.rows ? d.keep : new Float32Array(d.cols * d.rows);
    keep.fill(1);
    var boxes = [];
    var add = function (b) {
      if (b.width < 1 || b.height < 1) return;
      boxes.push([b.left - r.left, b.top - r.top, b.right - r.left, b.bottom - r.top]);
    };
    var walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT), n, range = document.createRange();
    while ((n = walker.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      range.selectNodeContents(n);
      Array.prototype.forEach.call(range.getClientRects(), add);
    }
    Array.prototype.forEach.call(card.querySelectorAll('.btn, input, select, textarea'), function (el) { add(el.getBoundingClientRect()); });
    var reach = CARD_FEATHER * 2.2;
    boxes.forEach(function (b) {
      var c0 = Math.max(0, Math.floor((b[0] - reach) / CARD_CELL)), c1 = Math.min(d.cols - 1, Math.ceil((b[2] + reach) / CARD_CELL));
      var r0 = Math.max(0, Math.floor((b[1] - reach) / CARD_CELL)), r1 = Math.min(d.rows - 1, Math.ceil((b[3] + reach) / CARD_CELL));
      for (var j = r0; j <= r1; j++) {
        var cy = (j + 0.5) * CARD_CELL, dy = Math.max(b[1] - cy, 0, cy - b[3]);
        for (var i = c0; i <= c1; i++) {
          var cx = (i + 0.5) * CARD_CELL, dx = Math.max(b[0] - cx, 0, cx - b[2]);
          var q = Math.sqrt(dx * dx + dy * dy) / CARD_FEATHER;
          var k = 1 - Math.exp(-q * q * 3);
          if (k < keep[j * d.cols + i]) keep[j * d.cols + i] = k;
        }
      }
    });
    d.keep = keep;
  };

  var dcardInit = function (card) {
    var c = document.createElement('canvas');
    c.className = 'dcard__dots';
    c.setAttribute('aria-hidden', 'true');
    card.insertBefore(c, card.firstChild);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    /* the falloff, by squared distance in device px, in bins of 4 */
    var R = Math.ceil(CARD_SIGMA * 3 * dpr), nb = Math.ceil((R * R) / 4) + 2, lut = new Float32Array(nb);
    var s2 = 1 / (2 * CARD_SIGMA * CARD_SIGMA * dpr * dpr);
    for (var q = 0; q < nb; q++) lut[q] = Math.exp(-q * 4 * s2);
    var d = {
      c: c, x: c.getContext('2d'), dpr: dpr, R: R, lut: lut, on: 0, pt: null, raf: 0,
      img: null, last: null, keep: null, dark: !!card.closest('.invert'), card: card,
    };
    card.__dc = d;
    return d;
  };

  var dcardDraw = function (d) {
    var cw = d.c.width, ch = d.c.height;
    if (d.last) d.x.clearRect(d.last[0], d.last[1], d.last[2], d.last[3]);
    d.last = null;
    if (!d.pt || d.on <= 0.004) return;
    var dpr = d.dpr, R = d.R, cx = d.pt.x * dpr, cy = d.pt.y * dpr;
    var x0 = Math.max(0, Math.floor(cx - R)), y0 = Math.max(0, Math.floor(cy - R));
    var x1 = Math.min(cw, Math.ceil(cx + R)), y1 = Math.min(ch, Math.ceil(cy + R));
    var w = x1 - x0, h = y1 - y0;
    if (w <= 0 || h <= 0) return;
    if (!d.img || d.img.width !== w || d.img.height !== h) {
      d.img = d.x.createImageData(w, h);
      d.px = new Uint32Array(d.img.data.buffer);
    } else {
      d.px.fill(0);
    }
    var px = d.px, amp = CARD_PEAK * d.on, lut = d.lut, keep = d.keep, cols = d.cols, rows = d.rows;
    var R2 = R * R, inv = 1 / (dpr * CARD_CELL);
    for (var j = 0; j < h; j++) {
      var gy = y0 + j, dy = gy - cy, row = Math.min(rows - 1, (gy * inv) | 0) * cols, brow = (gy & 7) * 8;
      for (var i = 0; i < w; i++) {
        var gx = x0 + i, dx = gx - cx, d2 = dx * dx + dy * dy;
        if (d2 > R2) continue;
        var v = amp * lut[(d2 * 0.25) | 0];
        if (v < 0.02) continue;
        v *= keep[row + Math.min(cols - 1, (gx * inv) | 0)];
        if (v > B8[brow + (gx & 7)]) px[j * w + i] = d.dark ? CARD_ON_INK : v < 0.45 ? CARD_BLUE : CARD_PURPLE;
      }
    }
    d.x.putImageData(d.img, x0, y0);
    d.last = [x0, y0, w, h];
  };

  var dcardFade = function (d, to) {
    cancelAnimationFrame(d.raf);
    var from = d.on, t0 = 0, ms = to > from ? 160 : 260;
    var step = function (now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / ms);
      d.on = from + (to - from) * p;
      dcardDraw(d);
      if (p < 1) d.raf = requestAnimationFrame(step);
    };
    d.raf = requestAnimationFrame(step);
  };

  var dcardPoint = function (d, x, y) {
    var r = d.card.getBoundingClientRect();
    d.pt = { x: x - r.left, y: y - r.top };
  };

  if (pointerEffects) {
    var cardPending = null, cardQueued = false;

    document.addEventListener('pointerover', function (e) {
      var card = dcardOf(e.target);
      if (!card || (e.relatedTarget && card.contains(e.relatedTarget))) return;
      var d = card.__dc || dcardInit(card);
      dcardMeasure(card, d);
      dcardPoint(d, e.clientX, e.clientY);
      dcardFade(d, 1);
    });

    document.addEventListener('pointerout', function (e) {
      var card = dcardOf(e.target);
      if (!card || !card.__dc || (e.relatedTarget && card.contains(e.relatedTarget))) return;
      if (card.matches(':focus-within') && card.querySelector(':focus-visible')) return;
      dcardFade(card.__dc, 0);
    });

    /* `cardQueued` lives outside `cardPending` for the same reason the
       sheen's does: the object is replaced on every move. */
    document.addEventListener('pointermove', function (e) {
      var card = dcardOf(e.target);
      if (!card || !card.__dc || card.__dc.on <= 0) return;
      cardPending = { d: card.__dc, x: e.clientX, y: e.clientY };
      if (cardQueued) return;
      cardQueued = true;
      requestAnimationFrame(function () {
        cardQueued = false;
        if (!cardPending) return;
        dcardPoint(cardPending.d, cardPending.x, cardPending.y);
        if (cardPending.d.on >= 1) dcardDraw(cardPending.d);
        cardPending = null;
      });
    }, { passive: true });

    /* Keyboard: the glow sits on the focused control, still. */
    document.addEventListener('focusin', function (e) {
      var card = dcardOf(e.target);
      if (!card || !e.target.matches || !e.target.matches(':focus-visible')) return;
      var d = card.__dc || dcardInit(card);
      dcardMeasure(card, d);
      var b = e.target.getBoundingClientRect();
      dcardPoint(d, b.left + b.width / 2, b.top + b.height / 2);
      dcardFade(d, 1);
    });

    document.addEventListener('focusout', function (e) {
      var card = dcardOf(e.target);
      if (card && card.__dc && !card.matches(':hover')) dcardFade(card.__dc, 0);
    });
  }

  /* ---------- Price currency --------------------------------------------
     Services only. Every price is drawn in euros with its reais in data-brl;
     this swaps the text and remembers the choice. Without JavaScript the
     toggle stays hidden and the prices stay in euros, which is what they are
     set in. */

  var currency = document.querySelector('[data-currency]');

  if (currency) {
    var currencyNote = document.querySelector('[data-currency-note]');
    var priceEls = document.querySelectorAll('.price[data-eur]');
    var currencyBtns = currency.querySelectorAll('button[data-cur]');
    var CURRENCY_KEY = 'designactiv-currency';

    /* Each price re-prints as it swaps (240ms in dots), so the visitor who
       looked up to press BRL and back sees WHICH numbers were re-expressed
       rather than a page where figures silently changed. Skipped on the
       remembered choice at load: nothing changed in front of anyone. */
    var setCurrency = function (cur, remember) {
      for (var i = 0; i < priceEls.length; i++) {
        priceEls[i].textContent = priceEls[i].dataset[cur];
        if (remember) reprint(priceEls[i]);
      }
      for (var j = 0; j < currencyBtns.length; j++) {
        currencyBtns[j].setAttribute('aria-pressed', String(currencyBtns[j].dataset.cur === cur));
      }
      if (currencyNote) currencyNote.hidden = cur !== 'brl';
      if (remember) {
        try {
          window.localStorage.setItem(CURRENCY_KEY, cur);
        } catch (e) {}
      }
    };

    currency.hidden = false;

    for (var k = 0; k < currencyBtns.length; k++) {
      currencyBtns[k].addEventListener('click', function (e) {
        setCurrency(e.currentTarget.dataset.cur, true);
      });
    }

    var savedCurrency = null;
    try {
      savedCurrency = window.localStorage.getItem(CURRENCY_KEY);
    } catch (e) {}
    if (savedCurrency === 'brl') setCurrency('brl', false);
  }

})();
