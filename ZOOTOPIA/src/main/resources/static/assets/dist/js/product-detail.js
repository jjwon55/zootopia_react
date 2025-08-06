// Product Detail Page JavaScript

// Product price for calculation
let productPrice = 0;
let productNo = 0;

// CSRF token 가져오기
function getCSRFToken() {
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    return csrfToken ? csrfToken.getAttribute('content') : '';
}

function getCSRFHeader() {
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]');
    return csrfHeader ? csrfHeader.getAttribute('content') : '';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Get product price from the page
    const priceElement = document.querySelector('.current-price');
    if (priceElement) {
        const priceText = priceElement.textContent.replace(/[^0-9]/g, '');
        productPrice = parseInt(priceText) || 0;
        console.log('Product price set to:', productPrice);
    }
    
    // Get product number from the breadcrumb or URL
    const pathSegments = window.location.pathname.split('/');
    productNo = parseInt(pathSegments[pathSegments.length - 1]) || 0;
    console.log('Product number set to:', productNo);
    
    // Update total price initially
    updateTotalPrice();
    
    // Add event listeners
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', updateTotalPrice);
        console.log('Quantity input change listener added');
    }
    
    // Add event listeners for quantity buttons
    const increaseBtn = document.querySelector('.btn-increase');
    const decreaseBtn = document.querySelector('.btn-decrease');
    
    console.log('Increase button found:', increaseBtn);
    console.log('Decrease button found:', decreaseBtn);
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', increaseQuantity);
        console.log('Increase button click listener added');
    }
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', decreaseQuantity);
        console.log('Decrease button click listener added');
    }
    
    // Review form submission
    const reviewForm = document.getElementById('product_reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview);
    }
});

// Quantity control functions
function increaseQuantity() {
    console.log('increaseQuantity called'); // 디버그용
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) {
        console.log('quantity input not found');
        return;
    }
    
    const currentValue = parseInt(quantityInput.value) || 1;
    const maxValue = parseInt(quantityInput.getAttribute('max')) || 1000;
    
    console.log('Current value:', currentValue, 'Max value:', maxValue);
    
    if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
        console.log('New value:', quantityInput.value);
        updateTotalPrice();
    } else {
        console.log('Maximum quantity reached');
    }
}

function decreaseQuantity() {
    console.log('decreaseQuantity called'); // 디버그용
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) {
        console.log('quantity input not found');
        return;
    }
    
    const currentValue = parseInt(quantityInput.value) || 1;
    const minValue = parseInt(quantityInput.getAttribute('min')) || 1;
    
    console.log('Current value:', currentValue, 'Min value:', minValue);
    
    if (currentValue > minValue) {
        quantityInput.value = currentValue - 1;
        console.log('New value:', quantityInput.value);
        updateTotalPrice();
    } else {
        console.log('Minimum quantity reached');
    }
}

// Make functions available globally
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;

// Update total price based on quantity
function updateTotalPrice() {
    console.log('updateTotalPrice called');
    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('totalPrice');
    
    console.log('quantityInput:', quantityInput);
    console.log('totalPriceElement:', totalPriceElement);
    console.log('productPrice:', productPrice);
    
    if (quantityInput && totalPriceElement) {
        const quantity = parseInt(quantityInput.value) || 1;
        const totalPrice = productPrice * quantity;
        
        console.log('quantity:', quantity, 'totalPrice:', totalPrice);
        
        // Format number with commas
        const formattedPrice = totalPrice.toLocaleString('ko-KR') + '원';
        totalPriceElement.textContent = formattedPrice;
        
        console.log('Updated total price to:', formattedPrice);
    }
}

