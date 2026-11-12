/* ========================================
   Wynklo - "Book a Call": Cal.com booking in an on-site modal
   ======================================== */

import { stopScroll, startScroll } from './motion.js';

const CAL_LINK = 'contactus-wynklo-jcuito/30min';
const NS = 'wynklo';

let modal = null;
let lastFocus = null;
let calReady = false;

function loadCal() {
  if (calReady) return;
  calReady = true;

  /* Official Cal.com embed loader (queues calls until embed.js arrives) */
  (function (C, A, L) {
    const p = (a, ar) => a.q.push(ar);
    const d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  const Cal = window.Cal;
  Cal('init', NS, { origin: 'https://app.cal.com' });
  Cal.ns[NS]('inline', {
    elementOrSelector: '#cal-inline',
    calLink: CAL_LINK,
    config: { layout: 'month_view', theme: 'light', overlayCalendar: 'true' },
  });
  Cal.ns[NS]('ui', {
    theme: 'light',
    hideEventTypeDetails: false,
    layout: 'month_view',
    cssVarsPerTheme: {
      light: {
        'cal-brand': '#1a1a1a',
        'cal-brand-emphasis': '#000000',
        'cal-brand-text': '#fdd011',
      },
    },
  });
  Cal.ns[NS]('on', {
    action: 'linkReady',
    callback: () => modal?.classList.add('is-ready'),
  });
}

function buildModal() {
  modal = document.createElement('div');
  modal.className = 'cal-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'cal-modal-title');
  modal.innerHTML = `
    <div class="cal-backdrop" data-cal-close></div>
    <div class="cal-panel">
      <div class="cal-head">
        <div>
          <p class="label">Book a call</p>
          <h2 class="h3" id="cal-modal-title">30 minutes with <em class="accent">Wynklo</em></h2>
        </div>
        <div class="cal-head-actions">
          <a class="cal-external" href="https://cal.com/${CAL_LINK}?overlayCalendar=true" target="_blank" rel="noopener">Open in Cal.com ↗</a>
          <button type="button" class="cal-close" data-cal-close aria-label="Close booking">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
      <div class="cal-body" data-lenis-prevent>
        <div class="cal-loading" aria-hidden="true"><span></span>Loading available times…</div>
        <div id="cal-inline"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-cal-close]')) closeCal();
  });
}

export function openCal() {
  if (!modal) buildModal();
  loadCal();
  lastFocus = document.activeElement;
  stopScroll();
  document.documentElement.classList.add('cal-open');
  requestAnimationFrame(() => modal.classList.add('is-open'));
  modal.querySelector('.cal-close').focus({ preventScroll: true });
}

export function closeCal() {
  if (!modal?.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  document.documentElement.classList.remove('cal-open');
  if (!document.body.classList.contains('menu-open')) startScroll();
  lastFocus?.focus?.({ preventScroll: true });
}

export function initCal() {
  document.addEventListener(
    'click',
    (e) => {
      const trigger = e.target.closest('[data-cal]');
      if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      e.stopPropagation();
      if (document.body.classList.contains('menu-open')) document.getElementById('menu-btn')?.click();
      openCal();
    },
    true
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCal();
  });

  // Warm up the embed when someone is about to book.
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest?.('[data-cal]') && !document.querySelector('link[href="https://app.cal.com"]')) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://app.cal.com';
      document.head.appendChild(link);
    }
  });
}
