/* ==========================================================================
   Webder Main JavaScript
   Version: 3.0
   Author: Webder Team
   Includes:
   - Mobile navigation
   - Smooth scrolling
   - Scroll animations
   - Back-to-top button
   - Loading screen
   - Cookie consent
   - Dark mode toggle
   - Form handling
   - Interactive elements
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  /* ==========================================================================
     1. Mobile Navigation
     ========================================================================== */

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');

  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (mainNav.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  });

  /* ==========================================================================
     2. Smooth Scrolling
     ========================================================================== */

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });

  /* ==========================================================================
     3. Scroll Animations
     ========================================================================== */

  // Initialize scroll reveal elements
  const revealElements = document.querySelectorAll('.reveal');

  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('revealed');
      }
    });
  }

  // Run on load and scroll
  window.addEventListener('load', checkReveal);
  window.addEventListener('scroll', checkReveal);

  /* ==========================================================================
     4. Back to Top Button
     ========================================================================== */

  const backToTop = document.querySelector('.back-to-top');

  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('active');
    } else {
      backToTop.classList.remove('active');
    }
  }

  backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', toggleBackToTop);

  /* ==========================================================================
     5. Loading Screen
     ========================================================================== */

  const loadingScreen = document.querySelector('.loading-screen');

  function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    document.body.classList.remove('preload');
  }

  // Wait for all assets to load
  window.addEventListener('load', function() {
    setTimeout(hideLoadingScreen, 500);
  });

  // Fallback in case load event doesn't fire
  setTimeout(hideLoadingScreen, 3000);

  /* ==========================================================================
     6. Cookie Consent
     ========================================================================== */

  const cookieConsent = document.querySelector('.cookie-consent');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');

  function checkCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        cookieConsent.style.display = 'block';
      }, 2000);
    }
  }

  acceptCookies.addEventListener('click', function() {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsent.style.display = 'none';
  });

  declineCookies.addEventListener('click', function() {
    localStorage.setItem('cookiesAccepted', 'false');
    cookieConsent.style.display = 'none';
  });

  checkCookieConsent();

  /* ==========================================================================
     7. Dark Mode Toggle
     ========================================================================== */

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function applyDarkMode(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  }

  // Check localStorage for user preference
  if (localStorage.getItem('darkMode') === 'enabled' || 
      (localStorage.getItem('darkMode') !== 'disabled' && prefersDarkScheme.matches)) {
    applyDarkMode(true);
  }

  // Toggle dark mode manually
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      const isDark = !document.body.classList.contains('dark-mode');
      applyDarkMode(isDark);
    });
  }

  // Watch for system preference changes
  prefersDarkScheme.addListener(e => {
    if (localStorage.getItem('darkMode') === null) {
      applyDarkMode(e.matches);
    }
  });

  /* ==========================================================================
     8. Interactive Elements
     ========================================================================== */

  // Accordion functionality
  const accordions = document.querySelectorAll('.faq-question');

  accordions.forEach(accordion => {
    accordion.addEventListener('click', function() {
      this.classList.toggle('active');
      const panel = this.nextElementSibling;
      
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Tab functionality
  const tabButtons = document.querySelectorAll('[data-tab]');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      const tabContainer = this.closest('.tabs');
      
      // Update active button
      tabContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Update active tab content
      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
    });
  });

  /* ==========================================================================
     9. Form Handling
     ========================================================================== */

  // Basic form validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        form.querySelector('.error').focus();
      }
    });
  });

  // Input focus effects
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });

  /* ==========================================================================
     10. Miscellaneous Utilities
     ========================================================================== */

  // Current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // External link indicator
  document.querySelectorAll('a').forEach(link => {
    if (link.hostname !== window.location.hostname && !link.hasAttribute('data-internal')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      const icon = document.createElement('i');
      icon.className = 'fas fa-external-link-alt';
      icon.style.marginLeft = '4px';
      icon.setAttribute('aria-hidden', 'true');
      
      link.appendChild(icon);
      link.setAttribute('aria-label', link.textContent + ' (opens in new tab)');
    }
  });

  // Lazy loading images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* ==========================================================================
     11. Animation Helpers
     ========================================================================== */

  // Animate elements when they come into view
  function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('animated');
      }
    });
  }

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // Parallax effect
  function updateParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const offset = window.pageYOffset * speed;
      element.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax);
  window.addEventListener('resize', updateParallax);

  /* ==========================================================================
     12. Responsive Adjustments
     ========================================================================== */

  function handleResponsiveChanges() {
    // Adjustments based on viewport size
    const viewportWidth = window.innerWidth;
    
    // Example: Change hero height on mobile
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.minHeight = viewportWidth < 768 ? '80vh' : '100vh';
    }
  }

  window.addEventListener('resize', handleResponsiveChanges);
  handleResponsiveChanges();

  /* ==========================================================================
     13. Performance Optimizations
     ========================================================================== */

  // Debounce scroll/resize events
  function debounce(func, wait = 100) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  window.addEventListener('scroll', debounce(checkReveal));
  window.addEventListener('resize', debounce(handleResponsiveChanges));

  // Request Animation Frame for smooth animations
  function animate() {
    requestAnimationFrame(animate);
    // Animation logic here
  }

  animate();

  /* ==========================================================================
     14. Accessibility Improvements
     ========================================================================== */

  // Focus styles for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });

  // Skip to content link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('main-content').focus();
    });
  }

  /* ==========================================================================
     15. Error Handling
     ========================================================================== */

  // Global error handler
  window.addEventListener('error', function(e) {
    console.error('Global error:', e.message, e.filename, e.lineno, e.colno);
    // Optionally send error to logging service
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled rejection:', e.reason);
    e.preventDefault();
  });
});

// Initialize when fully loaded
if (document.readyState === 'complete') {
  document.dispatchEvent(new Event('DOMContentLoaded'));
}
