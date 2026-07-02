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

// ── COUNT-UP ──────────────────────────────────────────
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function countUp(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(t) * target) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    countObs.unobserve(entry.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

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
    .from('#hero .eyebrow',      { y: 14, opacity: 0, duration: 0.7  }, 0.1)
    .from('#hero h1',            { y: 40, opacity: 0, duration: 1.1  }, 0.25)
    .from('#hero .hero-sub',     { y: 24, opacity: 0, duration: 0.95 }, 0.5)
    .from('#hero .hero-cta-link',{ y: 16, opacity: 0, duration: 0.8  }, 0.68);

  // ── HELPERS ───────────────────────────────────────────

  // Reveal de texto: y + opacity, sin scrub (el texto no espera al scroll para terminar)
  function textIn(selector, opts = {}) {
    const { y = 28, duration = 0.9, delay = 0, start = 'top 88%' } = opts;
    gsap.utils.toArray(selector).forEach(el => {
      gsap.from(el, {
        y, opacity: 0, duration, delay, ease: 'power2.out',
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' }
      });
    });
  }

  // Reveal con scale: para contenedores visuales (cards, bloques)
  function blockIn(selector, opts = {}) {
    const { y = 44, scale = 0.94, duration = 1.1, stagger = 0, start = 'top 84%', trigger = null } = opts;
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

  // Stat blocks: escala + y escalonada — se sienten como "cartas que se posan"
  gsap.utils.toArray('.stat-block').forEach((el, i) => {
    gsap.from(el, {
      y: 56, opacity: 0, scale: 0.92, duration: 1.3,
      delay: i * 0.13, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats-row', start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  // ── SOLUCIÓN ──────────────────────────────────────────
  textIn('#solucion h2',               { y: 40, duration: 1 });
  textIn('#solucion .body-lg',         { y: 24, duration: 0.95, start: 'top 90%' });
  textIn('#solucion .solucion-quote',  { y: 32, duration: 1.05 });

  // ── MÉTODO TRAIT ──────────────────────────────────────
  textIn('#metodo .label-tag', { y: 14, duration: 0.7 });
  textIn('#metodo h2',         { y: 40, duration: 1 });
  textIn('#metodo .body-lg',   { y: 24, duration: 0.9, start: 'top 90%' });

  // Steps: cada uno se revela al entrar al viewport, de forma independiente
  gsap.utils.toArray('.metodo-step').forEach(el => {
    gsap.from(el, {
      y: 36, opacity: 0, duration: 0.95, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
    });
  });

  // Bloque conclusión: leve scale como si "aterrizara"
  gsap.from('.metodo-conclusion', {
    y: 40, opacity: 0, scale: 0.97, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.metodo-conclusion', start: 'top 85%', toggleActions: 'play none none none' }
  });

  // ── COMUNIDAD ─────────────────────────────────────────
  textIn('#comunidad .label-tag-light', { y: 14, duration: 0.7 });
  textIn('#comunidad h2',              { y: 40, duration: 1 });
  textIn('#comunidad .body-lg',        { y: 24, duration: 0.9, start: 'top 90%' });

  // Cards: escala + y escalonada — el más importante del diseño
  blockIn('.comunidad-card', {
    y: 48, scale: 0.95, stagger: 0.16, duration: 1.15,
    trigger: '.comunidad-cards', start: 'top 82%'
  });

  // ── CTA FINAL ─────────────────────────────────────────
  textIn('#cta-final h2', { y: 40, duration: 1 });
  gsap.from('#cta-final .btn-primary', {
    y: 20, opacity: 0, duration: 0.85, delay: 0.22, ease: 'power2.out',
    scrollTrigger: { trigger: '#cta-final', start: 'top 85%', toggleActions: 'play none none none' }
  });

  // ── FOOTER ────────────────────────────────────────────
  gsap.from('.footer-brand', {
    y: 28, opacity: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: 'footer', start: 'top 90%', toggleActions: 'play none none none' }
  });
  gsap.from('.footer-nav-col', {
    y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: 'footer', start: 'top 88%', toggleActions: 'play none none none' }
  });

} // end initMotion
