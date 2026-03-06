/* ============================================
   CAROUSEL FUNCTIONALITY
   Product & Collection Carousels
   ============================================ */

class Carousel {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.carousel = this.container?.querySelector('[class*="-carousel"]');
        this.prevBtn = this.container?.querySelector('.carousel-prev');
        this.nextBtn = this.container?.querySelector('.carousel-next');
        
        this.options = {
            scrollAmount: 320,
            smooth: true,
            ...options
        };
        
        if (this.carousel) {
            this.init();
        }
    }
    
    init() {
        // Navigation button events
        this.prevBtn?.addEventListener('click', () => this.scroll('prev'));
        this.nextBtn?.addEventListener('click', () => this.scroll('next'));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.scroll('prev');
            if (e.key === 'ArrowRight') this.scroll('next');
        });
        
        // Touch swipe support
        this.addTouchSupport();
        
        // Update button states on load and scroll
        this.updateButtonStates();
        this.carousel.addEventListener('scroll', () => this.updateButtonStates());
    }
    
    scroll(direction) {
        const scrollAmount = this.options.scrollAmount;
        const behavior = this.options.smooth ? 'smooth' : 'auto';
        
        if (direction === 'prev') {
            this.carousel.scrollBy({
                left: -scrollAmount,
                behavior
            });
        } else {
            this.carousel.scrollBy({
                left: scrollAmount,
                behavior
            });
        }
    }
    
    updateButtonStates() {
        const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;
        const currentScroll = this.carousel.scrollLeft;
        
        // Disable prev button at start
        this.prevBtn.style.opacity = currentScroll <= 0 ? '0.5' : '1';
        this.prevBtn.style.pointerEvents = currentScroll <= 0 ? 'none' : 'auto';
        
        // Disable next button at end
        this.nextBtn.style.opacity = currentScroll >= maxScroll ? '0.5' : '1';
        this.nextBtn.style.pointerEvents = currentScroll >= maxScroll ? 'none' : 'auto';
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', () => {
            const difference = startX - currentX;
            
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    this.scroll('next');
                } else {
                    this.scroll('prev');
                }
            }
        });
    }
}

// ===== TESTIMONIALS SLIDER =====
class TestimonialSlider {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.slides = this.container?.querySelectorAll('.testimonial-card');
        this.prevBtn = this.container?.querySelector('.testimonial-prev');
        this.nextBtn = this.container?.querySelector('.testimonial-next');
        
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        
        if (this.slides && this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Add active class to first slide
        this.showSlide(0);
        
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Auto-play
        this.startAutoPlay();
        
        // Stop auto-play on hover
        this.container?.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container?.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        this.slides[index].classList.add('active');
        this.currentIndex = index;
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
        this.resetAutoPlay();
    }
    
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => this.next(), 5000);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayTimer);
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ===== GALLERY THUMBNAIL SELECTOR =====
class GalleryThumbSelector {
    constructor(mainImageSelector, thumbButtonsSelector) {
        this.mainImage = document.querySelector(mainImageSelector);
        this.thumbButtons = document.querySelectorAll(thumbButtonsSelector);
        
        if (this.mainImage && this.thumbButtons.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.thumbButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const imageSrc = btn.dataset.src;
                
                // Update main image with fade effect
                this.mainImage.style.opacity = '0';
                setTimeout(() => {
                    this.mainImage.src = imageSrc;
                    this.mainImage.style.opacity = '1';
                }, 200);
                
                // Update active state
                this.thumbButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

// ===== INITIALIZE ALL CAROUSELS ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Collections carousel
    new Carousel('.collections-section', {
        scrollAmount: 200
    });
    
    // Testimonials slider
    new TestimonialSlider('.testimonials-section');
    
    // Gallery thumbnail selector
    new GalleryThumbSelector(
        '#gallery-main-img',
        '.thumb-btn'
    );
    
    console.log('Carousels initialized');
});

// ===== EXPORT FOR MANUAL USE =====
window.CarouselUtils = {
    Carousel,
    TestimonialSlider,
    GalleryThumbSelector
};
