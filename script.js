/* ============================================================
   Corner Table — script.js
   - Sticky header state on scroll
   - Mobile nav (open / close / Esc / link-click)
   - Reveal-on-scroll via IntersectionObserver
   - Front-end-only contact form (validate + fake success)
   - Footer year
   - Service worker registration (offline support)
   ============================================================ */

(function () {
  'use strict';

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header + back-to-top button ----
     Both react to scroll, so they share one handler. */
  const header  = document.querySelector('.site-header');
  const toTop   = document.querySelector('.to-top');
  const viewportH = () => window.innerHeight || document.documentElement.clientHeight;

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) {
      const show = y > viewportH() * 0.6;
      toTop.classList.toggle('is-visible', show);
      if (show && toTop.hasAttribute('hidden')) toTop.removeAttribute('hidden');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Mobile navigation ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navClose  = document.querySelector('.nav-close');
  const nav       = document.getElementById('site-nav');

  const openNav = () => {
    document.body.classList.add('nav-open');
    navToggle && navToggle.setAttribute('aria-expanded', 'true');
  };
  const closeNav = () => {
    document.body.classList.remove('nav-open');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.contains('nav-open') ? closeNav() : openNav();
    });
  }
  if (navClose) navClose.addEventListener('click', closeNav);

  if (nav) {
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (document.body.classList.contains('nav-open')) closeNav();
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
    }
  });

  /* ---- Reveal animations on scroll ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    // Older browsers — just show everything
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- Contact form: validate + fake success (no backend) ----
     To wire to a real backend later: set `action`/`method` on the
     <form>, or replace this handler with a fetch() call. ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.querySelector('#name');
      const email   = form.querySelector('#email');
      const message = form.querySelector('#message');

      const missing = [];
      if (!name.value.trim())    missing.push('name');
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) missing.push('a valid email');
      if (!message.value.trim()) missing.push('a message');

      if (missing.length) {
        status.textContent = 'Please add ' + missing.join(', ') + '.';
        status.className = 'form-status error';
        return;
      }

      // Pretend to submit.
      status.textContent = 'Thanks — we’ll be in touch within a day.';
      status.className = 'form-status success';
      form.reset();
    });
  }

  /* ---- Image fade-in: mark images as loaded so CSS can fade them in ---- */
  const fadeImgs = document.querySelectorAll('.gallery-item img, .about-figure img');
  fadeImgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load',  () => img.classList.add('is-loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
    }
  });

  /* ---- Service worker — caches the shell for offline use ---- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        /* Silently ignore — site still works without offline cache. */
      });
    });
  }
})();
