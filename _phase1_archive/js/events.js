/* ========================================
   VERUTHE ALLA KUDUMBA UNIT
   Events Page JS — events.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCategoryFilter();
  initEventSearch();
});

/* ============================
   CATEGORY FILTER
   ============================ */
function initCategoryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card[data-category]');
  if (!filterBtns.length || !eventCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      eventCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          // Animate in
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================
   EVENT SEARCH
   ============================ */
function initEventSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const eventCards = document.querySelectorAll('.event-card[data-category]');
  if (!searchInput || !eventCards.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    eventCards.forEach(card => {
      const title = card.querySelector('.event-card-title')?.textContent.toLowerCase() || '';
      const category = card.dataset.category?.toLowerCase() || '';
      const location = card.querySelector('.event-card-meta')?.textContent.toLowerCase() || '';

      if (title.includes(query) || category.includes(query) || location.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Reset filter buttons when searching
    if (query) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      const allBtn = document.querySelector('.filter-btn[data-category="all"]');
      if (allBtn) allBtn.classList.add('active');
    }
  });
}
