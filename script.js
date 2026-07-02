// ── NAV SCROLL STATE ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 50);
}, { passive: true });

// ── NAV ACTIVE LINK ──
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-link-community)');
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
}, { threshold: 0.3 });

navSections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObs.observe(el);
});

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── HERO REVEAL (triggered immediately, with css delay) ──
document.querySelectorAll('.reveal-hero').forEach(el => {
  requestAnimationFrame(() => el.classList.add('visible'));
});

// ── COUNT-UP ──
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function countUp(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
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

// ── MOBILE MENU ──
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const mobileOverlay= document.getElementById('mobileOverlay');
const mobileClose  = document.getElementById('mobileClose');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

// Close menu when a link inside it is clicked
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}
