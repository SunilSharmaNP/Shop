/* ============================================================================
   KISHORI IRON STORE - COMPLETE JAVASCRIPT
   ============================================================================ */

// ============================================================================
// 1. DOM ELEMENTS & VARIABLES
// ============================================================================

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const categoryBtn = document.getElementById('categoryBtn');
const categoryList = document.getElementById('categoryList');
const categoryToggle = document.getElementById('categoryBtn');

const heroSlides = document.querySelectorAll('.hero-slide');
const sliderDots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const progressFill = document.querySelector('.progress-fill');

const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const productGrid = document.getElementById('productGrid');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const quickViewModal = document.getElementById('quickViewModal');
const inquiryModal = document.getElementById('inquiryModal');
const quickViewBody = document.getElementById('quickViewBody');
const inquiryProduct = document.getElementById('inquiryProduct');

const backToTopBtn = document.getElementById('backToTop');
const navbarMenuLinks = document.querySelectorAll('.navbar-menu-link');

// ============================================================================
// 2. SIDEBAR FUNCTIONALITY
// ============================================================================

openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Close sidebar when clicking on nav links
document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Category toggle in sidebar
categoryToggle.addEventListener('click', () => {
    categoryList.classList.toggle('active');
    const chevron = categoryToggle.querySelector('i:last-child');
    chevron.style.transform = categoryList.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
});

categoryList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        categoryList.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// ============================================================================
// 3. HERO SLIDER FUNCTIONALITY
// ============================================================================

let currentSlide = 0;
let sliderInterval;

function showSlide(index) {
    // Clamp index
    currentSlide = (index + heroSlides.length) % heroSlides.length;
    
    // Remove active from all
    heroSlides.forEach(slide => slide.classList.remove('active'));
    sliderDots.forEach(dot => dot.classList.remove('active'));
    
    // Add active to current
    heroSlides[currentSlide].classList.add('active');
    sliderDots[currentSlide].classList.add('active');
    
    // Reset progress
    resetSliderProgress();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function resetSliderProgress() {
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    
    // Trigger reflow
    void progressFill.offsetWidth;
    
    progressFill.style.transition = 'width 5s linear';
    progressFill.style.width = '100%';
    
    clearInterval(sliderInterval);
    sliderInterval = setTimeout(nextSlide, 5000);
}

// Event listeners for slider controls
prevBtn.addEventListener('click', () => {
    prevSlide();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
});

// Dot clicks
sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto-advance slider
function startSlider() {
    showSlide(0);
    resetSliderProgress();
}

startSlider();

// ============================================================================
// 4. PRODUCT FILTERING
// ============================================================================

function filterProducts(category) {
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });

    // Filter products
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });

    // Close sidebar if open
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterProducts(btn.dataset.filter);
    });
});

// ============================================================================
// 5. SEARCH FUNCTIONALITY
// ============================================================================

function performSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const desc = card.querySelector('.product-desc').textContent.toLowerCase();
        const category = card.dataset.category;
        
        if (searchTerm === '' || title.includes(searchTerm) || desc.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    } else {
        performSearch(searchInput.value);
    }
});

// ============================================================================
// 6. WISHLIST FUNCTIONALITY
// ============================================================================

function toggleWishlist(btn) {
    const icon = btn.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    
    if (icon.classList.contains('fas')) {
        btn.style.color = 'var(--secondary)';
        // Could add to localStorage here
    } else {
        btn.style.color = 'var(--primary)';
    }
}

// ============================================================================
// 7. QUICK VIEW MODAL
// ============================================================================

function quickView(productName, price, description) {
    quickViewBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <div style="width: 100%; height: 250px; background: var(--light-bg); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-box-open" style="font-size: 48px; color: #ccc;"></i>
                </div>
            </div>
            <div>
                <h3 style="color: var(--primary); margin-bottom: 10px;">${productName}</h3>
                <p style="color: var(--text-light); margin-bottom: 15px;">${description}</p>
                <p style="font-size: 1.8rem; font-weight: 900; color: var(--secondary); margin-bottom: 20px;">${price}</p>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="inquireNow('${productName}')"><i class="fas fa-phone"></i> Inquiry</button>
                    <button class="btn btn-outline" onclick="closeQuickView()">Close</button>
