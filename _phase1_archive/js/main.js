/* ========================================
   VERUTHE ALLA KUDUMBA UNIT
   Main JS — main.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initFAQ();
  initMarquee();
});

/* ============================
   NAVBAR — Sticky scroll effect
   ============================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ============================
   MOBILE MENU
   ============================ */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============================
   SMOOTH SCROLL
   ============================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================
   FAQ ACCORDION
   ============================ */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ============================
   MARQUEE — duplicate content for seamless loop
   ============================ */
function initMarquee() {
  const marquees = document.querySelectorAll('.marquee-track');
  marquees.forEach(track => {
    const content = track.querySelector('.marquee-content');
    if (content && !track.querySelector('.marquee-content:nth-child(2)')) {
      const clone = content.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  });
}