// Add to cart function
function addToCart() {
    const optionSelect = document.getElementById('productOption');
    const quantityInput = document.getElementById('quantity');
    
    // Validation
    if (!optionSelect.value) {
        showToast('옵션을 선택해주세요.', 'warning');
        optionSelect.focus();
        return;
    }
    
    const quantity = parseInt(quantityInput.value) || 1;
    
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 추가 중...';
    
    // API call to add to cart
    const formData = new FormData();
    formData.append('productNo', productNo);
    formData.append('option', optionSelect.value);
    formData.append('quantity', quantity);
    
    fetch('/products/add-to-cart', {
        method: 'POST',
        headers: {
            [getCSRFHeader()]: getCSRFToken()
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        button.disabled = false;
        button.innerHTML = originalText;
        
        if (data.success) {
            showToast(data.message, 'success');
            // 장바구니 아이콘 업데이트 (추후 구현)
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        button.disabled = false;
        button.innerHTML = originalText;
        showToast('오류가 발생했습니다.', 'error');
    });
}

// Buy now function
function buyNow() {
    const optionSelect = document.getElementById('productOption');
    const quantityInput = document.getElementById('quantity');
    
    // Validation
    if (!optionSelect.value) {
        showToast('옵션을 선택해주세요.', 'warning');
        optionSelect.focus();
        return;
    }
    
    const quantity = parseInt(quantityInput.value) || 1;
    
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
    
    // API call for immediate purchase
    const formData = new FormData();
    formData.append('productNo', productNo);
    formData.append('option', optionSelect.value);
    formData.append('quantity', quantity);
    
    fetch('/products/buy-now', {
        method: 'POST',
        headers: {
            [getCSRFHeader()]: getCSRFToken()
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        button.disabled = false;
        button.innerHTML = originalText;
        
        if (data.success) {
            showToast(data.message, 'success');
            if (data.redirectUrl) {
                // 주문 페이지로 이동
                setTimeout(() => {
                    window.location.href = data.redirectUrl;
                }, 1000);
            }
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        button.disabled = false;
        button.innerHTML = originalText;
        showToast('오류가 발생했습니다.', 'error');
    });
}

// Submit review function
function submitReview(event) {
    event.preventDefault();
    
    const productId = document.getElementById('product_reviewId')?.value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const content = document.getElementById('product_reviewContent')?.value.trim();
    
    // Validation
    if (!rating) {
        alert('별점을 선택해주세요.');
        return;
    }
    
    if (!content) {
        alert('리뷰 내용을 입력해주세요.');
        document.getElementById('product_reviewContent').focus();
        return;
    }
    
    if (content.length < 10) {
        alert('리뷰 내용을 10자 이상 입력해주세요.');
        document.getElementById('product_reviewContent').focus();
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 등록 중...';
    
    // Prepare form data
    const formData = {
        productId: productId,
        rating: parseInt(rating),
        content: content
    };
    
    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Show success message
        showToast('리뷰가 등록되었습니다!', 'success');
        
        // Reset form
        document.getElementById('product_reviewForm').reset();
        
        // Optionally reload reviews section
        console.log('Review submitted:', formData);
        
        // In real implementation, you would:
        // 1. Send AJAX request to server
        // 2. Update reviews list dynamically
        // 3. Update average rating and review count
    }, 1500);
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                border-left: 4px solid #007bff;
            }
            .toast-success { border-left-color: #28a745; }
            .toast-error { border-left-color: #dc3545; }
            .toast-warning { border-left-color: #ffc107; }
            .toast-info { border-left-color: #17a2b8; }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .toast-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #999;
                cursor: pointer;
                padding: 0;
                margin-left: 15px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Get appropriate icon for toast type
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': 
        default: return 'fa-info-circle';
    }
}

// Image zoom functionality (optional enhancement)
function initImageZoom() {
    const productImage = document.querySelector('.product-detail-image img');
    if (productImage) {
        productImage.addEventListener('click', function() {
            // Create modal for image zoom
            const modal = document.createElement('div');
            modal.className = 'image-zoom-modal';
            modal.innerHTML = `
                <div class="image-zoom-backdrop" onclick="this.parentElement.remove()">
                    <img src="${this.src}" alt="${this.alt}" class="zoomed-image">
                    <button class="zoom-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            
            // Add zoom modal styles
            if (!document.getElementById('zoom-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'zoom-modal-styles';
                styles.textContent = `
                    .image-zoom-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.9);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                        animation: fadeIn 0.3s ease;
                    }
                    .image-zoom-backdrop {
                        position: relative;
                        max-width: 90%;
                        max-height: 90%;
                    }
                    .zoomed-image {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                    }
                    .zoom-close {
                        position: absolute;
                        top: -40px;
                        right: 0;
                        background: none;
                        border: none;
                        color: white;
                        font-size: 2rem;
                        cursor: pointer;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }
            
            document.body.appendChild(modal);
        });
    }
}

// Initialize image zoom when page loads
document.addEventListener('DOMContentLoaded', initImageZoom);
