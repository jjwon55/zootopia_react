import React, { useState, useEffect } from 'react';
import { useLoginContext } from '../../context/LoginContextProvider';
import { 
  fetchCartItems, 
  updateCartItem, 
  removeCartItem, 
  clearCart 

} from '../../apis/products/cart';
import './Cart.css';

// 오버레이에서 이미지 보정
const readOverlay = () => {
  try { return JSON.parse(localStorage.getItem('customProductsOverlay') || '[]'); } catch { return []; }
};
const getOverlayImage = (id) => {
  const overlay = readOverlay();
  const found = overlay.find(p => String(p.no) === String(id));
  return found?.imageUrl || '';
};


export default function Cart() {
  const { userInfo } = useLoginContext();
  const userId = userInfo?.userId || 1;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadCartItems();
    // 로그인 사용자가 바뀌면 장바구니 다시 로드
  }, [userId]);

  const syncLocal = (items) => {
    try {
      localStorage.setItem(`cart:user:${userId}`, JSON.stringify(items || []));
    } catch {}
  };

  const loadCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetchCartItems(userId);
      if (response.success) {
        const items = response.cartItems || [];
        setCartItems(items);
        syncLocal(items);
      } else {
        // 실패 시 더미 데이터 주입 대신 비워서 사용자 혼란 방지
        setCartItems([]);
        syncLocal([]);
      }
    } catch (error) {
      console.error('Failed to load cart items:', error);
  // 실패 시 더미 데이터 주입 대신 비워서 사용자 혼란 방지
  setCartItems([]);
  syncLocal([]);

    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setUpdating(true);
    try {
      const response = await updateCartItem(userId, id, newQuantity);

      if (response.success || true) { // Mock으로 항상 성공 처리
        setCartItems(items => {
          const next = items.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          );
          syncLocal(next);
          return next;
        });

      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      // Mock으로 수량 변경
      setCartItems(items => {
        const next = items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        syncLocal(next);
        return next;
      });

    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (id) => {

    setUpdating(true);
    try {
      const response = await removeCartItem(userId, id);
      if (response.success || true) { // Mock으로 항상 성공 처리
        setCartItems(items => {
          const next = items.filter(item => item.id !== id);
          syncLocal(next);
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      // Mock으로 삭제
      setCartItems(items => {
        const next = items.filter(item => item.id !== id);
        syncLocal(next);
        return next;
      });

    } finally {
      setUpdating(false);
    }
  };

  const clearAllItems = async () => {

    setUpdating(true);
    try {
  const response = await clearCart(userId);
      if (response.success || true) { // Mock으로 항상 성공 처리
        setCartItems([]);
        syncLocal([]);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setCartItems([]);

    } finally {
      setUpdating(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (

      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>장바구니를 불러오는 중...</p>

      </div>
    );
  }

  return (

    <div className="cart-container">
      <div className="cart-wrapper">
        {/* 브레드크럼 */}
        <nav className="breadcrumb">
          <a href="/">홈</a>
          <span>/</span>
          <a href="/products/listp">스토어</a>
          <span>/</span>
          <span className="current">장바구니</span>
        </nav>

        {/* 페이지 제목 */}
        <div className="cart-header">
          <h1 className="cart-title">
            <span className="cart-icon">🛒</span>장바구니
            <span className="cart-count">{getTotalItems()}</span>

          </h1>
        </div>

        {cartItems.length === 0 ? (

          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>장바구니가 비어있습니다</h2>
            <p>원하는 상품을 장바구니에 담아보세요!</p>
            <a href="/products/listp" className="continue-shopping-btn">
              쇼핑 계속하기
            </a>
          </div>
        ) : (
          <div className="cart-content">
            {/* 장바구니 아이템 */}
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.imageUrl || getOverlayImage(item.productId || item.id) || '/src/assets/img/products/foodcatfishtaste.png'}
                      alt={item.productName}
                      onError={(e) => { 
                        e.target.src = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'; 
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.productName}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">{item.price?.toLocaleString()}원</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn minus"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="quantity-input"
                      min="1"
                      disabled={updating}
                    />
                    <button
                      className="quantity-btn plus"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    {((item.price || 0) * item.quantity).toLocaleString()}원
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    disabled={updating}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <div className="continue-shopping">
                <button onClick={() => window.location.href = '/products/listp'} className="back-btn">
                  ← 쇼핑 계속하기
                </button>

              </div>
            </div>

            {/* 주문 요약 */}

            <div className="order-summary">
              <div className="summary-header">
                <h2>주문 요약</h2>
              </div>
              <div className="summary-content">
                <div className="summary-row">
                  <span>상품 금액</span>
                  <span>{getTotalPrice().toLocaleString()}원</span>
                </div>
                <div className="summary-row">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div className="summary-total">
                  <span>총 결제 금액</span>
                  <span className="total-amount">{getTotalPrice().toLocaleString()}원</span>
                </div>
                <button
                  className="checkout-btn"
                  // 장바구니에서 일반 결제 진입
                  onClick={() => window.location.href = '/checkout?from=cart'}
                  disabled={updating || cartItems.length === 0}
                >
                  <span className="checkout-icon">💳</span>
                  주문하기
                </button>
                {/* Toss 결제(샌드박스) 버튼 제거 요청으로 삭제됨 */}
                <button
                  className="clear-cart-btn"
                  onClick={clearAllItems}
                  disabled={updating}
                >
                  🗑️ 장바구니 비우기
                </button>
                <p className="free-shipping-notice">
                  ℹ️ 30,000원 이상 구매 시 무료배송
                </p>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
