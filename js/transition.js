/* ========================================
   Wynklo - Page curtain transition
   ======================================== */

import { gsap, reducedMotion } from './motion.js';

const FLAG = 'wk-curtain';

export const arrivedViaCurtain = sessionStorage.getItem(FLAG) === '1';

function isInternal(a, e) {
  if (!a || e.defaultPrevented || e.button !== 0) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download') || a.dataset.noTransition !== undefined) return false;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.hash) return false;
  return true;
}

export function initTransitions() {
  const curtain = document.querySelector('.curtain');
  if (!curtain || reducedMotion) {
    curtain?.remove();
    return;
  }

  // Drive the curtain purely through GSAP so it never parses the CSS fallback transform.
  curtain.style.transform = 'none';

  if (arrivedViaCurtain) {
    sessionStorage.removeItem(FLAG);
    gsap.set(curtain, { y: 0, yPercent: 0, visibility: 'visible' });
    gsap.to(curtain, {
      yPercent: -100,
      duration: 0.9,
      ease: 'wkInOut',
      delay: 0.05,
      onComplete: () => {
        gsap.set(curtain, { visibility: 'hidden' });
        document.documentElement.classList.remove('via-curtain');
      },
    });
  } else {
    gsap.set(curtain, { y: 0, yPercent: 100, visibility: 'hidden' });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!isInternal(a, e)) return;
    e.preventDefault();
    sessionStorage.setItem(FLAG, '1');
    gsap.fromTo(
      curtain,
      { y: 0, yPercent: 100, visibility: 'visible' },
      {
        yPercent: 0,
        duration: 0.7,
        ease: 'wkInOut',
        onComplete: () => {
          window.location.href = a.href;
        },
      }
    );
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      sessionStorage.removeItem(FLAG);
      gsap.set(curtain, { y: 0, yPercent: 100, visibility: 'hidden' });
    }
  });
}
