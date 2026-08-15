/* =========================================================================
   Powerstar7 — site behaviour
   Vanilla, no dependencies, no external requests. Everything degrades
   gracefully: with JS off the nav stays reachable and content stays visible.
   ========================================================================= */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* ---------- Mobile navigation ----------------------------------------- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (toggle && nav) {
    var mq = window.matchMedia('(max-width: 60rem)');

    var setOpen = function (open) {
      nav.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      // Stop the page scrolling behind the open panel.
      document.body.style.overflow = open && mq.matches ? 'hidden' : '';
    };

    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(nav.dataset.open !== 'true');
    });

    // Close after tapping a link (same-page anchors would otherwise leave it open).
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
    var onChange = function () {
      if (!mq.matches) setOpen(false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Header elevation on scroll -------------------------------- */

  var header = document.querySelector('.site-header');

  if (header) {
    var ticking = false;
    var applyStuck = function () {
      // Solid white bar at the top; floating glass pill once scrolled.
      header.classList.toggle('is-stuck', window.scrollY > 80);
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(applyStuck);
        }
      },
      { passive: true }
    );
    applyStuck();
  }

  /* ---------- Scroll reveal --------------------------------------------- */

  var revealables = document.querySelectorAll('.reveal');

  if (revealables.length) {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      // Show everything immediately rather than animating.
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
      );

      revealables.forEach(function (el, i) {
        // Small stagger so grids cascade instead of popping in together.
        el.style.transitionDelay = (i % 6) * 60 + 'ms';
        io.observe(el);
      });
    }
  }

  /* ---------- Hero cursor glow ------------------------------------------- */

  // The hero backgrounds place a blue radial at --hx/--hy; track the pointer
  // so the glow follows the cursor. No-op on touch (no pointermove stream).
  Array.prototype.forEach.call(
    document.querySelectorAll('.hero, .page-hero'),
    function (sec) {
      sec.addEventListener(
        'pointermove',
        function (e) {
          var r = sec.getBoundingClientRect();
          sec.style.setProperty('--hx', ((e.clientX - r.left) / r.width) * 100 + '%');
          sec.style.setProperty('--hy', ((e.clientY - r.top) / r.height) * 100 + '%');
        },
        { passive: true }
      );
    }
  );

  /* ---------- Contact form ----------------------------------------------- */

  // Handler-agnostic: POSTs to data-endpoint when one is configured,
  // otherwise falls back to composing an email via data-mailto.
  var contactForm = document.querySelector('form[data-contact]');

  if (contactForm) {
    var statusEl = contactForm.querySelector('.form__status');
    var submitBtn = contactForm.querySelector('button[type="submit"]');

    var setStatus = function (kind, text) {
      if (!statusEl) return;
      statusEl.dataset.kind = kind;
      statusEl.textContent = text;
    };

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Native validation UI (novalidate only disables the automatic pass).
      if (!contactForm.reportValidity()) return;

      // Honeypot: silently drop bot submissions.
      var trap = contactForm.querySelector('input[name="website"]');
      if (trap && trap.value) {
        setStatus('ok', 'Thanks! Your message has been sent.');
        contactForm.reset();
        return;
      }

      var endpoint = contactForm.dataset.endpoint;
      var data = new FormData(contactForm);
      data.delete('website');

      if (endpoint) {
        if (submitBtn) submitBtn.disabled = true;
        setStatus('busy', 'Sending…');

        fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        })
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            setStatus('ok', "Thanks! Your message has been sent — we'll get back to you soon.");
            contactForm.reset();
          })
          .catch(function () {
            setStatus('error',
              'Sorry, sending failed. Please email us directly at ' +
              (contactForm.dataset.mailto || 'our address') + '.');
          })
          .then(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
      } else {
        // No endpoint configured: compose the message in the visitor's
        // email app instead.
        var to = contactForm.dataset.mailto;
        if (!to) {
          setStatus('error', 'This form is not configured yet. Please email us directly.');
          return;
        }
        var subject = 'Website enquiry — ' + (data.get('topic') || 'General');
        var body =
          'Name: ' + (data.get('name') || '') + '\n' +
          'Email: ' + (data.get('email') || '') + '\n' +
          'Company: ' + (data.get('company') || '-') + '\n\n' +
          (data.get('message') || '');
        window.location.href =
          'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        setStatus('ok', 'Opening your email app… If nothing happens, email us at ' + to + '.');
      }
    });
  }

  /* ---------- Cursor-tracking button sheen ------------------------------- */

  // Buttons show a light sheen that follows the pointer (CSS reads --mx/--my).
  document.addEventListener(
    'pointermove',
    function (e) {
      var btn = e.target.closest ? e.target.closest('.btn') : null;
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', e.clientX - r.left + 'px');
      btn.style.setProperty('--my', e.clientY - r.top + 'px');
    },
    { passive: true }
  );

  /* ---------- Footer year ------------------------------------------------ */

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
