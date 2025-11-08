/* main.js — mejoras de UX para mi blog */

// ---------- 1) Modo oscuro con persistencia ----------
(function themeSetup() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  setTheme(initial);

  btn.addEventListener('click', () => {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(next);
  });

  function setTheme(mode) {
    if (mode === 'dark') {
      document.body.classList.add('dark');
      btn.textContent = '☀️';
      btn.setAttribute('aria-label', 'Cambiar a tema claro');
    } else {
      document.body.classList.remove('dark');
      btn.textContent = '🌙';
      btn.setAttribute('aria-label', 'Cambiar a tema oscuro');
    }
    localStorage.setItem('theme', mode);
  }
})();

// ---------- 2) Buscador instantáneo en index ----------
(function searchSetup() {
  const input = document.getElementById('search');
  if (!input) return; // solo existe en index

  const cards = Array.from(document.querySelectorAll('.post'));
  const haystack = cards.map(card => ({
    el: card,
    text: (card.textContent || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
  }));

  input.addEventListener('input', () => {
    const q = (input.value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    haystack.forEach(({ el, text }) => {
      el.style.display = text.includes(q) ? '' : 'none';
    });
  });
})();

// ---------- 3) Progreso + Volver arriba (posts) ----------
(function readingUX() {
  const progress = document.getElementById('progress');
  const back = document.getElementById('backToTop');
  if (!progress && !back) return; // no estamos en un post

  const onScroll = () => {
    // progreso
    if (progress) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = Math.max(0, Math.min(100, (scrollTop / (height || 1)) * 100));
      progress.style.width = pct + '%';
    }
    // volver arriba
    if (back) {
      if (window.scrollY > 400) back.classList.add('show');
      else back.classList.remove('show');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (back) {
    back.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();



