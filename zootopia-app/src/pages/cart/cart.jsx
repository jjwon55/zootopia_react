import React, { useState, useEffect } from 'react';
import { 
  fetchCartItems, 
  updateCartItem, 
  removeCartItem, 
  clearCart 
} from '../../apis/cart';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetchCartItems(1); // 임시로 userId 1 사용
      if (response.success) {
        setCartItems(response.cartItems || []);
      }
    } catch (error) {
      console.error('Failed to load cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setUpdating(true);
    try {
      const response = await updateCartItem(id, newQuantity);
      if (response.success) {
        setCartItems(items =>
          items.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert(response.message || '수량 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      alert('수량 변경에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('이 상품을 장바구니에서 삭제하시겠습니까?')) return;
    
    setUpdating(true);
    try {
      const response = await removeCartItem(id);
      if (response.success) {
        setCartItems(items => items.filter(item => item.id !== id));
      } else {
        alert(response.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const clearAllItems = async () => {
    if (!window.confirm('장바구니를 모두 비우시겠습니까?')) return;
    
    setUpdating(true);
    try {
      const response = await clearCart(1); // 임시로 userId 1 사용
      if (response.success) {
        setCartItems([]);
      } else {
        alert(response.message || '장바구니 비우기에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      alert('장바구니 비우기에 실패했습니다.');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-red-400 mb-4"></i>
          <p>장바구니를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* 브레드크럼 */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-red-400 hover:text-red-500">홈</a>
            <span className="text-gray-400">&gt;</span>
            <a href="/products/listp" className="text-red-400 hover:text-red-500">스토어</a>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-600">장바구니</span>
          </div>
        </nav>

        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-400">
            <i className="fas fa-shopping-cart mr-3"></i>장바구니
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">장바구니가 비어있습니다</h2>
            <p className="text-gray-500 mb-8">원하는 상품을 장바구니에 담아보세요!</p>
            <a 
              href="/products/listp"
              className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-bold transition-colors inline-block"
            >
              <i className="fas fa-store mr-2"></i>쇼핑 계속하기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 장바구니 헤더 */}
            <div className="lg:col-span-2 mb-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold">장바구니 상품 ({getTotalItems()}개)</h2>
                <button
                  onClick={clearAllItems}
                  disabled={updating}
                  className="text-red-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-trash mr-1"></i>전체 삭제
                </button>
              </div>
            </div>

            {/* 장바구니 아이템 */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow ${updating ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl || '/assets/dist/img/products/default.jpg'}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg border"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.productName}</h3>
                        <p className="text-gray-600">{item.price?.toLocaleString()}원</p>
                        {item.category && (
                          <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-1">
                            {item.category}
                          </span>
                        )}
                      </div>
                      
                      {/* 수량 조절 */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="w-8 h-8 rounded-full border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          disabled={updating}
                          className="w-16 text-center border border-gray-300 rounded py-1 disabled:opacity-50"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating}
                          className="w-8 h-8 rounded-full border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>

                      {/* 소계 */}
                      <div className="text-right min-w-[100px]">
                        <p className="font-bold text-lg text-red-400">
                          {((item.price || 0) * item.quantity).toLocaleString()}원
                        </p>
                      </div>

                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-red-400 to-red-500 text-white rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">주문 요약</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>상품 ({getTotalItems()}개)</span>
                    <span>{getTotalPrice().toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>무료</span>
                  </div>
                  <div className="border-t border-white border-opacity-20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>총 결제 금액</span>
                      <span>{getTotalPrice().toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.href = '/checkout'}
                    disabled={updating || cartItems.length === 0}
                    className="w-full bg-white text-red-400 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>처리 중...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-credit-card mr-2"></i>주문하기
                      </>
                    )}
                  </button>
                  <a 
                    href="/products/listp"
                    className="block w-full text-center bg-transparent border-2 border-white text-white font-bold py-3 rounded-lg hover:bg-white hover:text-red-400 transition-colors"
                  >
                    <i className="fas fa-store mr-2"></i>쇼핑 계속하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
