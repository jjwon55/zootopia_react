// 상품 목록 페이지 JavaScript

// 좋아요/싫어요 토글 함수
function toggleLike(productNo, type) {
    // 로그인 확인 (간단한 체크)
    const isLoggedIn = document.querySelector('a[href="/logout"]') !== null;
    
    if (!isLoggedIn) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
    }
    
    // CSRF 토큰 가져오기
    const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
    
    // AJAX 요청
    fetch(`/products/toggle-like/${productNo}?type=${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && header && { [header]: token })
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 성공 메시지 표시
            showToast(data.message, 'success');
            
            // 통계 업데이트
            updateStats(productNo, data.likes, data.dislikes);
            
            // 버튼 애니메이션
            animateButton(productNo, type);
        } else {
            showToast(data.message || '처리에 실패했습니다.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('오류가 발생했습니다.', 'error');
    });
}

// 통계 업데이트 함수
function updateStats(productNo, likes, dislikes) {
    const card = document.querySelector(`[data-product-no="${productNo}"]`);
    if (!card) return;
    
    const likesStat = card.querySelector('.stat-like span:last-child');
    const dislikesStat = card.querySelector('.stat-dislike span:last-child');
    
    if (likesStat) likesStat.textContent = likes;
    if (dislikesStat) dislikesStat.textContent = dislikes;
}

// 버튼 애니메이션 함수
function animateButton(productNo, type) {
    const card = document.querySelector(`[data-product-no="${productNo}"]`);
    if (!card) return;
    
    const button = card.querySelector(type === 'like' ? '.btn-like' : '.btn-dislike');
    if (!button) return;
    
    // 애니메이션 클래스 추가
    button.classList.add('button-clicked');
    
    // 애니메이션 제거
    setTimeout(() => {
        button.classList.remove('button-clicked');
    }, 300);
}

// 토스트 알림 함수
function showToast(message, type = 'info') {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // 스타일 추가 (한 번만)
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
            .button-clicked {
                transform: scale(1.2);
                transition: transform 0.3s ease;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // 페이지에 추가
    document.body.appendChild(toast);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// 토스트 아이콘 얻기
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': 
        default: return 'fa-info-circle';
    }
}

// 좋아요 버튼 애니메이션 CSS 추가
const style = document.createElement('style');
style.textContent = `
    .btn-heart.liked {
        animation: heartBeat 0.3s ease;
        background: #ff5a8a !important;
    }
    
    @keyframes heartBeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .toast-notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
`;
document.head.appendChild(style);

// 이미지 로드 에러 처리
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/img/default-thumbnail.png';
            this.alt = '이미지를 불러올 수 없습니다';
        });
    });
    
    // 검색 입력시 엔터키 처리
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.closest('form').submit();
            }
        });
    }
});

// 무한 스크롤 (선택사항)
let isLoading = false;
let currentPage = 1;

function loadMoreProducts() {
    if (isLoading) return;
    
    isLoading = true;
    currentPage++;
    
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', currentPage);
    
    fetch(`/products/list?${urlParams.toString()}`)
        .then(response => response.text())
        .then(html => {
            // HTML 파싱하여 새로운 상품 카드들만 추출
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newCards = doc.querySelectorAll('.col-lg-4.col-md-6.mb-4');
            
            if (newCards.length > 0) {
                const productGrid = document.querySelector('.row');
                newCards.forEach(card => {
                    productGrid.appendChild(card);
                });
            }
            
            isLoading = false;
        })
        .catch(error => {
            console.error('Error loading more products:', error);
            isLoading = false;
        });
}

// 스크롤 이벤트 (무한 스크롤 활성화 시)
// window.addEventListener('scroll', function() {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
//         loadMoreProducts();
//     }
// });
