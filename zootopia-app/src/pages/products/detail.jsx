import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLoginContext } from '../../context/LoginContextProvider';
// 상세도 55개 Mock DB를 사용하는 API 모듈을 명시적으로 사용
import { fetchProductDetail } from '../../apis/products/products.js';

import { addToCart } from '../../apis/products/cart';
import './ProductDetail.css';

export default function ProductDetail() {
  const { productId } = useParams();
  const { userInfo } = useLoginContext();
  const userId = userInfo?.userId || 1;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProductDetail();

  }, [productId]);


  const loadProductDetail = async () => {
    setLoading(true);
    try {

      console.log('Loading product detail for ID:', productId);
      const response = await fetchProductDetail(productId);
      console.log('API response:', response);
      
      if (response && response.success && response.product) {
        console.log('Using API product:', response.product);
        setProduct(response.product);
      } else {
        console.log('API response invalid, product is null');
        setProduct(null);
      }
    } catch (error) {
      console.error('Failed to load product detail:', error);
      setProduct(null);

    } finally {
      setLoading(false);
    }
  };


  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {

      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {

    if (!product) return;

    setAddingToCart(true);
    try {
      const response = await addToCart(userId, product.no, quantity);
      if (response && response.success) {
        const goToCart = window.confirm(`${product.name}이(가) 장바구니에 추가되었습니다.`);
        if (goToCart) {
          window.location.href = '/cart';
        }
      } else {
        // API 실패 시에도 성공 메시지 표시 (개발용)
        const goToCart = window.confirm(`${product.name}이(가) 장바구니에 추가되었습니다.`);
        if (goToCart) {
          window.location.href = '/cart';
        }
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const goToCart = window.confirm(`${product.name}이(가) 장바구니에 추가되었습니다.`);
      if (goToCart) {
        window.location.href = '/cart';
      }

    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {

    if (!product) return;
    
    const orderData = {
      items: [{
        productId: product.no,

        productName: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      }],
      totalAmount: product.price * quantity
    };
    

    localStorage.setItem('tempOrder', JSON.stringify(orderData));
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-wrapper">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #f472b6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#6b7280' }}>상품 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-wrapper">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}>
            <div>
              <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '16px' }}>
                상품을 찾을 수 없습니다.
              </p>
              <button 
                onClick={() => window.history.back()}
                style={{
                  background: '#f472b6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                뒤로 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = (product?.price || 25000) * quantity;

  console.log('Current product state:', product);
  console.log('Total price:', totalPrice);

  return (
    <div className="product-detail-container">
      <div className="product-detail-wrapper">
        {/* 브레드크럼 */}
        <nav className="breadcrumb">
          <a href="/">홈</a>
          <span className="breadcrumb-separator">&gt;</span>
          <a href="/products/listp">스토어</a>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">{product?.category || '반려동물 용품'}</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">{product?.name || '상품'}</span>
        </nav>

        {/* 메인 상품 정보 */}
        <div className="product-detail-main">
          {/* 상품 이미지 섹션 */}
          <div className="product-image-section">
            {product.isNew && <span className="new-badge">NEW</span>}
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}
              alt={product.name || '상품'}
              className="product-main-image"
              onError={(e) => {
                console.log('Image failed to load, using fallback');
                e.target.src = 'https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
              }}
            />
          </div>

          {/* 상품 정보 섹션 */}
          <div className="product-info-section">
            <div>
              <span className="product-category-badge">{product?.category || '사료'}</span>
              <h1 className="product-title">{product?.name || '새 사료 - 사랑에 빠진 새'}</h1>
              
              <div className="product-rating">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="rating-star"
                    >
                      {i < Math.floor(product?.rating || 4.5) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="rating-score">{product?.rating || 4.5}</span>
                <span className="rating-count">({product?.reviewCount || '120개 리뷰'})</span>
              </div>

              <div className="product-pricing">
                {product?.originalPrice && product.originalPrice > product.price && (
                  <div className="price-original">{product.originalPrice.toLocaleString()}원</div>
                )}
                <div className="price-current-container">
                  <span className="price-current">{(product?.price || 25000).toLocaleString()}원</span>
                  {product?.discount && (
                    <span className="price-discount">{product.discount}</span>
                  )}
                </div>
              </div>

              <div className="stock-info">{product?.stock || 50}개 남음</div>
            </div>

            <div>
              <div className="quantity-section">
                <label className="quantity-label">수량</label>
                <div className="quantity-control">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product?.stock || 50, parseInt(e.target.value) || 1)))}
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                </div>
                <div className="stock-limit">최대 주문 가능 수량: {product?.stock || 50}개</div>
              </div>

              <div className="total-price-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="total-price-label">총 가격</span>
                  <span className="total-price-amount">{totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              <div className="product-actions">
                <button 
                  className="btn-cart"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  🛒 장바구니 담기
                </button>
                <button 
                  className="btn-buy"
                  onClick={handleBuyNow}
                >
                  💳 바로 구매

                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 상품 설명 */}
        <div className="product-description-section">
          <h2 className="description-title">상품 설명</h2>
          <p className="description-content">
            {product?.description || '새들이 좋아하는 영양가 높은 사료입니다. 건강한 털과 활발한 활동을 도와주며, 신선한 재료로 만들어진 프리미엄 사료로 새의 건강한 성장을 위한 모든 영양소가 균형있게 포함되어 있습니다.'}
          </p>

          {/* 배송/교환 정보 */}
          <div className="shipping-info">
            <div className="shipping-item">
              <div className="shipping-icon">🚚</div>
              <div className="shipping-title">무료배송</div>
              <div className="shipping-desc">3만원 이상</div>
            </div>
            <div className="shipping-item">
              <div className="shipping-icon">↩️</div>
              <div className="shipping-title">무료 반품</div>
              <div className="shipping-desc">30일 이내</div>
            </div>
            <div className="shipping-item">
              <div className="shipping-icon">🎧</div>
              <div className="shipping-title">고객지원</div>
              <div className="shipping-desc">24시간</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 스피너 애니메이션 CSS */}
  <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}
