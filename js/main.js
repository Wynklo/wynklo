/* ========================================
   Wynklo - Main Entry Point
   ======================================== */

import { initLenis, initMotion, ScrollTrigger } from './motion.js';
import { initChrome } from './menu.js';
import { initTransitions } from './transition.js';
import { initPopup } from './popup.js';
import { initCal } from './cal.js';
import { initLivePreviews } from './live.js';

const pages = {
  home: () => import('./pages/home.js'),
  process: () => import('./pages/process.js'),
  about: () => import('./pages/about.js'),
  work: () => import('./pages/work.js'),
  start: () => import('./pages/start.js'),
  contact: () => import('./contact.js').then((m) => ({ init: m.initContactForm })),
};

async function boot() {
  initTransitions();
  initLenis();
  initChrome();
  initCal();
  initPopup();
  initLivePreviews();

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* fonts are optional */
    }
  }

  const load = pages[document.body.dataset.page];
  if (load) {
    const mod = await load();
    await mod.init?.();
  }

  await initMotion();

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

boot();
