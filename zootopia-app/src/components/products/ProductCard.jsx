import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product.no);
    }
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(product.no);
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      {/* 상품 이미지 */}
      <div style={{ position: 'relative' }}>
        <img
          src={product.imageUrl || '/api/placeholder/320/200'}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTEzNSA4NUwxNjAgMTEwTDE4NSA4NSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHRleHQgeD0iMTYwIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+7IOB7ZKBIOydtOuvuOyngDwvdGV4dD4KPC9zdmc+';
          }}
        />
        {(product.isNew || product.status === 'NEW') && (
          <span className="product-badge">NEW</span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="product-info">
        {/* 배송 정보 */}
        <span className="product-shipping-badge">무료배송</span>

        {/* 상품명 */}
        <h3 className="product-title">{product.name || '상품명'}</h3>

        {/* 상품 설명 */}
        <p className="product-description">
          {product.description || '새들이 좋아하는 영양가 높은 사료입니다. 건강한 털과 활발한 활동을 도와줍니다.'}
        </p>

        {/* 평점 및 통계 */}
        <div className="product-stats">
          <span className="product-stat">
            <span>👁️</span>
            <span>{product.views || 50}</span>
          </span>
          <span className="product-stat">
            <span>👍</span>
            <span>{product.likes || 5}</span>
          </span>
          <span className="product-stat">
            <span>⭐</span>
            <span>{product.favorites || 10}</span>
          </span>
        </div>

        {/* 가격 및 액션 버튼 */}
        <div className="product-footer">
          <div className="product-price">
            <div className="product-price-main">
              {(product.price || 25000).toLocaleString()}원
            </div>
            <div className="product-price-vat">VAT 포함</div>
          </div>

          <div className="product-actions">
            <button className="product-action-btn" title="좋아요">
              ❤️
            </button>
            <button className="product-action-btn" title="장바구니">
              📋
            </button>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        <button 
          className="detail-button"
          onClick={handleDetailClick}
        >
          상세보기
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
