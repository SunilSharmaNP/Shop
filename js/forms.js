/* ============================================
   FORM HANDLING & VALIDATION
   Modern Form Management
   ============================================ */

class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.errors = {};
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Real-time validation
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('change', () => this.validateField(field));
        });
    }
    
    validateField(field) {
        const rules = this.getFieldRules(field);
        const errors = [];
        
        for (const rule of rules) {
            const error = this.runValidation(field, rule);
            if (error) errors.push(error);
        }
        
        if (errors.length > 0) {
            this.showFieldError(field, errors[0]);
            this.errors[field.name] = errors[0];
        } else {
            this.clearFieldError(field);
            delete this.errors[field.name];
        }
        
        return errors.length === 0;
    }
    
    getFieldRules(field) {
        const rules = [];
        const type = field.type;
        const name = field.name;
        
        // Required validation
        if (field.required) {
            rules.push({ type: 'required' });
        }
        
        // Email validation
        if (type === 'email' || name === 'email') {
            rules.push({ type: 'email' });
        }
        
        // Phone validation
        if (name === 'phone') {
            rules.push({ type: 'phone' });
        }
        
        // Number validation
        if (type === 'number') {
            rules.push({ type: 'number' });
            if (field.min) rules.push({ type: 'min', value: field.min });
        }
        
        return rules;
    }
    
    runValidation(field, rule) {
        const value = field.value.trim();
        
        switch (rule.type) {
            case 'required':
                return !value ? `${this.getFieldLabel(field)} is required` : null;
            
            case 'email':
                return value && !this.isValidEmail(value) ? 'Please enter a valid email' : null;
            
            case 'phone':
                return value && !this.isValidPhone(value) ? 'Please enter a valid phone number' : null;
            
            case 'number':
                return value && isNaN(value) ? 'Please enter a valid number' : null;
            
            case 'min':
                return value && parseInt(value) < rule.value ? `Minimum value is ${rule.value}` : null;
            
            default:
                return null;
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    getFieldLabel(field) {
        return field.labels[0]?.textContent.trim() || field.name;
    }
    
    showFieldError(field, message) {
        const wrapper = field.closest('.form-group');
        if (!wrapper) return;
        
        wrapper.classList.add('has-error');
        
        let errorElement = wrapper.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            wrapper.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        const wrapper = field.closest('.form-group');
        if (!wrapper) return;
        
        wrapper.classList.remove('has-error');
        const errorElement = wrapper.querySelector('.error-message');
        if (errorElement) errorElement.remove();
    }
    
    validate() {
        let isValid = true;
        
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    getValues() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData);
    }
    
    reset() {
        this.form.reset();
        this.errors = {};
        this.form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) errorElement.remove();
        });
    }
}

// ===== ERROR MESSAGE STYLING =====
const errorMessageStyles = `
    .form-group.has-error input,
    .form-group.has-error textarea,
    .form-group.has-error select {
        border-color: #ef4444;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: slideDown 0.2s ease-out;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = errorMessageStyles;
document.head.appendChild(styleSheet);

// ===== CONTACT FORM HANDLER =====
class ContactFormHandler {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.validator = new FormValidator(formSelector);
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validator.validate()) {
            window.KishoriStore.showMessage('Please fix the errors and try again', 'error');
            return;
        }
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const formData = this.validator.getValues();
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Contact form submitted:', formData);
            
            // Show success message
            window.KishoriStore.showMessage('Thank you! We\'ll be in touch soon.', 'success');
            
            // Reset form
            this.validator.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            window.KishoriStore.showMessage('An error occurred. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

// ===== INITIALIZE FORMS =====
document.addEventListener('DOMContentLoaded', () => {
    // Inquiry form validation
    const inquiryValidator = new FormValidator('#inquiry-form');
    
    // Contact form if it exists
    if (document.querySelector('.contact-form')) {
        new ContactFormHandler('.contact-form');
    }
    
    console.log('Forms initialized');
});

// ===== EXPORT FOR USE =====
window.FormUtils = {
    FormValidator,
    ContactFormHandler
};
