// ── NAV SCROLL STATE ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 40);
}, { passive: true });

// ── NAV ACTIVE LINK ──
const navLinks = document.querySelectorAll('.nav-links a');
const navSections = ['como-funciona', 'modos', 'servicios', 'preguntas'];

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.3 });

navSections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObs.observe(el);
});

// ── HERO HEADLINE STAGGER ──
// Only splits if .hero-line spans are not already defined in HTML.
const heroHeadline = document.querySelector('.hero-headline');
if (heroHeadline && !heroHeadline.querySelector('.hero-line')) {
  const parts = heroHeadline.innerHTML.split('<br>').map(s => s.trim()).filter(Boolean);
  heroHeadline.innerHTML = parts
    .map((part, i) => `<span class="hero-line" style="--line-index:${i}">${part}</span>`)
    .join('');
}

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale, .fase-connector'
).forEach(el => revealObs.observe(el));

// ── COUNT-UP ──
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function countUp(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(t) * target) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      countObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
