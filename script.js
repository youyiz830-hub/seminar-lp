'use strict';

/* ==========================================================================
   Lightbox
   ========================================================================== */
(function () {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.getElementById('lightbox-close');
  const backdrop    = document.getElementById('lightbox-backdrop');
  const thumbs      = document.querySelectorAll('.survey-thumb');

  if (!lightbox || !thumbs.length) return;

  let previouslyFocused = null;

  function openLightbox(src, alt) {
    previouslyFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.removeAttribute('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    document.body.style.overflow = '';
    if (previouslyFocused) previouslyFocused.focus();
  }

  thumbs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(btn.dataset.src, btn.dataset.alt);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (!lightbox.hasAttribute('hidden') && (e.key === 'Escape' || e.key === 'Esc')) {
      closeLightbox();
    }
  });

  /* Trap focus inside lightbox */
  lightbox.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = lightbox.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}());

/* ==========================================================================
   Mobile CTA visibility
   — Hide fixed CTA when the final CTA button is visible on screen
   ========================================================================== */
(function () {
  const mobileCta = document.querySelector('.mobile-cta');
  if (!mobileCta) return;

  const ctaButtons = document.querySelectorAll('[data-cta-location="final-cta"], [data-cta-location="hero"]');
  if (!ctaButtons.length) return;

  const observer = new IntersectionObserver(function (entries) {
    const anyVisible = Array.from(entries).some(function (e) { return e.isIntersecting; });
    mobileCta.style.transform = anyVisible ? 'translateY(100%)' : '';
    mobileCta.style.transition = 'transform 0.25s ease';
  }, { threshold: 0.5 });

  ctaButtons.forEach(function (btn) { observer.observe(btn); });
}());

/* ==========================================================================
   Lazy image fallback (hide broken images gracefully)
   ========================================================================== */
(function () {
  var imgs = document.querySelectorAll('img');
  imgs.forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.opacity = '0.15';
      img.style.background = '#f0ede8';
    });
  });
}());

/* ==========================================================================
   Slide-in animation observer
   ========================================================================== */
(function () {
  var els = document.querySelectorAll('.slide-in');
  if (!els.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(function (el) { obs.observe(el); });
}());

/* ==========================================================================
   Count-up animation
   ========================================================================== */
(function () {
  function initCountup() {
    var els = document.querySelectorAll('[data-countup]');
    if (!els.length) return;

    var done = [];

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-countup'), 10);
      var countEl = el.querySelector('.trust-stat__count');
      if (!countEl) return;
      countEl.textContent = '0';
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        countEl.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else countEl.textContent = target;
      }
      requestAnimationFrame(step);
    }

    function isInView(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function check() {
      els.forEach(function (el) {
        if (done.indexOf(el) === -1 && isInView(el)) {
          done.push(el);
          animateCount(el);
        }
      });
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountup);
  } else {
    initCountup();
  }
}());

/* ==========================================================================
   Peatix URL 管理
   12/5セミナーのURLが確定したら PEATIX_URL を更新してください
   未設定の場合はページ内の開催概要セクションへ遷移します
   ========================================================================== */
(function () {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }
}());

(function () {
  var PEATIX_URL   = 'https://peatix.com/event/5210817';
  var FALLBACK_HREF = '#';

  document.querySelectorAll('[data-cta-location]').forEach(function (el) {
    if (el.tagName !== 'A') return;
    if (PEATIX_URL) {
      el.href = PEATIX_URL;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else {
      el.href = FALLBACK_HREF;
      el.removeAttribute('target');
      el.removeAttribute('rel');
    }
  });
}());
