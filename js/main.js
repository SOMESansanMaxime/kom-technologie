/* ========================
   HEADER SCROLL
======================== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ========================
   MOBILE MENU
======================== */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navLinks = nav.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  nav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ========================
   ACTIVE NAV LINK (scroll spy)
======================== */
const sections = document.querySelectorAll('section[id]');
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = nav.querySelector(`a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observerNav.observe(s));

/* ========================
   SCROLL REVEAL
======================== */
const revealEls = document.querySelectorAll(
  '.service-card, .project-card, .about-text, .about-visual, .contact-info, .contact-form, .number-item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.dataset.delay = (i % 3) * 80;
  revealObserver.observe(el);
});

/* ========================
   COUNTER ANIMATION
======================== */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const numberVals = document.querySelectorAll('.number-val[data-target]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target), 1200);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

numberVals.forEach(el => counterObserver.observe(el));

/* ========================
   CONTACT FORM
======================== */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', e => {
  e.preventDefault();

  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  if (!valid) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Envoyer ma demande <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    form.reset();
    successMsg.classList.add('visible');
    setTimeout(() => successMsg.classList.remove('visible'), 6000);
  }, 1200);
});

form.querySelectorAll('[required]').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

/* ========================
   SMOOTH SCROLL (fallback)
======================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
