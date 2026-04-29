/* ========================================
   Yellow Peach — Main Entry Point
   ======================================== */

import { initNav } from './nav.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initCounter } from './counter.js';
import { initPopup } from './popup.js';
import { initFeaturedWork } from './featured-work.js';
import { initCareersToast } from './careers.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initCounter();
  initPopup();
  initFeaturedWork();
  initCareersToast();
});
