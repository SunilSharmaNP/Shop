// ========== SIDEBAR FUNCTIONALITY ==========
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');

menuBtn?.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

sidebarClose?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// ========== PRODUCT FILTERING ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        document.querySelectorAll('.product-item').forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                item.style.animation = 'slideIn 0.3s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ========== INQUIRY MODAL ==========
const modal = document.getElementById('inquiryModal');

function inquire(productName) {
    document.getElementById('productName').value = productName;
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function submitInquiry(e) {
    e.preventDefault();
    const productName = document.getElementById('productName').value;
    const message = `Interested in ${productName}. Please provide details.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeModal();
}

// ========== CONTACT
