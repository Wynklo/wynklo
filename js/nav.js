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

  // ── Services mega menu toggle & Slider ──
  if (servicesToggle && megaMenu) {
    const pages = document.querySelectorAll('.mega-menu-page');
    const arrow = document.getElementById('mega-menu-arrow');
    const closeBtn = document.getElementById('mega-menu-close');
    let currentPage = 0;

    const updateSlider = () => {
      pages.forEach(page => {
        page.style.transform = `translateX(-${currentPage * 100}%)`;
      });
      if (arrow) {
        if (currentPage === pages.length - 1) {
           arrow.style.transform = 'translateY(-50%) rotate(180deg)';
        } else {
           arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
      }
    };

    const closeMegaMenu = () => {
      megaMenu.classList.remove('active');
      servicesToggle.classList.remove('active');
      header.classList.remove('menu-open');
      document.body.style.overflow = '';
      // Reset to page 1 after transition ends
      setTimeout(() => {
        currentPage = 0;
        updateSlider();
      }, 500);
    };

    servicesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = megaMenu.classList.contains('active');
      if (isActive) {
        closeMegaMenu();
      } else {
        megaMenu.classList.add('active');
        servicesToggle.classList.add('active');
        header.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
      }
    });

    if (arrow) {
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        currentPage = (currentPage + 1) % pages.length;
        updateSlider();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMegaMenu();
      });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaMenu.classList.contains('active')) {
        closeMegaMenu();
      }
    });

    // Close when clicking outside menu content (backdrop)
    document.addEventListener('click', (e) => {
      if (megaMenu.classList.contains('active') && !megaMenu.contains(e.target) && !servicesToggle.contains(e.target)) {
        closeMegaMenu();
      }
    });
    
    // Also close if clicking exactly on the yellow background
    megaMenu.addEventListener('click', (e) => {
      if (e.target === megaMenu || e.target === document.getElementById('mega-menu-slider')) {
        closeMegaMenu();
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
