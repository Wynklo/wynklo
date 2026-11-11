/* ========================================
   Wynklo - "See it before you build it" preview builder
   ======================================== */

import { stopScroll, startScroll } from '../motion.js';

const ico = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

const PLATFORMS = {
  app: { label: 'Mobile app', short: 'app', weeks: 4, screens: 6 },
  web: { label: 'Website', short: 'website', weeks: 3, screens: 5 },
  both: { label: 'App + website', short: 'app + website', weeks: 6, screens: 10 },
};

const BUSINESSES = {
  food: {
    name: 'Food & Restaurant',
    desc: 'Menus, orders, delivery',
    icon: ico('<path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2 0-3.5 2.5-3.5 6s1.5 4 3.5 4" />'),
    brand: 'Spice Route',
    kicker: 'Hungry? We deliver in 30 min',
    title: "Tonight's specials",
    nav: 'Menu',
    action: 'Order now',
    items: [['Paneer tikka', '₹280'], ['Margherita', '₹340'], ['Cold coffee', '₹160']],
    features: ['Online ordering', 'Live order tracking', 'UPI & card payments', 'Table booking', 'Loyalty points', 'Offers & coupons', 'Reviews', 'Admin dashboard'],
  },
  salon: {
    name: 'Salon & Beauty',
    desc: 'Bookings, services, staff',
    icon: ico('<circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.6 7.6 20 18M8.6 16.4 20 6" />'),
    brand: 'Glow Studio',
    kicker: 'Look good, feel better',
    title: 'Book your next visit',
    nav: 'Services',
    action: 'Book appointment',
    items: [['Haircut & style', '45 min'], ['Hair spa', '60 min'], ['Manicure', '30 min']],
    features: ['Online booking', 'Pick your stylist', 'Reminders', 'Memberships', 'Payments', 'Gift cards', 'Reviews', 'Admin dashboard'],
  },
  ecommerce: {
    name: 'E-commerce',
    desc: 'Catalogue, cart, checkout',
    icon: ico('<path d="M5 8h14l-1 13H6L5 8zM9 8a3 3 0 0 1 6 0" />'),
    brand: 'Thread & Co',
    kicker: 'Free shipping over ₹999',
    title: 'New arrivals',
    nav: 'Shop',
    action: 'Add to cart',
    items: [['Linen shirt', '₹1,499'], ['Canvas tote', '₹699'], ['Court sneakers', '₹2,999']],
    features: ['Product catalogue', 'Cart & checkout', 'Payments', 'Order tracking', 'Wishlist', 'Discount codes', 'Reviews', 'Admin dashboard'],
  },
  gym: {
    name: 'Gym & Fitness',
    desc: 'Memberships, classes, trainers',
    icon: ico('<path d="M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12" />'),
    brand: 'Iron House',
    kicker: 'Show up. Get stronger.',
    title: "Today's classes",
    nav: 'Classes',
    action: 'Join class',
    items: [['HIIT', '7:00 am'], ['Yoga flow', '8:30 am'], ['Strength', '6:00 pm']],
    features: ['Class booking', 'Memberships', 'Workout tracker', 'Trainer chat', 'Payments', 'Reminders', 'Progress charts', 'Admin dashboard'],
  },
  education: {
    name: 'Education',
    desc: 'Courses, lessons, results',
    icon: ico('<path d="m3 9 9-5 9 5-9 5-9-5zM7 11.2V16c3 2 7 2 10 0v-4.8" />'),
    brand: 'LearnLoop',
    kicker: 'Pick up where you left off',
    title: 'My courses',
    nav: 'Courses',
    action: 'Continue lesson',
    items: [['UI design basics', '68%'], ['Spoken English', '42%'], ['Python 101', '15%']],
    features: ['Courses & lessons', 'Video player', 'Quizzes', 'Certificates', 'Payments', 'Progress tracking', 'Live classes', 'Admin dashboard'],
  },
  realestate: {
    name: 'Real Estate',
    desc: 'Listings, enquiries, visits',
    icon: ico('<path d="M4 11 12 4l8 7v9H4zM10 20v-5h4v5" />'),
    brand: 'Keystone Homes',
    kicker: 'Homes across Pune',
    title: 'Featured homes',
    nav: 'Listings',
    action: 'Schedule a visit',
    items: [['2 BHK, Viman Nagar', '₹85 L'], ['3 BHK, Baner', '₹1.4 Cr'], ['Studio, Kharadi', '₹42 L']],
    features: ['Property listings', 'Search & filters', 'Map view', 'Visit booking', 'Enquiry forms', 'Saved homes', 'EMI calculator', 'Agent dashboard'],
  },
  portfolio: {
    name: 'Portfolio / Agency',
    desc: 'Work, case studies, leads',
    icon: ico('<path d="M4 8h16v11H4zM9 8V5h6v3M4 13h16" />'),
    brand: 'North Studio',
    kicker: 'Brand & digital studio',
    title: 'Selected work',
    nav: 'Work',
    action: 'Get a quote',
    items: [['Brand identity', '2026'], ['Website redesign', '2026'], ['App launch', '2025']],
    features: ['Case studies', 'Contact forms', 'Blog / CMS', 'Smooth animations', 'SEO setup', 'Testimonials', 'Analytics', 'Lead tracking'],
  },
  clinic: {
    name: 'Clinic',
    desc: 'Appointments, doctors, records',
    icon: ico('<path d="M4 4h16v16H4zM12 8v8M8 12h8" />'),
    brand: 'CarePoint',
    kicker: 'See a doctor today',
    title: 'Available doctors',
    nav: 'Doctors',
    action: 'Book consultation',
    items: [['Dr. Mehta · General', '10:30'], ['Dr. Rao · Dental', '12:00'], ['Dr. Shah · Skin', '4:15']],
    features: ['Appointment booking', 'Doctor profiles', 'Video consults', 'Reminders', 'Patient records', 'Payments', 'Prescriptions', 'Admin dashboard'],
  },
  events: {
    name: 'Events',
    desc: 'Tickets, RSVPs, schedules',
    icon: ico('<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14 7v10" />'),
    brand: 'Nightline',
    kicker: "What's on this month",
    title: 'Upcoming events',
    nav: 'Events',
    action: 'Get tickets',
    items: [['Sunset sessions', 'Sat 14'], ['Comedy night', 'Fri 20'], ['Food fest', 'Sun 22']],
    features: ['Ticketing', 'QR entry passes', 'Event schedule', 'Payments', 'Seat selection', 'Reminders', 'Sponsor pages', 'Admin dashboard'],
  },
};

