/* ========================================
   Wynklo - Work page: cursor-follow "View" label
   ======================================== */

import { gsap, reducedMotion } from '../motion.js';

export function init() {
  const cursor = document.querySelector('.work-cursor');
  if (!cursor || reducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  gsap.set(cursor, { scale: 0, visibility: 'visible' });
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3' });

  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  document.querySelectorAll('.work-media:not(.live-tile)').forEach((media) => {
    media.addEventListener('pointerenter', () => gsap.to(cursor, { scale: 1, duration: 0.5, ease: 'wk' }));
    media.addEventListener('pointerleave', () => gsap.to(cursor, { scale: 0, duration: 0.4, ease: 'power2.out' }));
  });
}
