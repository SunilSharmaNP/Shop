// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Product Category Filter
const tabButtons = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Filter products
        const category = button.getAttribute('data-category');
        productCards.forEach(card => {
            if (card.getAttribute('data-category') === category) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Inquiry Modal
const inquiryModal = document.getElementById('inquiryModal');
const productNameInput = document.getElementById('productName');

function inquire(productName) {
    productNameInput.value = productName;
    inquiryModal.style.display = 'block';
}

function closeModal() {
    inquiryModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === inquiryModal) {
        inquiryModal.style.display = 'none';
    }
}

function submitInquiry(event) {
    event.preventDefault();
    
    // Get form values
    const formData = new FormData(event.target);
    const productName = document.getElementById('productName').value;
    
    // Create WhatsApp message
    const message = `Hello, I'm interested in ${productName}. Please provide details and pricing.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Close modal
    closeModal();
    event.target.reset();
}

function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const formData = new FormData(event.target);
    const name = formData.get('name') || 'User';
    const phone = formData.get('phone') || '1234567890';
    const message = formData.get('message') || 'Hello, I have an inquiry.';
    
    // Create WhatsApp message
    const whatsappMessage = `Name: ${name}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    event.target.reset();
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

// Lazy loading animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reason-card, .product-card, .testimonial-card').forEach(element => {
    observer.observe(element);
});
