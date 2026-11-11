import { reducedMotion } from '../motion.js';

export function init() {
  const video = document.querySelector('.about-banner-video');
  if (!video || reducedMotion) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    },
    { threshold: 0.5 }
  );
  io.observe(video);
}
