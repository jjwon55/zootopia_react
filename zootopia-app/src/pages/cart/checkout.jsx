import React, { useEffect, useRef, useState } from 'react';
import { KakaoPay } from '../../apis/products/payments/kakao';
import { useLoginContext } from '../../context/LoginContextProvider';
import fallbackImg from '../../assets/react.svg';

export default function Checkout() {
  const { userInfo } = useLoginContext();
  const userId = userInfo?.userId || 1;
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    message: ''
  });
  const detailAddressRef = useRef(null);

  // 결제 동의 상태
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,     // 이용약관 [필수]
    privacy: false,   // 개인정보 처리방침 [필수]
    pg: false,        // 결제대행 서비스 약관 [필수]
    marketing: false  // 마케팅 정보 수신 [선택]
  });

  const requiredAgreed = agreements.terms && agreements.privacy && agreements.pg;
  const canPay = orderItems.length > 0 && requiredAgreed;

  useEffect(() => {
    // 1) 바로구매 데이터가 있으면 우선 사용
    try {
      const temp = localStorage.getItem('tempOrder');
      if (temp) {
        const parsed = JSON.parse(temp);
        const items = (parsed.items || []).map((it, idx) => ({
          id: it.productId || idx + 1,
          name: it.productName || it.name,
          price: it.price,
          quantity: it.quantity,
          imageUrl: it.imageUrl || it.image
        }));
        setOrderItems(items);
        return;
      }
    } catch {}

    // 2) 장바구니(localStorage)에서 불러오기 (로그인 사용자 기반 키)
    try {
      const raw = localStorage.getItem(`cart:user:${userId}`);
      const cart = raw ? JSON.parse(raw) : [];
      const items = cart.map((it) => ({
        id: it.productId || it.id,
        name: it.productName || it.name,
        price: it.price,
        quantity: it.quantity,
        imageUrl: it.imageUrl || it.image
      }));
      setOrderItems(items);
    } catch {
      setOrderItems([]);
    }
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

  // 카카오(다음) 우편번호 스크립트 로더
  const loadDaumPostcodeScript = () => {
    return new Promise((resolve, reject) => {
      if (window.daum && window.daum.Postcode) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[data-daum-postcode]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-daum-postcode', 'true');
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  };

  const handleSearchAddress = async () => {
    try {
      await loadDaumPostcodeScript();
      // eslint-disable-next-line no-undef
      new window.daum.Postcode({
        oncomplete: (data) => {
          const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          setShippingInfo(prev => ({
            ...prev,
            zipcode: data.zonecode || '',
            address: addr || ''
          }));
          setTimeout(() => {
            detailAddressRef.current?.focus();
          }, 0);
        }
      }).open();
    } catch (e) {
      alert('주소 검색 스크립트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 결제 동의 토글
  const toggleAllAgreements = () => {
    const next = !agreements.all;
    setAgreements({ all: next, terms: next, privacy: next, pg: next, marketing: next });
  };
  const toggleAgreement = (key) => {
    setAgreements(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const allRequired = next.terms && next.privacy && next.pg;
      const allChecked = allRequired && next.marketing; // 전체는 선택 포함 전부 체크 시
      return { ...next, all: allChecked };
    });
  };

  const handleSubmit = async (e) => {
    // 양식 제출/버튼 클릭 모두 대응
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!canPay) {
      alert('필수 약관 동의와 주문 정보 확인 후 결제할 수 있습니다.');
      return;
    }

    if (paymentMethod === 'kakao') {
      // 카카오페이 플로우 (데모 모드에서 실제 결제 없음)
      const amount = getTotalPrice();
      const orderId = 'ORDER_' + Date.now();
      const orderName = orderItems.map((i) => i.name).slice(0, 1).join(', ');
      try {
        setIsProcessing(true);
        const readyRes = await KakaoPay.ready({ amount, orderId, orderName, items: orderItems });
        sessionStorage.setItem('kakao:tid', readyRes.tid);
        sessionStorage.setItem('kakao:orderId', orderId);
  sessionStorage.setItem('kakao:returnUrl', window.location.origin + '/kakao-pay-mock');
  sessionStorage.setItem('kakao:userId', String(userId));
        window.location.href = readyRes.next_redirect_pc_url; // 데모: 내부 모의 결제 페이지로 이동
      } catch (err) {
        console.error(err);
        alert('결제 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // 그 외 결제수단: 처리 로딩 모사 후, 수단별 메시지
    try {
      setIsProcessing(true);
      await new Promise((res) => setTimeout(res, 800));
      const methodMsgMap = {
        card: '결제가 완료 되었습니다.',
        bank: '결제가 완료 되었습니다.',
        phone: '결제가 완료 되었습니다.',
      };
      alert(methodMsgMap[paymentMethod] || '결제가 완료 되었습니다.');
      // 결제 완료 후 스토어 목록으로 이동
      window.location.href = '/products/listp';
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 relative" style={{ backgroundColor: '#FFF6F6' }}>
      {/* 결제 처리 로딩 오버레이 */}
      {isProcessing && (
        <div className="fixed inset-0 z-[1200] bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#FFC2C2] border-t-transparent rounded-full animate-spin" />
            <div className="text-gray-700 text-sm">결제 처리 중입니다...</div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* 브레드크럼 */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-[#FF9999] hover:text-[#FF7A7A]">홈</a>
            <span className="text-gray-400">&gt;</span>
            <a href="/products/listp" className="text-[#FF9999] hover:text-[#FF7A7A]">스토어</a>
            <span className="text-gray-400">&gt;</span>
            <a href="/cart" className="text-pink-400 hover:text-pink-500">장바구니</a>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-600">결제</span>
          </div>
        </nav>

        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FF9999] flex items-center gap-2">
            <span>🧾</span>
            주문/결제
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 결제 정보 입력 */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 주문 상품 확인 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border" style={{ borderColor: '#FFE5E5' }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
                  <span>👜</span> 주문 상품 확인
                </h2>
                <div className="space-y-4">
      {orderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <img
        src={item.imageUrl || item.image || fallbackImg}
        alt={item.name}
                        className="w-16 h-16 object-cover rounded border"
        onError={(e) => { e.currentTarget.src = fallbackImg; }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600 text-sm">수량: {item.quantity}개</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-500">
                          {(item.price * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 배송 정보 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border" style={{ borderColor: '#FFE5E5' }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
                  <span>🚚</span> 배송 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">받는 분</label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                      required
                    />
                  </div>
      <div className="md:col-span-2 grid grid-cols-[1fr_auto] gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">우편번호</label>
                      <input
                        type="text"
                        value={shippingInfo.zipcode}
                        onChange={(e) => handleInputChange('zipcode', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="우편번호"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        className="h-[42px] px-4 rounded-lg text-white"
        style={{ backgroundColor: '#FF9999' }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FF8C8C')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF9999')}
        onClick={handleSearchAddress}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9999] mb-2"
                      placeholder="기본 주소"
                      required
                    />
                    <input
                      type="text"
                      value={shippingInfo.detailAddress}
                      onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                      placeholder="상세 주소"
                      ref={detailAddressRef}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">배송 메모</label>
                    <select
                      value={shippingInfo.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                    >
                      <option value="">배송 메모를 선택하세요</option>
                      <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
                      <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                      <option value="배송 전 연락 부탁드립니다">배송 전 연락 부탁드립니다</option>
                      <option value="파손 주의 부탁드립니다">파손 주의 부탁드립니다</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 결제 방법 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border" style={{ borderColor: '#FFE5E5' }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
                  <span>💳</span> 결제 방법
                </h2>
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
                          ? 'bg-[#FFF0F0]'
                          : 'border-gray-200 hover:bg-[#FFECEC]'
                      }`}
                      style={paymentMethod === method.id ? { borderColor: '#FF9999' } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="focus:ring-[#FF9999]"
                          style={{ accentColor: '#FF9999' }}
                        />
                        <i className={`${method.icon}`} style={{ color: '#FF9999' }}></i>
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 결제 동의 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
                  <span>✅</span> 결제 동의
                </h2>
                <div className="space-y-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="focus:ring-[#FF9999]"
                      style={{ accentColor: '#FF9999' }}
                      checked={agreements.all}
                      onChange={toggleAllAgreements}
                    />
                    <span className="font-medium">전체 약관에 동의합니다</span>
                  </label>
                  <div className="pl-6 space-y-2 text-gray-700">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="focus:ring-[#FF9999]"
                        style={{ accentColor: '#FF9999' }}
                        checked={agreements.terms}
                        onChange={() => toggleAgreement('terms')}
                      />
                      [필수] 이용약관 동의
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="focus:ring-[#FF9999]"
                        style={{ accentColor: '#FF9999' }}
                        checked={agreements.privacy}
                        onChange={() => toggleAgreement('privacy')}
                      />
                      [필수] 개인정보 처리방침 동의
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="focus:ring-[#FF9999]"
                        style={{ accentColor: '#FF9999' }}
                        checked={agreements.pg}
                        onChange={() => toggleAgreement('pg')}
                      />
                      [필수] 결제대행 서비스 약관 동의
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="focus:ring-[#FF9999]"
                        style={{ accentColor: '#FF9999' }}
                        checked={agreements.marketing}
                        onChange={() => toggleAgreement('marketing')}
                      />
                      [선택] 마케팅 정보 수신 동의
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="text-white rounded-lg p-6 sticky top-20 bg-gradient-to-br" style={{ backgroundImage: 'linear-gradient(135deg, #FF9999, #FF8C8C)' }}>
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
                disabled={!canPay}
                className={`w-full font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  canPay ? 'bg-white hover:bg-gray-100' : 'bg-white/50 text-white/80 cursor-not-allowed'
                }`}
                style={canPay ? { color: '#B44444' } : {}}
              >
                <span>💳</span>
                <span>{getTotalPrice().toLocaleString()}원 결제하기</span>
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = '/cart')}
                className="w-full mt-3 bg-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/25 transition-colors"
              >
                ← 장바구니로 돌아가기
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
