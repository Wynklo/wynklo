/* ========================================
   Wynklo - Home page
   ======================================== */

import Swiper from 'swiper';
import { Keyboard, A11y } from 'swiper/modules';
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

  const trigger = { trigger: '.hero-reel', start: 'top 95%', end: 'bottom 60%', scrub: 0.6 };
  gsap.fromTo(
    gsap.utils.toArray('.hero-reel-tile', frame),
    { y: (i) => (i === 1 ? 24 : 64) },
    { y: 0, ease: 'none', scrollTrigger: trigger }
  );
  gsap.fromTo(
    frame.querySelectorAll('.phone'),
    { yPercent: 14, rotation: (i) => [-6, 3, 6][i] ?? 0 },
    { yPercent: -3, rotation: 0, ease: 'none', scrollTrigger: trigger }
  );
}

function problemPin() {
  if (reducedMotion) return;
  const pin = document.querySelector('.problem-pin');
  if (!pin) return;

  const cards = gsap.utils.toArray('.pcard');
  const startRot = [-18, 14, -10, 20, -16, 12];
  const driftY = [-80, -60, -110, -50, -120, -90];

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
    .to(cards, { y: (i) => driftY[i] * (window.innerWidth < 560 ? 0.3 : 1), duration: 0.8, ease: 'none' })
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
  const browser = document.querySelector('.sc-browser');
  const el = browser?.querySelector('.projects-swiper');
  if (!el) return;

  const section = browser.closest('.work-slider');
  const slides = [...el.querySelectorAll('.sc-slide')];
  const tabs = browser.querySelector('.sc-tabs');
  const url = browser.querySelector('.sc-url-text');
  const open = browser.querySelector('.sc-open');
  const title = section.querySelector('.sc-title');
  const sub = section.querySelector('.sc-sub');
  const count = section.querySelector('.sc-count');
  const prev = section.querySelector('.slider-prev');
  const next = section.querySelector('.slider-next');
  const pad = (n) => String(n).padStart(2, '0');

  const tabEls = slides.map((slide, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'sc-tab';
    tab.setAttribute('role', 'tab');
    tab.style.setProperty('--c', slide.dataset.color);
    tab.innerHTML = `<i aria-hidden="true"></i><span></span>`;
    tab.querySelector('span').textContent = slide.dataset.title;
    tab.addEventListener('click', () => swiper.slideTo(i));
    tabs.appendChild(tab);
    return tab;
  });

  const swiper = new Swiper(el, {
    modules: [Keyboard, A11y],
    slidesPerView: 1,
    spaceBetween: 0,
    speed: reducedMotion ? 0 : 700,
    keyboard: { enabled: true, onlyInViewport: true },
    a11y: { enabled: true },
  });

  const sync = () => {
    const i = swiper.activeIndex;
    const { title: t, meta, url: u, href, live } = slides[i].dataset;
    url.textContent = u;
    title.textContent = t;
    sub.textContent = meta;
    count.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
    browser.classList.toggle('is-live', live !== undefined);
    browser.classList.remove('is-interactive');
    open.href = href || '/work.html';
    open.target = href ? '_blank' : '_self';
    prev.disabled = swiper.isBeginning;
    next.disabled = swiper.isEnd;
    tabEls.forEach((tab, j) => {
      tab.classList.toggle('is-active', j === i);
      tab.setAttribute('aria-selected', j === i);
    });
    const tab = tabEls[i];
    tabs.scrollTo({ left: tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => swiper.slidePrev());
  next.addEventListener('click', () => swiper.slideNext());
  swiper.on('slideChange', sync);
  sync();

  // Live sites only take scroll/clicks once the visitor opts in, so the page never gets stuck inside one.
  browser.querySelectorAll('.sc-explore').forEach((btn) =>
    btn.addEventListener('click', () => browser.classList.add('is-interactive'))
  );
  browser.addEventListener('mouseleave', () => browser.classList.remove('is-interactive'));

  // The floating chat dock sits over the slider controls, so step it aside while they're on screen.
  new IntersectionObserver(([entry]) =>
    document.documentElement.classList.toggle('dock-away', entry.isIntersecting)
  ).observe(section.querySelector('.sc-foot'));
}

export function init() {
  slider();
  heroReel();
  problemPin();
  runPreloader().then(heroIntro);
}
