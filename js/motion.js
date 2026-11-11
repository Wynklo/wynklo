/* ========================================
   Wynklo - Motion core: Lenis + GSAP helpers
   ======================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

CustomEase.create('wk', '0.16, 1, 0.3, 1');
CustomEase.create('wkInOut', '0.76, 0, 0.24, 1');

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export let lenis = null;

export function initLenis() {
  if (reducedMotion) return null;

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1,
    anchors: { offset: -80 },
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function stopScroll() {
  if (lenis) lenis.stop();
  else document.documentElement.style.overflow = 'hidden';
}

export function startScroll() {
  if (lenis) lenis.start();
  else document.documentElement.style.overflow = '';
}

/** Split an element into masked lines and return the timeline that reveals them. */
export function splitReveal(el, { delay = 0, scroll = true } = {}) {
  if (reducedMotion) {
    el.style.visibility = 'visible';
    return null;
  }

  let tween = null;

  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line-inner',
    autoSplit: true,
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      tween = gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.15,
        ease: 'wk',
        stagger: 0.09,
        delay,
        scrollTrigger: scroll
          ? { trigger: el, start: 'top 88%', once: true }
          : undefined,
      });
      return tween;
    },
  });

  return tween;
}

function initSplits() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    if (el.dataset.split === 'manual') return;
    splitReveal(el, { delay: Number(el.dataset.splitDelay || 0) });
  });
}

function initReveals() {
  const items = gsap.utils.toArray('[data-reveal]');
  if (!items.length) return;

  if (reducedMotion) return;

  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'wk',
        stagger: 0.08,
        overwrite: true,
      }),
  });
}

function initScrubWords() {
  document.querySelectorAll('[data-scrub-words]').forEach((el) => {
    if (reducedMotion) return;

    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'bottom 55%',
              scrub: true,
            },
          }
        );
      },
    });
  });
}

function initParallax() {
  if (reducedMotion) return;
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 12);
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

export async function initMotion() {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* fonts are optional */
    }
  }

  initSplits();
  initReveals();
  initScrubWords();
  initParallax();
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger, SplitText };
