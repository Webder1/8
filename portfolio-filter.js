/**
 * Webder Portfolio Filtering System
 * Interactive gallery to showcase client websites with category filtering.
 * @version 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const itemsPerLoad = 6;
    let visibleItems = itemsPerLoad;

    // Initialize animations and lazy loading
    function initPortfolio() {
        // Fade-in grid items with staggered delay
        portfolioItems.forEach((item, index) => {
            if (index < visibleItems) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100 * index);
            }
            // Lazy load images
            const img = item.querySelector('img[data-src]');
            if (img) {
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
            }
        });

        // Hide "Load More" if all items are visible
        if (visibleItems >= portfolioItems.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Filter items by category
    function filterPortfolio(category) {
        portfolioItems.forEach(item => {
            const itemCategories = item.dataset.categories.split(' ');
            const isMatch = category === 'all' || itemCategories.includes(category);

            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
                item.style.display = isMatch ? 'block' : 'none';
                if (isMatch) {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }
            }, 300);
        });

        // Reset visible items count
        visibleItems = itemsPerLoad;
        loadMoreBtn.style.display = 'block';
    }

    // Load more items
    function loadMoreItems() {
        const hiddenItems = Array.from(portfolioItems).filter(item => 
            item.style.display !== 'none' && getComputedStyle(item).opacity === '0'
        );

        hiddenItems.slice(0, itemsPerLoad).forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100 * index);
        });

        visibleItems += itemsPerLoad;
        if (visibleItems >= hiddenItems.length + itemsPerLoad) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Filter items
            filterPortfolio(this.dataset.filter);
        });
    });

    loadMoreBtn.addEventListener('click', loadMoreItems);

    // Initialize
    initPortfolio();
});
