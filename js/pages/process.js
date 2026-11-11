/* ========================================
   Wynklo - Process page: stacking step cards
   ======================================== */

import { gsap, reducedMotion } from '../motion.js';

export function init() {
  if (reducedMotion) return;

  const cards = gsap.utils.toArray('.step-card');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
      scale: 0.9 + i * 0.02,
      filter: 'brightness(0.93)',
      ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true },
    });
  });

  cards.forEach((card) => {
    gsap.fromTo(card.querySelector('.step-media .mk-wrap'), { yPercent: 10 }, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 20%', scrub: true },
    });
  });
}
