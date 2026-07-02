// ── NAV SCROLL STATE ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 40);
}, { passive: true });

// ── NAV ACTIVE LINK ──
const navLinks = document.querySelectorAll('.nav-links a');
const navSections = ['que-es', 'metodo', 'comunidad-section'];

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(
        `.nav-links a[href="#${entry.target.id}"], .nav-links a[href="/#${entry.target.id}"]`
      );
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.25 });

navSections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObs.observe(el);
});

// ── HERO HEADLINE STAGGER ──
const heroHeadline = document.querySelector('.hero-headline');
if (heroHeadline) {
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
}, { threshold: 0.08 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObs.observe(el);
});

// ── COUNT-UP ──
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function countUp(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
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
