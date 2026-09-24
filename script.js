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
   Peatix URL injection
   ========================================================================== */
(function () {
  var PEATIX_URL_1015 = 'https://peatix.com/event/5136210';
  var PEATIX_URL_1025 = 'https://peatix.com/event/5196593';
  var PEATIX_URL_1104 = 'https://peatix.com/event/5197362';

  document.querySelectorAll('[data-peatix]').forEach(function (el) {
    var date = el.getAttribute('data-peatix');
    var url = date === '1015' ? PEATIX_URL_1015
            : date === '1025' ? PEATIX_URL_1025
            : PEATIX_URL_1104;
    el.href = url;
  });
}());

/* ==========================================================================
   Date selection modal
   ========================================================================== */
(function () {
  var modal    = document.getElementById('date-modal');
  var closeBtn = document.getElementById('date-modal-close');
  var backdrop = document.getElementById('date-modal-backdrop');
  var triggers = document.querySelectorAll('.js-open-date-modal');

  if (!modal) return;

  var previouslyFocused = null;

  function openModal() {
    previouslyFocused = document.activeElement;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previouslyFocused) previouslyFocused.focus();
  }

  triggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (!modal.hasAttribute('hidden') && (e.key === 'Escape' || e.key === 'Esc')) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = modal.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}());
