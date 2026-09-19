/* =========================================================================
   DesignActiv — site behaviour
   =========================================================================

   Five things earn their place here: the mobile nav, the sticky header's
   scrolled hairline, the contact form, the footer year, and the hero wash.
   What stayed deleted from the previous site: scroll-reveal fades on every
   element and a cursor-tracking hero glow. Both were motion spent on nothing,
   on every page, forever.

   The cursor-revealed mark field left with the dark bands it lived on — dark
   is the footer's alone now, and the footer has no field.

   The header frost and the button sheen came back deliberately, each as one
   rAF-throttled listener rather than the unthrottled handlers they replaced.

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

  /* ---------- Contact form ----------------------------------------------- */

  var form = document.querySelector('form[data-contact]');

  if (form) {
    var statusEl = form.querySelector('.form__status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var copy = JSON.parse(form.dataset.copy || '{}');

    var setStatus = function (kind, text) {
      if (!statusEl) return;
      statusEl.dataset.kind = kind;
      statusEl.textContent = text;
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
        window.location.href =
          'mailto:' + email +
          '?subject=' + encodeURIComponent('Website enquiry — ' + (data.get('topic') || '')) +
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

  /* ---------- Button sheen ------------------------------------------------ */

  /* One delegated listener for every button on the page, rAF-throttled so the
     work happens once per frame instead of once per pointer event. The old
     site shipped two unthrottled handlers — one for this, one for a hero glow
     — in a file that correctly rAF-throttled its scroll handler.

     Skipped entirely on touch and when the visitor asks for reduced motion
     (see pointerEffects above), so nothing is registered that cannot be seen.

     `queued` lives OUTSIDE `pending` on purpose: `pending` is replaced with a
     fresh object on every move, so a flag stored on it would read undefined
     every time and schedule a frame per event — the exact cost this throttle
     exists to avoid. */
  if (pointerEffects) {
    var pending = null;
    var queued = false;

    document.addEventListener(
      'pointermove',
      function (e) {
        var btn = e.target.closest && e.target.closest('.btn');
        if (!btn) return;

        pending = { btn: btn, x: e.clientX, y: e.clientY };
        if (queued) return;
        queued = true;

        window.requestAnimationFrame(function () {
          queued = false;
          if (!pending) return;
          var r = pending.btn.getBoundingClientRect();
          pending.btn.style.setProperty('--mx', pending.x - r.left + 'px');
          pending.btn.style.setProperty('--my', pending.y - r.top + 'px');
          pending = null;
        });
      },
      { passive: true }
    );
  }
})();
