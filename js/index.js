import { initTheme } from './theme.js';

// Modules are deferred — DOM is ready when this runs.
initTheme();

// Tool search and category filter (combined)
const searchInput    = document.getElementById('search-tools');
const toolCards      = document.querySelectorAll('.tool-card');
const categoryButtons = document.querySelectorAll('.category-btn');
let activeCategory   = sessionStorage.getItem('activeCategory') || 'all';

const noResults      = document.getElementById('no-results');
const filterStatus   = document.getElementById('filter-status');
const resetFiltersBtn = document.getElementById('reset-filters');

function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    let visibleCount = 0;

    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const matchesSearch = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const visible = matchesSearch && matchesCategory;

        card.style.display = visible ? '' : 'none';
        if (visible) visibleCount++;
    });

    noResults.hidden = visibleCount > 0;
    filterStatus.textContent = visibleCount > 0
        ? visibleCount + ' tool' + (visibleCount !== 1 ? 's' : '') + ' found'
        : 'No tools found matching your search';
}

searchInput.addEventListener('input', filterCards);

resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    activeCategory = 'all';
    categoryButtons.forEach(btn => {
        const isAll = btn.dataset.category === 'all';
        btn.classList.toggle('active', isAll);
        btn.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });
    sessionStorage.setItem('activeCategory', 'all');
    filterCards();
    searchInput.focus();
});

// Restore saved category filter
categoryButtons.forEach(btn => {
    const isActive = btn.dataset.category === activeCategory;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
});
filterCards();

categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
        activeCategory = this.dataset.category;
        sessionStorage.setItem('activeCategory', activeCategory);
        filterCards();
    });
});
