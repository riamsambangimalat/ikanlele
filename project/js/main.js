// ============================================
// SMP Muhammadiyah 1 Kudus — Interactions
// ============================================

// ===== MOBILE NAV TOGGLE =====
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('navbar__nav--open');
    toggle.setAttribute('aria-label', expanded ? 'Buka menu' : 'Tutup menu');
  });

  // Close on link click (mobile)
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('navbar__nav--open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('navbar__nav--open');
    }
  });
})();

// ===== NAVBAR SCROLL EFFECT =====
(function initScrollNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let ticking = false;
  function update() {
    if (window.scrollY > 20) navbar.classList.add('navbar--scrolled');
    else navbar.classList.remove('navbar--scrolled');
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// ===== ACTIVE NAV LINK =====
(function initActiveLink() {
  const links = document.querySelectorAll('.navbar__link');
  if (!links.length) return;
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === './index.html')) {
      link.classList.add('navbar__link--active');
    }
  });
})();

// ===== INTERSECTION OBSERVER (fade-up) =====
(function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => observer.observe(el));
})();

// ===== LIGHTBOX (dialog) =====
(function initLightbox() {
  const dialog = document.getElementById('lightbox');
  if (!dialog) return;
  const img = dialog.querySelector('.lightbox__img');
  const caption = dialog.querySelector('.lightbox__caption');
  const closeBtn = dialog.querySelector('.lightbox__close');

  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src') || trigger.querySelector('img')?.src;
      const alt = trigger.getAttribute('data-lightbox-alt') || trigger.querySelector('img')?.alt || '';
      if (src) {
        img.src = src;
        img.alt = alt;
        caption.textContent = alt;
        dialog.showModal();
      }
    });
  });

  function close() { dialog.close(); }
  closeBtn?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) close();
  });
})();

// ===== FORM VALIDATION + TOAST =====
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const toast = document.getElementById('toast');
  const toastMsg = toast?.querySelector('.toast__msg');
  let toastTimer;

  function showToast(message, isError) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.toggle('toast--error', !!isError);
    toast.classList.add('toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 4000);
  }

  function setFieldError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    const errorEl = group.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('form-error--visible');
    }
    field.classList.add('form-control--error');
  }

  function clearFieldError(field) {
    const group = field.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    if (errorEl) errorEl.classList.remove('form-error--visible');
    field.classList.remove('form-control--error');
  }

  form.querySelectorAll('.form-control').forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const fields = form.querySelectorAll('.form-control');

    fields.forEach((field) => {
      const value = field.value.trim();
      clearFieldError(field);

      if (field.required && !value) {
        setFieldError(field, 'Kolom ini wajib diisi.');
        valid = false;
        return;
      }

      if (field.type === 'email' && value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(value)) {
          setFieldError(field, 'Format email tidak valid.');
          valid = false;
          return;
        }
      }

      if (field.type === 'tel' && value) {
        const phoneRe = /^[0-9+\-\s()]{8,}$/;
        if (!phoneRe.test(value)) {
          setFieldError(field, 'Nomor telepon tidak valid.');
          valid = false;
          return;
        }
      }

      if (field.minLength > 0 && value.length < field.minLength) {
        setFieldError(field, `Minimal ${field.minLength} karakter.`);
        valid = false;
      }
    });

    if (!valid) {
      showToast('Mohon lengkapi semua kolom yang wajib diisi.', true);
      const firstError = form.querySelector('.form-control--error');
      firstError?.focus();
      return;
    }

    showToast('Pesan berhasil terkirim! Kami akan segera menghubungi Anda.');
    form.reset();
  });
})();
