/* ========================================
   Wynklo - Home page
   ======================================== */

import Swiper from 'swiper';
import { Navigation, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import { gsap, reducedMotion, splitReveal } from '../motion.js';
import { runPreloader } from '../preloader.js';

function heroIntro() {
  const title = document.querySelector('.hero-title');
  if (title) splitReveal(title, { scroll: false, delay: 0.05 });
  if (reducedMotion) return;

  gsap.to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1.1, ease: 'wk', stagger: 0.08, delay: 0.4 });
  gsap.from('.hero-reel-frame', { y: 90, opacity: 0, duration: 1.5, ease: 'wk', delay: 0.55 });
}

function heroReel() {
  if (reducedMotion) return;
  const frame = document.querySelector('.hero-reel-frame');
  if (!frame) return;

  const trigger = { trigger: '.hero-reel', start: 'top 90%', end: 'bottom 70%', scrub: true };
  gsap.fromTo(
    frame,
    { clipPath: 'inset(0% 7% 0% 7% round 32px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 32px)', ease: 'none', scrollTrigger: trigger }
  );
  gsap.fromTo(
    frame.querySelectorAll('.mk-wrap'),
    { yPercent: 8 },
    { yPercent: -4, ease: 'none', scrollTrigger: { ...trigger } }
  );
}

function problemPin() {
  if (reducedMotion) return;
  const pin = document.querySelector('.problem-pin');
  if (!pin) return;

  const cards = gsap.utils.toArray('.pcard');
  const startRot = [-18, 16, -12, 20];
  const driftY = [-70, -110, -40, -130];

  gsap
    .timeline({
      scrollTrigger: { trigger: pin, start: 'top top', end: '+=260%', pin: true, scrub: 0.8, anticipatePin: 1 },
    })
    .from(cards, {
      y: () => window.innerHeight * 0.75,
      rotation: (i) => startRot[i],
      opacity: 0,
      stagger: 0.14,
      duration: 1,
      ease: 'power2.out',
    })
    .to(cards, { y: (i) => driftY[i], duration: 0.8, ease: 'none' })
    .fromTo(
      '.problem-panel',
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power2.inOut' },
      '-=0.2'
    )
    .from('.problem-panel-inner > *', { y: 70, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' }, '-=0.35')
    .to({}, { duration: 0.5 });
}

function slider() {
  const el = document.querySelector('.projects-swiper');
  if (!el) return;

  new Swiper(el, {
    modules: [Navigation, Keyboard, A11y],
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: reducedMotion ? 0 : 900,
    grabCursor: true,
    keyboard: { enabled: true },
    navigation: { prevEl: '.slider-prev', nextEl: '.slider-next' },
    breakpoints: { 768: { spaceBetween: 32 } },
  });
}

export function init() {
  slider();
  heroReel();
  problemPin();
  runPreloader().then(heroIntro);
}
