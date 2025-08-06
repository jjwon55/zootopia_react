// Product Form JavaScript

// 이미지 미리보기 함수
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="미리보기">`;
            preview.classList.add('has-image');
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        // 파일이 선택되지 않은 경우 기본 상태로 복원
        preview.innerHTML = `
            <i class="fas fa-image"></i>
            <p>이미지를 선택하세요</p>
        `;
        preview.classList.remove('has-image');
    }
}

// 가격 입력 필드 포맷팅 및 기능 초기화
document.addEventListener('DOMContentLoaded', function() {
    const priceInput = document.getElementById('price');
    
    if (priceInput) {
        // 가격 입력 시 실시간 포맷팅 (숫자만 허용)
        priceInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, ''); // 숫자만 허용
            if (value) {
                e.target.value = parseInt(value);
            }
        });
        
        // 키보드 단축키 (Ctrl + Up/Down으로 1000원씩 증감)
        priceInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();
                let currentValue = parseInt(e.target.value) || 0;
                if (e.key === 'ArrowUp') {
                    e.target.value = Math.min(currentValue + 1000, 99999999);
                } else {
                    e.target.value = Math.max(currentValue - 1000, 0);
                }
            }
        });
        
        // 포커스 아웃 시에도 값 유지 (콤마 포맷팅 제거)
        priceInput.addEventListener('blur', function(e) {
            // 값이 있으면 그대로 유지, 빈 값이면 0으로 설정
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value) {
                e.target.value = parseInt(value);
            } else {
                e.target.value = 0;
            }
        });
    }
    
    // 드래그 앤 드롭 이벤트 추가
    const imageUploadContainer = document.querySelector('.image-upload-container');
    const imageFile = document.getElementById('imageFile');
    
    if (imageUploadContainer && imageFile) {
        // 드래그 오버 이벤트
        imageUploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ff7b7b';
            this.style.backgroundColor = '#fff5f5';
        });
        
        // 드래그 리브 이벤트
        imageUploadContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '#fafafa';
        });
        
        // 드롭 이벤트
        imageUploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '#fafafa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                imageFile.files = files;
                previewImage(imageFile);
            }
        });
    }
});

// 폼 유효성 검사
function validateForm() {
    let isValid = true;
    
    // 이전 에러 메시지 제거
    const errorMessages = document.querySelectorAll('.invalid-feedback');
    errorMessages.forEach(msg => msg.remove());
    
    const invalidInputs = document.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => input.classList.remove('is-invalid'));
    
    // 상품명 검사
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showError(name, '상품명을 입력하세요.');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, '상품명은 2자 이상 입력하세요.');
        isValid = false;
    }
    
    // 제품 설명 검사
    const description = document.getElementById('description');
    if (!description.value.trim()) {
        showError(description, '제품 설명을 입력하세요.');
        isValid = false;
    } else if (description.value.trim().length < 10) {
        showError(description, '제품 설명은 10자 이상 입력하세요.');
        isValid = false;
    }
    
    // 가격 검사
    const price = document.getElementById('price');
    if (!price.value || price.value <= 0) {
        showError(price, '올바른 가격을 입력하세요.');
        isValid = false;
    } else if (price.value > 99999999) {
        showError(price, '가격이 너무 높습니다.');
        isValid = false;
    }
    
    // 카테고리 검사
    const category = document.getElementById('category');
    if (!category.value) {
        showError(category, '카테고리를 선택하세요.');
        isValid = false;
    }
    
    // 재고 검사
    const stock = document.getElementById('stock');
    if (!stock.value || stock.value < 0) {
        showError(stock, '올바른 재고 수량을 입력하세요.');
        isValid = false;
    }
    
    // 이미지 파일 검사 (선택사항)
    const imageFile = document.getElementById('imageFile');
    if (imageFile.files.length > 0) {
        const file = imageFile.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (file.size > maxSize) {
            showError(imageFile, '이미지 파일 크기는 5MB 이하여야 합니다.');
            isValid = false;
        }
        
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showError(imageFile, '지원되는 이미지 형식: JPEG, PNG, GIF');
            isValid = false;
        }
    }
    
    if (!isValid) {
        // 첫 번째 에러 필드로 스크롤
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

// 에러 메시지 표시
function showError(element, message) {
    element.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    element.parentNode.appendChild(errorDiv);
}

// 숫자 입력 포맷팅
function formatNumber(input) {
    // 숫자가 아닌 문자 제거
    let value = input.value.replace(/[^0-9]/g, '');
    
    // 3자리마다 콤마 추가
    if (value) {
        value = parseInt(value).toLocaleString();
    }
    
    input.value = value;
}

// 폼 제출 전 처리
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.classList.contains('product-form')) {
        // 가격 필드가 숫자로 올바르게 설정되어 있는지 확인
        const priceInput = document.getElementById('price');
        if (priceInput) {
            let value = priceInput.value.replace(/[^\d]/g, '');
            priceInput.value = value || '0';
        }
    }
});

// 취소 확인
function confirmCancel() {
    const hasChanges = checkFormChanges();
    if (hasChanges) {
        if (confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
            window.history.back();
        }
    } else {
        window.history.back();
    }
}

// 폼 변경사항 확인
function checkFormChanges() {
    const inputs = document.querySelectorAll('input, textarea, select');
    for (let input of inputs) {
        if (input.type === 'file') {
            if (input.files.length > 0) return true;
        } else if (input.value.trim() !== '') {
            return true;
        }
    }
    return false;
}
