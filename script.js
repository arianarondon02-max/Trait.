gsap.registerPlugin(ScrollTrigger);

// ── NAV SCROLL ────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 50);
}, { passive: true });

// ── NAV ACTIVE LINK ───────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('active'));
    const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (link) link.classList.add('active');
  });
}, { threshold: 0.35 });
['metodo', 'comunidad'].forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObs.observe(el);
});

// ── NAV DROPDOWN ──────────────────────────────────────
const dropToggle = document.querySelector('.nav-dropdown-toggle');
const dropMenu   = document.querySelector('.nav-dropdown-menu');
if (dropToggle && dropMenu) {
  dropToggle.addEventListener('click', e => {
    e.stopPropagation();
    const open = dropToggle.getAttribute('aria-expanded') === 'true';
    dropToggle.setAttribute('aria-expanded', String(!open));
    dropMenu.classList.toggle('is-open', !open);
  });
  document.addEventListener('click', () => {
    dropToggle.setAttribute('aria-expanded', 'false');
    dropMenu.classList.remove('is-open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      dropToggle.setAttribute('aria-expanded', 'false');
      dropMenu.classList.remove('is-open');
      dropToggle.focus();
    }
  });
}

// ── SCROLL INDICATOR FADE ─────────────────────────────
const scrollInd = document.querySelector('.scroll-indicator');
if (scrollInd) {
  window.addEventListener('scroll', () => {
    scrollInd.style.opacity = window.scrollY > 80 ? '0' : '0.45';
  }, { passive: true });
}

// ── COUNT-UP (GSAP) ───────────────────────────────────
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate() { el.textContent = Math.round(obj.val) + suffix; },
    scrollTrigger: {
      trigger: el,
      start: 'top 78%',
      toggleActions: 'play none none none',
      once: true
    }
  });
});

// ── SMOOTH SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ══════════════════════════════════════════════════════
// MOTION — guarded by prefers-reduced-motion
// ══════════════════════════════════════════════════════
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  initMotion();
}

function initMotion() {

  // ── HERO ENTRANCE ────────────────────────────────────
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#hero .eyebrow',       { y: 14, opacity: 0, duration: 0.7  }, 0.1)
    .from('#hero h1',             { y: 40, opacity: 0, duration: 1.1  }, 0.28)
    .from('#hero .hero-sub',      { y: 24, opacity: 0, duration: 0.95 }, 0.52)
    .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, 1.1);

  // ── HELPERS ───────────────────────────────────────────

  function textIn(selector, opts = {}) {
    const { y = 28, duration = 0.9, delay = 0, start = 'top 88%' } = opts;
    gsap.utils.toArray(selector).forEach(el => {
      gsap.from(el, {
        y, opacity: 0, duration, delay, ease: 'power2.out',
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' }
      });
    });
  }

  function blockIn(selector, opts = {}) {
    const { y = 44, scale = 0.95, duration = 1.1, stagger = 0.14, start = 'top 84%', trigger = null } = opts;
    const targets = gsap.utils.toArray(selector);
    if (!targets.length) return;
    gsap.from(targets, {
      y, scale, opacity: 0, duration, stagger, ease: 'power3.out',
      scrollTrigger: { trigger: trigger || targets[0], start, toggleActions: 'play none none none' }
    });
  }

  // ── QUÉ ES TRAIT ──────────────────────────────────────
  textIn('#que-es h2',       { y: 40, duration: 1 });
  textIn('#que-es .body-lg', { y: 24, duration: 0.95, start: 'top 90%' });

  // ── ESTADÍSTICAS ──────────────────────────────────────
  textIn('#problema h2',       { y: 40, duration: 1 });
  textIn('#problema .body-md', { y: 20, duration: 0.85, start: 'top 90%' });

  // Stat cards: stagger reveal
  blockIn('.stat-card', {
    y: 48, scale: 0.94, stagger: 0.12, duration: 1.1,
    trigger: '.stats-row', start: 'top 82%'
  });

  // ── SOLUCIÓN ──────────────────────────────────────────
  textIn('#solucion h2',              { y: 40, duration: 1 });
  textIn('#solucion .body-lg',        { y: 24, duration: 0.95, start: 'top 90%' });
  textIn('#solucion .solucion-quote', { y: 32, duration: 1.05 });

  // ── MÉTODO TRAIT ──────────────────────────────────────
  textIn('#metodo .label-tag', { y: 14, duration: 0.7 });
  textIn('#metodo h2',         { y: 40, duration: 1 });
  textIn('#metodo .body-lg',   { y: 24, duration: 0.9, start: 'top 90%' });

  // Method cards: stagger reveal
  blockIn('.metodo-card', {
    y: 40, scale: 0.96, stagger: 0.10, duration: 1.0,
    trigger: '.metodo-steps', start: 'top 82%'
  });

  // Conclusion: leve scale
  gsap.from('.metodo-conclusion', {
    y: 36, opacity: 0, scale: 0.97, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.metodo-conclusion', start: 'top 86%', toggleActions: 'play none none none' }
  });

  // ── COMUNIDAD ─────────────────────────────────────────
  textIn('#comunidad .label-tag-light', { y: 14, duration: 0.7 });
  textIn('#comunidad h2',              { y: 40, duration: 1 });
  textIn('#comunidad .body-lg',        { y: 24, duration: 0.9, start: 'top 90%' });

  blockIn('.comunidad-card', {
    y: 48, scale: 0.95, stagger: 0.16, duration: 1.15,
    trigger: '.comunidad-cards', start: 'top 82%'
  });

  // ── CTA FINAL ─────────────────────────────────────────
  textIn('#cta-final h2', { y: 40, duration: 1 });
  gsap.from('#cta-final .btn-primary', {
    y: 20, opacity: 0, scale: 0.97, duration: 0.85, delay: 0.22, ease: 'power2.out',
    scrollTrigger: { trigger: '#cta-final', start: 'top 85%', toggleActions: 'play none none none' }
  });

  // ── FOOTER ────────────────────────────────────────────
  gsap.from('.footer-brand', {
    y: 28, opacity: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: 'footer', start: 'top 90%', toggleActions: 'play none none none' }
  });
  gsap.from('.footer-nav-col', {
    y: 20, opacity: 0, stagger: 0.09, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: 'footer', start: 'top 88%', toggleActions: 'play none none none' }
  });

} // end initMotion
