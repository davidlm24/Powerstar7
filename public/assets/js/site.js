/* =========================================================================
   DesignActiv — site behaviour
   =========================================================================

   Seven things earn their place here: the mobile nav, the sticky header's
   scrolled hairline, the contact form, the section entrances, the footer
   year, the button sheen, and the euro/real toggle on the prices. The
   entrances came back on 2026-10-16 at David's call (the taste-skill
   audit's motion layer): each section's parts once, in order, never for
   reduced motion, and never able to leave content hidden. The theme switch
   lives in Header.astro and the hero's pixels in hero-pixels.js; this file
   only listens for the theme change, to redraw the button dots.

   The cursor-revealed mark field left with the dark bands it lived on — dark
   is the footer's alone now, and the footer has no field.

   The header frost and the button sheen came back deliberately, each as one
   rAF-throttled listener rather than the unthrottled handlers they replaced.
   The sheen is drawn in dots now, in Bayer order.

   No dependencies, no external requests. With JavaScript off the navigation
   stays open (Header.astro, html.no-js) and the form shows the email address
   instead of a Send button (Contact.astro, <noscript>). Each block below is
   its own try/catch, so a failure in one never stops the ones after it: in
   particular the section entrances must always reach their ready flag, or
   Base.astro's 2.5s fail-safe is the only thing showing the page.
   ========================================================================= */
(function () {
  'use strict';

  /* Pointer-driven effects are registered only where there is a real pointer
     and the visitor has not asked for less motion. Read once, used by the
     button sheen. */
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

    /* Keyboard: Tab past the last link (or Shift+Tab before the button) and
       the panel closes, so the focus never lands on page content hidden
       under the open panel (WCAG 2.4.11). relatedTarget is null when focus
       leaves the document or goes to a non-focusable click, so those are
       left to the click and Escape handlers above. */
    var header = toggle.closest('header') || document.body;
    header.addEventListener('focusout', function (e) {
      if (
        nav.dataset.open === 'true' &&
        mq.matches &&
        e.relatedTarget &&
        !header.contains(e.relatedTarget)
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

  if (form) try {
    /* Validation is authored below, so the browser's bubbles are switched
       off here and not in the markup: without this script the native
       required/type=email checks still run. */
    form.noValidate = true;

    var statusEl = form.querySelector('.form__status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var copy = JSON.parse(form.dataset.copy || '{}');

    /* The reply prints in dots each time it changes, so the end of the
       only thing a visitor DOES on this site is answered in the site's own
       ink and not only in 15px of text. Once the message has gone the form
       keeps .is-sent, a hook for styling the sent state. */
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
          // The address printed in the form's own no-script line.
          var shown = form.querySelector('a[href^="mailto:"]');
          setStatus('error', String(copy.unconfigured).replace('{email}', shown ? shown.textContent.trim() : ''));
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
  } catch (err) {
    /* The form keeps the browser's own validation and the Send button
       keeps working as a plain submit; nothing else on the page depends
       on this block. */
    form.noValidate = false;
  }

  /* ---------- Section entrances ----------------------------------------- */

  /* Armed by the .reveal class Base.astro sets before first paint (motion
     allowed, IntersectionObserver present). Each section's parts enter in
     order as they scroll in, 70ms apart within their section, once. The
     selector list matches global.css exactly. */
  var REVEAL = "h2, .lead, .plan, .svc, .faq-item, .how__item, .closing__link, .prose > *, .contact__inner > *, .notice, .updated, :is(.cell__h, .cell__b, .head__lead):not(:is(.svc, .plan, .how__item, .contact__inner) *)";
  if (document.documentElement.classList.contains('reveal')) try {
    var pending = [];
    Array.prototype.forEach.call(document.querySelectorAll('main > :not(.hero)'), function (section) {
      Array.prototype.forEach.call(section.querySelectorAll(REVEAL), function (el, i) {
        el.style.setProperty('--reveal-delay', Math.min(i, 6) * 70 + 'ms');
        pending.push(el);
      });
    });

    var enter = function (el) {
      el.classList.add('is-in');
      var at = pending.indexOf(el);
      if (at > -1) pending.splice(at, 1);
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
  } catch (err) {
    /* Anything wrong here would leave parts at opacity 0 until the 2.5s
       fail-safe: withdraw the class now instead, and the finished page is
       simply there. */
    document.documentElement.classList.remove('reveal');
    window.__revealReady = true;
  }

  /* ---------- Footer year ------------------------------------------------ */

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Button sheen: dots ------------------------------------------ */

  /* The sheen that follows the pointer across a button, drawn as ordered
     dither instead of a soft gradient (David, 2026-10-19: "buttons can use
     the dot sheen").

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

  /* '#rrggbb' -> little-endian RGBA word, or the fallback. */
  var wordOf = function (css, fallback) {
    var m = /^#?([0-9a-f]{6})$/i.exec((css || '').trim());
    if (!m) return fallback;
    var n = parseInt(m[1], 16);
    return (0xff000000 | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | (n >> 16)) >>> 0;
  };
  var SPREAD_SOLID = 3600, SPREAD_QUIET = 2600;           // px²: the glow's reach

  /* 8x8 Bayer: 64 steps, so the glow fades smoothly even at the quiet
     button's low density. */
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
    /* A surface can set its own dot colour and cap (--btn-dots and
       --btn-dots-cap, e.g. the white buttons on the blue panels
       (themes.css .on-blue), where blue dots would sit under a blue
       label). */
    var bcs = getComputedStyle(btn);
    var ownCap = parseFloat(bcs.getPropertyValue('--btn-dots-cap'));
    var d = {
      c: c, x: c.getContext('2d'), on: 0, pt: null, raf: 0,
      cap: ownCap > 0 ? ownCap : quiet ? CAP_QUIET : CAP_SOLID,
      spread: quiet ? SPREAD_QUIET : SPREAD_SOLID,
      // little-endian RGBA words: --blue, --ink, --on-ink-blue
      colour: wordOf(bcs.getPropertyValue('--btn-dots'), !quiet ? 0xffff6f0e : onInk ? 0xff171b1c : 0xffff9d5c),
    };
    var r = btn.getBoundingClientRect();
    c.width = Math.max(1, Math.round(r.width));
    c.height = Math.max(1, Math.round(r.height));
    d.img = d.x.createImageData(c.width, c.height);
    d.px = new Uint32Array(d.img.data.buffer);
    btn.__dots = d;
    return d;
  };

  /* A theme change can change every button's colours: drop the dots made so
     far, and the next hover draws them again from the new CSS. */
  window.addEventListener('themechange', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.btn.has-dots'), function (btn) {
      var d = btn.__dots;
      if (d) { cancelAnimationFrame(d.raf); if (d.c.parentNode) d.c.parentNode.removeChild(d.c); }
      btn.__dots = null;
      btn.classList.remove('has-dots');
    });
  });

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
    // No fade with reduced motion or the footer's Animation switch off.
    if (!pointerEffects || document.documentElement.classList.contains('motion-off')) { d.on = to; drawDots(d); return; }
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

  /* ---------- Price currency --------------------------------------------
     Pricing only (/pricing, /pt/precos). Every price is drawn in euros with its reais in data-brl;
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