const TINTS = ['#fdd011', '#f1b9a4', '#b9d7c4'];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const state = { platform: 'app', business: 'food', name: '', features: [] };

function brandName() {
  return state.name.trim() || BUSINESSES[state.business].brand;
}

function estimate() {
  const p = PLATFORMS[state.platform];
  const extra = Math.max(0, state.features.length - 3) * 0.5;
  const low = Math.round(p.weeks + extra);
  return { weeks: `${low}–${low + 2} weeks`, screens: `~${p.screens + state.features.length}` };
}

function chipsHTML(limit) {
  if (!state.features.length) return '';
  const shown = state.features.slice(0, limit).map((f) => `<span class="on">${esc(f)}</span>`).join('');
  const more = state.features.length > limit ? `<span>+${state.features.length - limit}</span>` : '';
  return `<div class="mk-chips">${shown}${more}</div>`;
}

function itemsHTML(b) {
  return b.items
    .map(
      ([a, v], i) =>
        `<div class="mk-card mk-between"><span class="mk-row"><i class="mk-thumb" style="--c:${TINTS[i]}"></i><b>${esc(a)}</b></span><span class="mk-small">${esc(v)}</span></div>`
    )
    .join('');
}

function phoneHTML(b) {
  const name = brandName();
  return `<div class="mk-wrap"><div class="mk phone"><div class="ph-screen">
    <div class="ph-top"><b data-bd-brand>${esc(name)}</b><span class="mk-avatar" data-bd-initial>${esc(name[0].toUpperCase())}</span></div>
    <div><span class="mk-small">${esc(b.kicker)}</span><p class="mk-h">${esc(b.title)}</p></div>
    <div class="mk-stack">${itemsHTML(b)}</div>
    ${chipsHTML(2)}
    <span class="mk-btn">${esc(b.action)}</span>
  </div></div></div>`;
}

