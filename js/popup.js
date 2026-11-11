/* ========================================
   Wynklo - Sticky CTA Popup
   ======================================== */

export function initPopup() {
  const popup = document.getElementById('cta-popup');
  const closeBtn = document.getElementById('cta-popup-close');

  if (!popup || !closeBtn) return;

  let hasShown = false;
  let isDismissed = sessionStorage.getItem('wk-popup-dismissed') === '1';

  function checkScroll() {
    if (isDismissed || hasShown) return;

    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const threshold = window.matchMedia('(max-width: 560px)').matches ? 0.6 : 0.35;
    if (scrollPercent > threshold) {
      popup.classList.add('visible');
      hasShown = true;
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });

  closeBtn.addEventListener('click', () => {
    popup.classList.remove('visible');
    isDismissed = true;
    sessionStorage.setItem('wk-popup-dismissed', '1');
  });
}
