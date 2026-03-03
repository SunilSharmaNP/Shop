// ========== SIDEBAR NAVIGATION ==========
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// Close sidebar when a link is clicked
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
});

// Submenu toggle
document.querySelectorAll('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = toggle.nextElementSibling;
        submenu.classList.toggle('active');
        toggle.classList.toggle('active');
    });
});

// ========== HERO SLIDER ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    slides[n].classList.add('active');
    indicators[n].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Indicator click
document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);

// ========== PRODUCT FILTERING ==========
function filterProducts(category) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });

    productCards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.classList.add('hidden');
        }
    });
}

// Tab button click events
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        filterProducts(category);
    });
});

// ========== INQUIRY MODAL ==========
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
    const productName = document.getElementById('productName').value;
    const message = `Hello, I'm interested in ${productName}. Please provide details and pricing.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeModal();
    event.target.reset();
}

// ========== CONTACT FORM SUBMISSION ==========
function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const message = 'New Inquiry: Please check my inquiry.';
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    event.target.reset();
    alert('Thank you! We will contact you soon.');
}

// ========== SMOOTH SCROLLING ==========
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

// ========== BACK TO TOP BUTTON ==========
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reason-card, .product-card, .testimonial-card').forEach(element => {
    observer.observe(element);
});

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

// ========== ACTIVE NAVBAR LINK ==========
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Initialize first product category
window.addEventListener('load', () => {
    filterProducts('cement');
});