function browserHTML(b) {
  const name = brandName();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbrand';
  return `<div class="mk-wrap"><div class="mk browser">
    <div class="br-bar"><i></i><i></i><i></i><span data-bd-slug>${esc(slug)}.com</span></div>
    <div class="br-body">
      <div class="mk-nav"><b data-bd-brand>${esc(name)}</b><span>Home</span><span>${esc(b.nav)}</span><span>Contact</span><span class="mk-pill mk-pill--ac">${esc(b.action)}</span></div>
      <div class="mk-split">
        <div class="mk-stack">
          <span class="mk-small">${esc(b.kicker)}</span>
          <p class="mk-h">${esc(b.title)}</p>
          <span class="mk-line" style="--w:85%"></span>
          <span class="mk-line" style="--w:60%"></span>
          <div class="mk-row"><span class="mk-btn">${esc(b.action)}</span></div>
        </div>
        <div class="mk-stack">${itemsHTML(b)}</div>
      </div>
      ${chipsHTML(5)}
    </div>
  </div></div>`;
}

export function init() {
  const root = document.getElementById('builder');
  if (!root) return;

  const canvas = document.getElementById('bd-canvas');
  const bizList = document.getElementById('bd-biz');
  const featList = document.getElementById('bd-feats');
  const nameInput = document.getElementById('bd-name');
  const outs = (key) => document.querySelectorAll(`[data-bd-out="${key}"]`);
  const setOut = (key, html) => outs(key).forEach((el) => (el.innerHTML = html));

  bizList.innerHTML = Object.entries(BUSINESSES)
    .map(
      ([key, b]) => `<label class="bd-card">
        <input type="radio" name="business" value="${key}" class="visually-hidden" ${key === state.business ? 'checked' : ''} />
        <span class="bd-card-in"><span class="bd-card-ico">${b.icon}</span><span><b>${b.name}</b><small>${b.desc}</small></span></span>
      </label>`
    )
    .join('');

  function renderFeatures() {
    featList.innerHTML = BUSINESSES[state.business].features
      .map(
        (f) => `<label class="bd-chip">
          <input type="checkbox" value="${esc(f)}" class="visually-hidden" ${state.features.includes(f) ? 'checked' : ''} />
          <span>${esc(f)}</span>
        </label>`
      )
      .join('');
  }

  function renderPreview(animate = true) {
    const b = BUSINESSES[state.business];
    canvas.dataset.platform = state.platform;
    canvas.innerHTML =
      state.platform === 'app'
        ? `<div class="bd-dev bd-dev--phone">${phoneHTML(b)}</div>`
        : state.platform === 'web'
          ? `<div class="bd-dev bd-dev--browser">${browserHTML(b)}</div>`
          : `<div class="bd-dev bd-dev--browser">${browserHTML(b)}</div><div class="bd-dev bd-dev--phone">${phoneHTML(b)}</div>`;
    if (animate) {
      canvas.classList.remove('is-swap');
      void canvas.offsetWidth;
      canvas.classList.add('is-swap');
    }
  }

  function renderSummary() {
    const p = PLATFORMS[state.platform];
    const b = BUSINESSES[state.business];
    const est = estimate();
    const n = state.features.length;
    setOut('kind', `${esc(b.name)} ${esc(p.short)}`);
    setOut('summary', `${esc(b.name)} ${esc(p.short)} · ${n} feature${n === 1 ? '' : 's'}`);
    setOut('weeks', est.weeks);
    setOut('screens', est.screens);
    setOut('platform', esc(p.label));
    setOut('business', esc(b.name));
    setOut('name', esc(brandName()));
    setOut(
      'features',
      n ? state.features.map((f) => `<span>${esc(f)}</span>`).join('') : '<em>None picked yet</em>'
    );
  }

  function update(animate = true) {
    renderPreview(animate);
    renderSummary();
  }

  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'platform') state.platform = t.value;
    else if (t.name === 'business') {
      state.business = t.value;
      state.features = BUSINESSES[t.value].features.slice(0, 3);
      renderFeatures();
    } else if (t.closest('#bd-feats')) {
      state.features = [...featList.querySelectorAll('input:checked')].map((i) => i.value);
    } else return;
    update();
  });

  nameInput.addEventListener('input', () => {
    state.name = nameInput.value.slice(0, 24);
    const name = brandName();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbrand';
    canvas.querySelectorAll('[data-bd-brand]').forEach((el) => (el.textContent = name));
    canvas.querySelectorAll('[data-bd-initial]').forEach((el) => (el.textContent = name[0].toUpperCase()));
    canvas.querySelectorAll('[data-bd-slug]').forEach((el) => (el.textContent = `${slug}.com`));
    renderSummary();
  });

  state.features = BUSINESSES[state.business].features.slice(0, 3);
  renderFeatures();
  update(false);

  initSheet();
}

