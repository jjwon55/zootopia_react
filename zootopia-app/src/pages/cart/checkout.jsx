import React, { useState, useEffect } from 'react';

export default function Checkout() {
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    message: ''
  });

  // Mock 주문 데이터 (추후 API 연동)
  const mockOrderItems = [
    {
      id: 1,
      name: '강아지 사료',
      price: 25000,
      quantity: 2,
      image: '/assets/dist/img/products/dogfood.jpg'
    },
    {
      id: 2,
      name: '고양이 장난감',
      price: 12000,
      quantity: 1,
      image: '/assets/dist/img/products/cattoy.jpg'
    }
  ];

  useEffect(() => {
    setOrderItems(mockOrderItems);
  }, []);

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 결제 처리 로직
    alert('주문이 완료되었습니다!');
  };

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
            <a href="/cart" className="text-red-400 hover:text-red-500">장바구니</a>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-600">결제</span>
          </div>
        </nav>

        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-400">
            <i className="fas fa-credit-card mr-3"></i>주문/결제
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 결제 정보 입력 */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 주문 상품 확인 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">주문 상품 확인</h2>
                <div className="space-y-4">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64'; }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600 text-sm">수량: {item.quantity}개</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-400">
                          {(item.price * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 배송 정보 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">배송 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">받는 분</label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
                      placeholder="기본 주소"
                      required
                    />
                    <input
                      type="text"
                      value={shippingInfo.detailAddress}
                      onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      placeholder="상세 주소"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">배송 메시지</label>
                    <textarea
                      value={shippingInfo.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      rows="3"
                      placeholder="배송 시 요청사항을 입력해주세요"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* 결제 방법 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">결제 방법</h2>
                <div className="space-y-3">
                  {[
                    { id: 'card', name: '신용카드/체크카드', icon: 'fas fa-credit-card' },
                    { id: 'bank', name: '계좌이체', icon: 'fas fa-university' },
                    { id: 'phone', name: '휴대폰결제', icon: 'fas fa-mobile-alt' },
                    { id: 'kakao', name: '카카오페이', icon: 'fas fa-comment' }
                  ].map(method => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="text-red-400 focus:ring-red-400"
                        />
                        <i className={`${method.icon} text-red-400`}></i>
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
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
                <div className="flex justify-between text-sm">
                  <span>할인</span>
                  <span>-0원</span>
                </div>
                <div className="border-t border-white border-opacity-20 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>최종 결제 금액</span>
                    <span>{getTotalPrice().toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-white text-red-400 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-credit-card mr-2"></i>
                {getTotalPrice().toLocaleString()}원 결제하기
              </button>

              <div className="mt-4 text-xs text-center opacity-80">
                <i className="fas fa-shield-alt mr-1"></i>
                안전한 결제를 위해 SSL 보안을 적용하고 있습니다
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
