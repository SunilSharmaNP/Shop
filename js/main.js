/* ============================================
   KISHORI IRON STORE - MAIN JAVASCRIPT
   Core Functionality & Event Handling
   ============================================ */

// ===== UTILITY FUNCTIONS =====
const DOM = {
    header: document.querySelector('.main-header'),
    mobileToggle: document.querySelector('.mobile-menu-toggle'),
    navMenu: document.querySelector('.main-nav'),
    modal: document.getElementById('inquiry-modal'),
    modalClose: document.querySelector('.modal-close'),
    inquiryForm: document.getElementById('inquiry-form'),
    searchForm: document.querySelector('.search-form'),
    cartBadge: document.querySelector('.cart-badge'),
    whatsappWidget: document.querySelector('.whatsapp-widget'),
};

// ===== MOBILE MENU TOGGLE =====
if (DOM.mobileToggle) {
    DOM.mobileToggle.addEventListener('click', () => {
        const isActive = DOM.mobileToggle.classList.toggle('active');
        DOM.navMenu.classList.toggle('active');
        DOM.mobileToggle.setAttribute('aria-expanded', isActive);
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        DOM.mobileToggle.classList.remove('active');
        DOM.navMenu.classList.remove('active');
        DOM.mobileToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!DOM.header.contains(e.target)) {
        DOM.mobileToggle.classList.remove('active');
        DOM.navMenu.classList.remove('active');
    }
});

// ===== DROPDOWN MENU HANDLING =====
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-link');
    
    toggle?.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// ===== STICKY HEADER EFFECT =====
let lastScrollTop = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScrollTop = scrollTop;
});

// ===== INQUIRY MODAL HANDLING =====
function openInquiryModal(productId, productName) {
    document.getElementById('product-id').value = productId;
    document.getElementById('product-name').value = productName;
    DOM.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInquiryModal() {
    DOM.modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    DOM.inquiryForm.reset();
}

// Modal close button
if (DOM.modalClose) {
    DOM.modalClose.addEventListener('click', closeInquiryModal);
}

// Close modal when clicking outside
DOM.modal?.addEventListener('click', (e) => {
    if (e.target === DOM.modal) {
        closeInquiryModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.modal.classList.contains('active')) {
        closeInquiryModal();
    }
});

// ===== PRODUCT INQUIRY BUTTONS =====
document.querySelectorAll('.btn-inquire').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        const productTitle = card.querySelector('.product-title')?.textContent || 'Product';
        const productId = card.dataset.id || 'unknown';
        openInquiryModal(productId, productTitle);
    });
});

// ===== FORM SUBMISSION =====
if (DOM.inquiryForm) {
    DOM.inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(DOM.inquiryForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.email || !data.phone || !data.quantity) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        try {
            // Simulate form submission
            console.log('Inquiry submitted:', data);
            
            // In production, send to backend
            // const response = await fetch('/api/inquiries', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            showMessage('Thank you! We\'ll contact you soon.', 'success');
            closeInquiryModal();
            
            // Add to quote (localStorage)
            addToQuote(data);
            updateCartBadge();
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        }
    });
}

// ===== SHOPPING CART / QUOTE FUNCTIONALITY =====
function addToQuote(item) {
    let quote = JSON.parse(localStorage.getItem('quote')) || [];
    
    // Check if item already exists
    const existingItem = quote.find(q => q.product_name === item.product_name);
    
    if (existingItem) {
        existingItem.quantity = parseInt(existingItem.quantity) + parseInt(item.quantity);
    } else {
        quote.push({
            ...item,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });
    }
    
    localStorage.setItem('quote', JSON.stringify(quote));
}

function updateCartBadge() {
    const quote = JSON.parse(localStorage.getItem('quote')) || [];
    const badgeCount = quote.length;
    
    if (DOM.cartBadge) {
        DOM.cartBadge.textContent = badgeCount;
        DOM.cartBadge.style.display = badgeCount > 0 ? 'flex' : 'none';
    }
}

// ===== SEARCH FUNCTIONALITY =====
if (DOM.searchForm) {
    DOM.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchQuery = DOM.searchForm.querySelector('.search-input').value;
        const category = DOM.searchForm.querySelector('.category-select').value;
        
        if (searchQuery.trim()) {
            // Navigate to catalog with search parameters
            const params = new URLSearchParams();
            params.append('q', searchQuery);
            if (category) params.append('cat', category);
            window.location.href = `/pages/catalog.html?${params.toString()}`;
        }
    });
}

// ===== UTILITY FUNCTION: SHOW MESSAGE =====
function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 500;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        message.style.background = '#d4edda';
        message.style.color = '#155724';
        message.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        message.style.background = '#f8d7da';
        message.style.color = '#721c24';
        message.style.border = '1px solid #f5c6cb';
    } else {
        message.style.background = '#d1ecf1';
        message.style.color = '#0c5460';
        message.style.border = '1px solid #bee5eb';
    }
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 4000);
}

// ===== PAGE LOAD INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart badge
    updateCartBadge();
    
    // Add scroll reveal animations
    observeElements();
    
    // Log page load
    console.log('Kishori Iron Store - Loaded');
});

// ===== SCROLL REVEAL ANIMATIONS =====
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.product-card, .value-card, .testimonial-card').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// ===== UTILITY: RESPONSIVE IMAGE LOADING =====
function loadResponsiveImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== ANALYTICS TRACKING =====
function trackEvent(category, action, label) {
    if (window.gtag) {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Track inquiries
document.addEventListener('submit', (e) => {
    if (e.target === DOM.inquiryForm) {
        trackEvent('Engagement', 'Inquiry Submitted', 'Product Inquiry');
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl+/ or Cmd+/ to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== WINDOW RESIZE HANDLING =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Handle responsive changes
        if (window.innerWidth > 768) {
            DOM.mobileToggle?.classList.remove('active');
            DOM.navMenu?.classList.remove('active');
        }
    }, 250);
});

// ===== EXPORT FOR USE IN OTHER MODULES =====
window.KishoriStore = {
    openInquiryModal,
    closeInquiryModal,
    addToQuote,
    updateCartBadge,
    showMessage,
    trackEvent
};