function initSheet() {
  const sheet = document.getElementById('bd-sheet');
  const form = document.getElementById('bd-form');
  const status = document.getElementById('bd-status');
  let lastFocus = null;

  function show(view) {
    sheet.querySelectorAll('[data-view]').forEach((v) => (v.hidden = v.dataset.view !== view));
    const first = sheet.querySelector(`[data-view="${view}"] input, [data-view="${view}"] h2`);
    first?.focus({ preventScroll: true });
  }

  function open(view) {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-open'));
    document.documentElement.classList.add('bd-open');
    stopScroll();
    show(view);
  }

  function close() {
    sheet.classList.remove('is-open');
    document.documentElement.classList.remove('bd-open');
    startScroll();
    setTimeout(() => (sheet.hidden = true), 450);
    lastFocus?.focus?.({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-bd-open]');
    if (opener) {
      e.preventDefault();
      if (sheet.hidden) open(opener.dataset.bdOpen);
      else show(opener.dataset.bdOpen);
      return;
    }
    if (e.target.closest('[data-bd-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sheet.hidden) close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const btn = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const p = PLATFORMS[state.platform];
    const b = BUSINESSES[state.business];
    const est = estimate();
    const payload = {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      company: brandName(),
      service: state.platform,
      message: `New preview request:

Product: ${p.label}
Business: ${b.name}
Name: ${brandName()}
Features: ${state.features.join(', ') || 'None'}
Estimate shown: ${est.weeks}, ${est.screens} screens
Phone: ${data.get('phone').trim() || '-'}
Notes: ${data.get('notes').trim() || '-'}

---
Submitted via the preview builder`,
    };

    btn.disabled = true;
    status.textContent = 'Sending…';
    status.dataset.state = '';

    const apiUrl = location.hostname === 'localhost' ? 'http://localhost:3000/api/contact' : '/api/contact';
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) throw new Error('failed');
      form.reset();
      status.textContent = '';
      show('done');
    } catch {
      status.textContent = 'That didn’t go through. Please try again or email contactuswynklo@gmail.com.';
      status.dataset.state = 'error';
    } finally {
      btn.disabled = false;
    }
  });
}
