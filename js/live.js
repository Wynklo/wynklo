/* ========================================
   Wynklo - Live website previews
   Renders a real site in an iframe at desktop size and scales it to fit.
   ======================================== */

function fit(view) {
  const frame = view.querySelector('iframe');
  const { width, height } = view.getBoundingClientRect();
  if (!frame || !width) return;
  const base = width < 520 ? 820 : 1440;
  const scale = width / base;
  frame.style.width = `${base}px`;
  frame.style.height = `${Math.ceil(height / scale)}px`;
  frame.style.transform = `scale(${scale})`;
}

export function initLivePreviews() {
  const views = document.querySelectorAll('[data-live-src]');
  if (!views.length) return;

  const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        io.unobserve(target);
        const frame = document.createElement('iframe');
        frame.src = target.dataset.liveSrc;
        frame.title = target.dataset.liveTitle || 'Live website preview';
        frame.loading = 'lazy';
        frame.referrerPolicy = 'no-referrer-when-downgrade';
        frame.addEventListener('load', () => target.classList.add('is-loaded'), { once: true });
        target.appendChild(frame);
        fit(target);
      });
    },
    { rootMargin: '400px 0px' }
  );

  views.forEach((view) => {
    ro.observe(view);
    io.observe(view);
  });
}
