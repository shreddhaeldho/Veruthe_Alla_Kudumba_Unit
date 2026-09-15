/* ========================================
   VERUTHE ALLA KUDUMBA UNIT
   Scroll Animations — animations.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});

function initScrollReveal() {
  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
