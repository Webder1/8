/**
 * Webder Contact Form Integration (Formspree)
 * Handles form submission, validation, and UI feedback for the contact page.
 * @version 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('webder-contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessages = document.getElementById('form-messages');
    const loadingSpinner = document.getElementById('loading-spinner');
    const fadeElements = document.querySelectorAll('.fade-in');

    // Initialize fade-in animations
    function initAnimations() {
        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // Validate email format
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate form fields
    function validateForm() {
        let isValid = true;
        const name = contactForm.elements['name'].value.trim();
        const email = contactForm.elements['email'].value.trim();
        const message = contactForm.elements['message'].value.trim();

        if (name.length < 2) {
            showError('Name must be at least 2 characters.');
            isValid = false;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            isValid = false;
        }

        if (message.length < 10) {
            showError('Message must be at least 10 characters.');
            isValid = false;
        }

        return isValid;
    }

    // Show error message with fade-in effect
    function showError(message) {
        formMessages.innerHTML = `<div class="error-message fade-in">${message}</div>`;
        formMessages.style.opacity = '1';
        setTimeout(() => {
            formMessages.style.opacity = '0';
        }, 5000);
    }

    // Show success message
    function showSuccess() {
        formMessages.innerHTML = `
            <div class="success-message fade-in">
                Thanks for reaching out! We'll get back to you within 24 hours.
            </div>
        `;
        formMessages.style.opacity = '1';
        contactForm.reset();
        setTimeout(() => {
            formMessages.style.opacity = '0';
        }, 5000);
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        submitBtn.disabled = true;
        loadingSpinner.style.display = 'block';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://formspree.io/f/xdkdkryv', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showSuccess();
            } else {
                throw new Error('Form submission failed.');
            }
        } catch (error) {
            showError('Oops! Something went wrong. Please try again later.');
            console.error('Formspree error:', error);
        } finally {
            submitBtn.disabled = false;
            loadingSpinner.style.display = 'none';
        }
    }

    // Event listeners
    contactForm.addEventListener('submit', handleSubmit);
    initAnimations();
});
