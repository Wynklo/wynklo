/* ========================================
   Yellow Peach — Navigation Interactions
   ======================================== */

export function initNav() {
  const header = document.getElementById('site-header');
  const servicesToggle = document.getElementById('services-toggle');
  const megaMenu = document.getElementById('mega-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');

  // ── Header hide on scroll down / show on scroll up ──
  let lastScroll = 0;
  const scrollThreshold = 10; // minimum scroll delta to trigger hide/show

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScroll;

    // Add/remove scrolled background
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('header-hidden');
    }

    // Hide on scroll down, show on scroll up (only after passing header height)
    if (currentScroll > 100) {
      if (delta > scrollThreshold) {
        // Scrolling DOWN → hide header
        header.classList.add('header-hidden');
      } else if (delta < -scrollThreshold) {
        // Scrolling UP → show header
        header.classList.remove('header-hidden');
      }
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ── Character-shift hover effect ──
  document.querySelectorAll('[data-chars]').forEach(el => {
    const text = el.childNodes[0]?.textContent?.trim();
    if (!text) return;
    
    // Preserve any child elements (like chevron spans)
    const children = Array.from(el.children);
    el.textContent = '';
    
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${i * 0.02}s`;
      el.appendChild(span);
    });
    
    // Re-append child elements
    children.forEach(child => {
      el.appendChild(document.createTextNode(' '));
      el.appendChild(child);
    });
  });

  // ── Services mega menu toggle ──
  // When Services is clicked, mega menu opens from the top 50% of the viewport
  // pushing page content down, showing the yellow overlay with services info
  if (servicesToggle && megaMenu) {
    servicesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = megaMenu.classList.contains('active');
      megaMenu.classList.toggle('active');
      servicesToggle.classList.toggle('active');
      header.classList.toggle('menu-open');
      document.body.style.overflow = isActive ? '' : 'hidden';
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaMenu.classList.contains('active')) {
        megaMenu.classList.remove('active');
        servicesToggle.classList.remove('active');
        header.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });

    // Close when clicking outside menu content
    megaMenu.addEventListener('click', (e) => {
      if (e.target === megaMenu) {
        megaMenu.classList.remove('active');
        servicesToggle.classList.remove('active');
        header.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Mobile menu toggle ──
  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.contains('active');
      menuToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = isActive ? '' : 'hidden';
    });
  }
}
