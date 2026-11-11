/* ========================================
   Wynklo - Contact page: form + next call slot
   ======================================== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Call slots: Mon–Sat, 10:00–19:00 IST, every 30 minutes, at least 1 hour out.
const IST_OFFSET_MIN = 330;
const OPEN_HOUR = 10;
const CLOSE_HOUR = 19;

function nextSlot(now = new Date()) {
  const ist = new Date(now.getTime() + (IST_OFFSET_MIN + now.getTimezoneOffset()) * 60000);
  const slot = new Date(ist.getTime() + 60 * 60000);
  slot.setSeconds(0, 0);
  slot.setMinutes(slot.getMinutes() <= 30 ? 30 : 60);

  for (let i = 0; i < 14 * 48; i++) {
    const h = slot.getHours();
    const open = slot.getDay() !== 0 && h >= OPEN_HOUR && h < CLOSE_HOUR;
    if (open) break;
    slot.setMinutes(slot.getMinutes() + 30);
  }

  // Back from IST wall-clock to a real instant, then show it in the visitor's own time.
  return new Date(slot.getTime() - (IST_OFFSET_MIN + now.getTimezoneOffset()) * 60000);
}

function formatSlot(date, now = new Date()) {
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(date) - startOf(now)) / 86400000);
  if (days === 0) return `Today ${time}`;
  if (days === 1) return `Tomorrow ${time}`;
  return `${date.toLocaleDateString([], { weekday: 'short' })} ${time}`;
}

function initNextSlot() {
  const el = document.querySelector('[data-next-slot]');
  if (!el) return;
  const update = () => (el.textContent = formatSlot(nextSlot()));
  update();
  setInterval(update, 60000);
}

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');
  const submit = form.querySelector('.form-submit');
  const label = submit.querySelector('span');
  const required = form.querySelectorAll('[required]');

  const setStatus = (text, type = '') => {
    status.textContent = text;
    status.className = `form-status${type ? ` is-${type}` : ''}`;
  };

  const validate = (field) => {
    const value = field.value.trim();
    const ok = field.type === 'email' ? EMAIL_RE.test(value) : value.length > 0;
    field.classList.toggle('field-error', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    return ok;
  };

  required.forEach((field) => {
    field.addEventListener('blur', () => field.value && validate(field));
    field.addEventListener('input', () => field.classList.contains('field-error') && validate(field));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const invalid = [...required].filter((field) => !validate(field));
    if (invalid.length) {
      setStatus('Add your name and a valid email so we can reply.', 'error');
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    submit.disabled = true;
    label.textContent = 'Sending…';
    setStatus('');

    try {
      const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/contact' : '/api/contact';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error('Send failed');

      form.reset();
      setStatus("Sent! We'll get back to you within 24 hours.", 'success');
    } catch {
      setStatus("That didn't go through. Try again or WhatsApp us on +91 84910 41426.", 'error');
    } finally {
      submit.disabled = false;
      label.textContent = 'Send';
    }
  });
}

export function initContactForm() {
  initForm();
  initNextSlot();
}
