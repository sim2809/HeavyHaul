/**
 * Vanilla-JS replacements for the React state used in Layout.tsx: desktop dropdown
 * hover-open/close (servicesOpen/aboutOpen) and the mobile menu toggle (open state).
 * No build step — plain DOM APIs only, enqueued as a single theme-wide script.
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    // Desktop hover dropdowns (Services / About).
    document.querySelectorAll('[data-hh-dropdown]').forEach(function (wrapper) {
      var panel = wrapper.querySelector('[data-hh-dropdown-panel]');
      if (!panel) return;
      wrapper.addEventListener('mouseenter', function () {
        panel.classList.remove('hidden');
      });
      wrapper.addEventListener('mouseleave', function () {
        panel.classList.add('hidden');
      });
    });

    // Mobile menu toggle.
    var toggle = document.querySelector('[data-hh-mobile-toggle]');
    var mobilePanel = document.querySelector('[data-hh-mobile-panel]');
    var iconOpen = document.querySelector('[data-hh-mobile-icon-open]');
    var iconClose = document.querySelector('[data-hh-mobile-icon-close]');
    if (toggle && mobilePanel) {
      toggle.addEventListener('click', function () {
        mobilePanel.classList.toggle('hidden');
        if (iconOpen && iconClose) {
          iconOpen.classList.toggle('hidden');
          iconClose.classList.toggle('hidden');
        }
      });
    }

    // CountUp — ports src/components/CountUp.tsx: animates a number from 0 to its
    // target once the element scrolls into view. Markup: <span data-hh-countup="15"
    // data-hh-decimals="0" data-hh-suffix="+" data-hh-duration="1600">0</span>.
    var countUpEls = document.querySelectorAll('[data-hh-countup]');
    if (countUpEls.length) {
      if ('IntersectionObserver' in window) {
        var countUpIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            startCountUp(entry.target);
            countUpIO.unobserve(entry.target);
          });
        }, { threshold: 0.3 });
        countUpEls.forEach(function (el) { countUpIO.observe(el); });
      } else {
        countUpEls.forEach(startCountUp);
      }
    }
    function startCountUp(el) {
      if (el.dataset.hhStarted) return;
      el.dataset.hhStarted = '1';
      var end = parseFloat(el.getAttribute('data-hh-countup')) || 0;
      var decimals = parseInt(el.getAttribute('data-hh-decimals') || '0', 10);
      var suffix = el.getAttribute('data-hh-suffix') || '';
      var duration = parseInt(el.getAttribute('data-hh-duration') || '1600', 10);
      var start = null;
      function tick(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (end * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // Simple scroll-snap "carousel" prev/next buttons — replaces the embla-carousel
    // (shadcn Carousel) used by the "Why Us" section in Index.tsx. No loop/infinite
    // scroll, just scrolls the track by roughly one card width per click.
    document.querySelectorAll('[data-hh-carousel]').forEach(function (carousel) {
      var track = carousel.querySelector('[data-hh-carousel-track]');
      var prev = carousel.querySelector('[data-hh-carousel-prev]');
      var next = carousel.querySelector('[data-hh-carousel-next]');
      if (!track) return;
      function scrollByCard(dir) {
        var card = track.querySelector('[data-hh-carousel-item]');
        var amount = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
        track.scrollBy({ left: dir * amount, behavior: 'smooth' });
      }
      if (prev) prev.addEventListener('click', function () { scrollByCard(-1); });
      if (next) next.addEventListener('click', function () { scrollByCard(1); });
    });

    // Gallery lightbox — ports Gallery.tsx's photo-grid lightbox (the video player
    // portion of Gallery.tsx isn't ported; the source .mp4 assets aren't in this repo).
    var lightbox = document.querySelector('[data-hh-lightbox]');
    if (lightbox) {
      var lightboxImg = lightbox.querySelector('[data-hh-lightbox-img]');
      var lightboxLane = lightbox.querySelector('[data-hh-lightbox-lane]');
      var lightboxLabel = lightbox.querySelector('[data-hh-lightbox-label]');
      var closeBtn = lightbox.querySelector('[data-hh-lightbox-close]');

      function openLightbox(trigger) {
        var src = trigger.getAttribute('data-hh-lightbox-src');
        var lane = trigger.getAttribute('data-hh-lightbox-lane') || '';
        var label = trigger.getAttribute('data-hh-lightbox-label') || '';
        if (lightboxImg) {
          lightboxImg.src = src || '';
          lightboxImg.alt = label;
        }
        if (lightboxLane) lightboxLane.textContent = lane;
        if (lightboxLabel) lightboxLabel.textContent = label;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
      }
      function closeLightbox() {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
      }

      document.querySelectorAll('[data-hh-lightbox-trigger]').forEach(function (trigger) {
        trigger.addEventListener('click', function () { openLightbox(trigger); });
      });
      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });
    }
  });
})();
