/* ========================================
   Wynklo - Brand video preloader (home, once per session)
   ======================================== */

import { gsap, reducedMotion, stopScroll, startScroll } from './motion.js';
import { arrivedViaCurtain } from './transition.js';

const FLAG = 'wk-loaded';

/** Resolves when the preloader has finished (or immediately if skipped). */
export function runPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return Promise.resolve();

  const skip = reducedMotion || sessionStorage.getItem(FLAG) === '1' || arrivedViaCurtain;
  if (skip) {
    el.remove();
    return Promise.resolve();
  }

  sessionStorage.setItem(FLAG, '1');
  stopScroll();

  const video = el.querySelector('.preloader-video');
  const hold = el.querySelector('.preloader-hold');

  return new Promise((resolve) => {
    gsap.from(hold, { yPercent: 100, opacity: 0, duration: 0.6, ease: 'wk' });

    let done = false;
    const exit = () => {
      if (done) return;
      done = true;
      gsap
        .timeline({
          onComplete: () => {
            el.remove();
            startScroll();
          },
        })
        .to(hold, { yPercent: -100, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.15)
        .to(el, { yPercent: -100, duration: 0.95, ease: 'wkInOut' }, '-=0.1')
        .add(resolve, '-=0.55');
    };

    // Never keep visitors waiting on a slow or blocked video.
    const fallback = setTimeout(exit, 4500);
    video.addEventListener('ended', () => {
      clearTimeout(fallback);
      exit();
    });
    video.play().catch(() => {
      clearTimeout(fallback);
      setTimeout(exit, 900);
    });
  });
}
