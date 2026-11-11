/* ========================================
   Wynklo - Header, menu overlay, copy-to-clipboard
   ======================================== */

import { gsap, reducedMotion, stopScroll, startScroll, lenis } from './motion.js';

let toastTimer = null;

export function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const value = el.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        showToast(`Copied ${value}`);
      } catch {
        window.location.href = value.includes('@') ? `mailto:${value}` : `tel:${value}`;
      }
    });
  });
}

function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let last = window.scrollY;

  const onScroll = () => {
    const y = Math.max(0, window.scrollY);
    const delta = y - last;
    last = y;
    header.classList.toggle('is-scrolled', y > 20);
    if (document.body.classList.contains('menu-open')) return;
    if (y < 120 || delta < 0) header.classList.remove('is-hidden');
    else if (delta > 0) header.classList.add('is-hidden');
  };

  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('site-menu');
  if (!btn || !menu) return;

  const links = menu.querySelectorAll('.menu-link-text');
  const side = menu.querySelectorAll('.site-menu-side > *');
  let open = false;
  let tl = null;

  if (!reducedMotion) {
    tl = gsap.timeline({ paused: true })
      .set(menu, { visibility: 'visible' })
      .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'wkInOut' })
      .fromTo(links, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 0.9, ease: 'wk', stagger: 0.06 }, '-=0.35')
      .fromTo(side, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'wk', stagger: 0.05 }, '-=0.7');
  }

  const setOpen = (value) => {
    open = value;
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.menu-btn-label').textContent = open ? 'Close' : 'Menu';
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);

    if (open) {
      stopScroll();
      if (tl) tl.timeScale(1).play();
      else menu.style.visibility = 'visible';
    } else {
      startScroll();
      if (tl) tl.timeScale(1.6).reverse();
      else menu.style.visibility = 'hidden';
    }
  };

  btn.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });
  menu.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', () => open && setOpen(false)));

  const path = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  menu.querySelectorAll('.menu-link').forEach((a) => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && path.startsWith(href.replace('.html', '')))) a.classList.add('is-current');
  });
}

function initFooterSign() {
  document.querySelectorAll('[data-to-top]').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    })
  );

  const fill = document.querySelector('.fw-fill');
  if (!fill || reducedMotion) return;
  gsap.fromTo(
    fill,
    { clipPath: 'inset(-10% 100% -30% 0)' },
    {
      clipPath: 'inset(-10% 0% -30% 0)',
      ease: 'none',
      scrollTrigger: { trigger: '.footer-sign', start: 'top 90%', end: 'bottom bottom', scrub: 0.6 },
    }
  );
}

export function initChrome() {
  initHeader();
  initMenu();
  initCopy();
  initFooterSign();
}
