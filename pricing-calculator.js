/**
 * Webder Pricing Calculator
 * Interactive tool to estimate website costs based on client needs.
 * @version 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('webder-calculator');
    const priceDisplay = document.getElementById('price-display');
    const featureTooltips = document.querySelectorAll('.feature-tooltip');
    const planToggles = document.querySelectorAll('.plan-toggle input');
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    const fadeSections = document.querySelectorAll('.fade-section');

    // Base prices (starting at $149.99)
    const PRICING = {
        BASIC: 149.99,
        STANDARD: 349.99,
        PREMIUM: 699.99,
        PAGE: 25, // per additional page
        ADDONS: {
            seo: 99.99,
            ecommerce: 199.99,
            hosting: 49.99,
            maintenance: 79.99
        }
    };

    // Initialize animations
    function initAnimations() {
        fadeSections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 150 * index);
        });
    }

    // Update tooltip position for range inputs
    function updateRangeTooltips() {
        rangeInputs.forEach(input => {
            const tooltip = input.nextElementSibling;
            const value = input.value;
            const min = input.min || 0;
            const max = input.max || 100;
            const percent = ((value - min) / (max - min)) * 100;
            tooltip.textContent = `${value} pages`;
            tooltip.style.left = `calc(${percent}% - ${percent * 0.3}px)`;
        });
    }

    // Calculate total price
    function calculatePrice() {
        let total = 0;
        const selectedPlan = document.querySelector('.plan-toggle input:checked').value;
        const pageCount = parseInt(document.getElementById('page-range').value);

        // Add base plan price
        total += PRICING[selectedPlan.toUpperCase()];

        // Add extra pages (beyond default)
        const includedPages = selectedPlan === 'premium' ? 10 : selectedPlan === 'standard' ? 5 : 1;
        if (pageCount > includedPages) {
            total += (pageCount - includedPages) * PRICING.PAGE;
        }

        // Add addons
        addonCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += PRICING.ADDONS[checkbox.id];
            }
        });

        // Animate price update
        priceDisplay.classList.add('pulse');
        setTimeout(() => {
            priceDisplay.textContent = `$${total.toFixed(2)}`;
            priceDisplay.classList.remove('pulse');
        }, 300);
    }

    // Show/hide tooltips for features
    function initTooltips() {
        featureTooltips.forEach(tooltip => {
            const parent = tooltip.closest('.feature-item');
            parent.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            parent.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        });
    }

    // Event listeners
    planToggles.forEach(toggle => {
        toggle.addEventListener('change', calculatePrice);
    });

    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });

    rangeInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateRangeTooltips();
            calculatePrice();
        });
    });

    // Initialize
    initAnimations();
    initTooltips();
    updateRangeTooltips();
    calculatePrice(); // Set initial price
});
