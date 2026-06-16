// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── NAV ACTIVE LINK ──
const navLinks = document.querySelectorAll('.nav-links a');
const navSections = ['modelo','modos','propuestas','ground-map','por-que'];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.3 });

navSections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ── INTERSECTION OBSERVER — SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNT-UP ──
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCount(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = Math.round(easeOutCubic(t) * target);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ── RADAR SVG ──
const AXES = ['Mental', 'Change', 'People', 'Results', 'Self-Aware'];
const MODE_VALS = {
  espejo:     [0.35, 0.25, 0.55, 0.40, 0.60],
  sensor:     [0.72, 0.80, 0.48, 0.38, 0.50],
  filtro:     [0.88, 0.75, 0.65, 0.72, 0.90],
  arquitecto: [0.85, 0.68, 0.32, 0.88, 0.70],
  puente:     [0.68, 0.85, 0.95, 0.58, 0.78]
};

function getPoint(cx, cy, r, i, val) {
  const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
  return {
    x: cx + val * r * Math.cos(angle),
    y: cy + val * r * Math.sin(angle)
  };
}

function buildRadar(svgEl, mode, colorKey) {
  const cx = 100, cy = 100, r = 72;
  const vals = MODE_VALS[mode];
  const colorStroke = colorKey === 'teal' ? 'var(--teal)' : 'var(--violet)';
  const colorFill   = colorKey === 'teal' ? 'rgba(58,202,250,0.20)' : 'rgba(124,111,247,0.20)';
  const colorDot    = colorStroke;

  svgEl.innerHTML = '';

  // Grid rings
  for (let ring = 1; ring <= 4; ring++) {
    const ringPoints = AXES.map((_, i) => {
      const p = getPoint(cx, cy, r * ring / 4, i, 1);
      return `${p.x},${p.y}`;
    }).join(' ');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', ringPoints);
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'rgba(255,255,255,0.06)');
    poly.setAttribute('stroke-width', '0.5');
    svgEl.appendChild(poly);
  }

  // Axes
  AXES.forEach((_, i) => {
    const p = getPoint(cx, cy, r, i, 1);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.08)');
    line.setAttribute('stroke-width', '0.5');
    svgEl.appendChild(line);
  });

  // Labels
  AXES.forEach((label, i) => {
    const p = getPoint(cx, cy, r + 14, i, 1);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', p.x);
    text.setAttribute('y', p.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-size', '8');
    text.setAttribute('font-family', 'DM Sans, Inter, system-ui');
    text.setAttribute('fill', '#8A94B0');
    text.setAttribute('letter-spacing', '0.05em');
    text.textContent = label.toUpperCase();
    svgEl.appendChild(text);
  });

  // Data polygon (animated)
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('fill', colorFill);
  polygon.setAttribute('stroke', colorStroke);
  polygon.setAttribute('stroke-width', '1.5');
  svgEl.appendChild(polygon);

  // Dots
  const dots = AXES.map(() => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', colorDot);
    svgEl.appendChild(circle);
    return circle;
  });

  // Animate
  const duration = 600;
  const start = performance.now();
  function animate(now) {
    const rawT = Math.min((now - start) / duration, 1);
    const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
    const points = vals.map((val, i) => {
      const p = getPoint(cx, cy, r, i, val * t);
      return `${p.x},${p.y}`;
    }).join(' ');
    polygon.setAttribute('points', points);
    vals.forEach((val, i) => {
      const p = getPoint(cx, cy, r, i, val * t);
      dots[i].setAttribute('cx', p.x);
      dots[i].setAttribute('cy', p.y);
    });
    if (rawT < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// ── BARS ──
function animateBars(container, barColor) {
  const wrapper = document.createElement('div');
  wrapper.className = 'mode-bars';
  const vals   = container.dataset.vals.split(',').map(Number);
  const labels = container.dataset.labels.split(',');
  const isTeal = barColor === 'teal';

  vals.forEach((val, idx) => {
    const item = document.createElement('div');
    item.className = 'bar-item';
    const pct = val + '%';
    item.innerHTML = `
      <div class="bar-label">${labels[idx]}</div>
      <div class="bar-track"><div class="bar-fill${isTeal ? ' teal' : ''}" data-target="${val}"></div></div>
      <div class="bar-pct${isTeal ? ' teal' : ''}">${pct}</div>
    `;
    wrapper.appendChild(item);
  });

  container.replaceWith(wrapper);

  setTimeout(() => {
    wrapper.querySelectorAll('.bar-fill').forEach((fill, idx) => {
      setTimeout(() => {
        fill.style.width = fill.dataset.target + '%';
      }, idx * 80);
    });
  }, 150);
}

// ── MODES ACCORDION ──
const modeRows = document.querySelectorAll('.mode-row');

function openMode(row) {
  const svgEl    = row.querySelector('.radar-svg');
  const barsEl   = row.querySelector('.mode-bars[data-vals]');
  const modeKey  = row.dataset.mode;
  const colorKey = svgEl ? svgEl.dataset.color : 'violet';

  if (svgEl && svgEl.children.length === 0) {
    buildRadar(svgEl, modeKey, colorKey);
  }
  if (barsEl) {
    animateBars(barsEl, colorKey);
  }
}

// Initialize default open (filtro)
modeRows.forEach(row => {
  if (row.classList.contains('active')) {
    openMode(row);
  }
});

modeRows.forEach(row => {
  row.querySelector('.mode-header').addEventListener('click', () => {
    const isActive = row.classList.contains('active');
    modeRows.forEach(r => r.classList.remove('active'));
    if (!isActive) {
      row.classList.add('active');
      openMode(row);
    }
  });
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ── GROUND MAP TABS ──
document.querySelectorAll('.gm-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabKey = tab.dataset.tab;
    document.querySelectorAll('.gm-tab').forEach(t => t.classList.remove('active', 'violet', 'teal'));
    document.querySelectorAll('.gm-tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active', tabKey === 'ground' ? 'violet' : 'teal');
    document.getElementById('tab-' + tabKey).classList.add('active');
  });
});
