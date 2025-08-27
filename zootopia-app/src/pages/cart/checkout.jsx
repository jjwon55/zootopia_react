import React, { useEffect, useRef, useState } from 'react';
// Toss 연동: 환경변수 VITE_TOSS_CLIENT_KEY 가 설정되어 있지 않으면 테스트 키 사용
// Toss widget helper (handles v1/v2 script loading & request)
import {
  createPaymentWidget,
  initPaymentMethods,
  requestTossPayment,
  setAmount as tossSetAmount,
} from '../../apis/products/payments/toss';
// import { KakaoPay } from '../../apis/products/payments/kakao';
import api from '../../apis/api';
import { clearCart as clearLocalOrApiCart } from '../../apis/products/cart';
import { useLoginContext } from '../../context/LoginContextProvider';
import fallbackImg from '../../assets/react.svg';
import OrderCompleteModal from '../../components/common/OrderCompleteModal';
import KakaoLoginModal from '../../components/common/KakaoLoginModal';

export default function Checkout() {
  // 카카오 로그인 상태 (모달/로그인 여부)
  const [kakaoLogin, setKakaoLogin] = useState({ loggedIn: false, user: null, modal: false });
  const { userInfo } = useLoginContext();
  const userId = userInfo?.userId || 1;
  const [orderItems, setOrderItems] = useState([]);
  // URL 파라미터(pm=toss)로 Toss 선선택 허용
  const initialPM = (() => {
    try {
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const pm = new URLSearchParams(search).get('pm');
      return pm === 'toss' ? 'toss' : 'card';
    } catch {
      return 'card';
    }
  })();
  const [paymentMethod, setPaymentMethod] = useState(initialPM); // card | bank | phone | toss
  const tossWidgetRef = useRef(null); // (미사용 예정) 컨테이너 접근용 참조
  const tossInstanceRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tossLoading, setTossLoading] = useState(false); // Toss 위젯 로딩 상태
  const [tossError, setTossError] = useState(null); // Toss 위젯 오류 메시지
  const [tossReady, setTossReady] = useState(false);     // ★ 위젯/약관 렌더 완료 여부
  const [orderModal, setOrderModal] = useState({ open: false, code: '' });
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    message: '',
  });
  const detailAddressRef = useRef(null);

  // crypto.randomUUID 폴리필
  function generateUUID() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    const buf = new Uint8Array(16);
    window.crypto.getRandomValues(buf);
    // UUID v4 포맷
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const toHex = (n) => n.toString(16).padStart(2, '0');
    const hex = [...buf].map(toHex).join('');
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20),
    ].join('-');
  }

  // 결제 동의 상태 (Toss는 자체 약관 위젯을 제공하므로 로컬 동의는 제외)
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    pg: false,
    marketing: false,
  });
  // Toss 선택 시 로컬 동의는 요구하지 않음
  const requiredAgreed = paymentMethod === 'toss' ? true : agreements.terms && agreements.privacy && agreements.pg;
  const canPay = orderItems.length > 0 && requiredAgreed;

  // Toss 위젯 자동 초기화 & 금액 갱신 (★ 클릭 이전에 모두 준비)
  useEffect(() => {
    if (paymentMethod !== 'toss') return;
    if (!orderItems.length) return;
    let cancelled = false;

    async function init() {
      setTossError(null);
      setTossLoading(true);
      setTossReady(false);
      try {
        const total = getTotalPrice();
        const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error('VITE_TOSS_CLIENT_KEY is not set. Please add a test_gck_... key in .env');
        }

        const needsRecreate = !tossInstanceRef.current || tossInstanceRef.current.__mock === true;
        if (needsRecreate) {
          const widget = await createPaymentWidget(clientKey, undefined, { force: true });
          if (cancelled) return;
          tossInstanceRef.current = widget;
          // 결제수단 영역 렌더
          await initPaymentMethods(widget, '#toss-payment-methods', total);
          // 약관 영역 렌더 (토스 약관 사용)
          try {
            await widget.renderAgreement?.({ selector: '#toss-agreement', variantKey: 'AGREEMENT' });
          } catch {}
        } else {
          // 금액만 업데이트
          try {
            await tossSetAmount(tossInstanceRef.current, total);
          } catch {}
        }
        setTossReady(true); // 클릭 시 바로 결제 가능
      } catch (e) {
        if (!cancelled) {
          console.error('Toss 위젯 초기화 실패', e);
          setTossError(e?.message || '위젯 초기화 실패');
        }
      } finally {
        if (!cancelled) setTossLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, orderItems]);

  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const params = new URLSearchParams(search);
    const fromCart = params.get('from') === 'cart';

    if (!fromCart) {
      // 1) 바로구매 임시 데이터 우선
      try {
        const temp = localStorage.getItem('tempOrder');
        if (temp) {
          const parsed = JSON.parse(temp);
          const items = (parsed.items || []).map((it, idx) => ({
            id: it.productId || idx + 1,
            name: it.productName || it.name,
            price: it.price,
            quantity: it.quantity,
            imageUrl: it.imageUrl || it.image,
          }));
          setOrderItems(items);
          return; // tempOrder 사용 시 장바구니 무시
        }
      } catch {}
    } else {
      // cart 경로에서 온 경우 tempOrder 무시 & 제거
      try {
        localStorage.removeItem('tempOrder');
      } catch {}
    }
    // 2) 장바구니(localStorage)
    try {
      const raw = localStorage.getItem(`cart:user:${userId}`);
      const cart = raw ? JSON.parse(raw) : [];
      const items = cart.map((it) => ({
        id: it.productId || it.id,
        name: it.productName || it.name,
        price: it.price,
        quantity: it.quantity,
        imageUrl: it.imageUrl || it.image,
      }));
      setOrderItems(items);
    } catch {
      setOrderItems([]);
    }
  }, [userId]);

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
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
          setShippingInfo((prev) => ({
            ...prev,
            zipcode: data.zonecode || '',
            address: addr || '',
          }));
          setTimeout(() => {
            detailAddressRef.current?.focus();
          }, 0);
        },
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
    setAgreements((prev) => {
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

    const newOrderId = 'ORD-' + generateUUID();

    // 카카오 결제 분기(로그인/모달 유지, 결제만 미사용)
    if (paymentMethod === 'kakao') {
      if (!kakaoLogin.loggedIn) {
        setKakaoLogin((prev) => ({ ...prev, modal: true }));
        return;
      }
      alert('카카오페이 결제는 현재 지원하지 않습니다.');
      return;
    }

    // Toss 결제: 페이지 내 위젯으로 직접 결제 (★ 클릭 제스처 보존)
    if (paymentMethod === 'toss') {
      if (!tossInstanceRef.current || !tossReady) {
        alert('결제 위젯을 준비 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      // (선택) 주문 요약 로컬 저장
      try {
        const summary = {
          orderCode: newOrderId,
          userId,
          items: orderItems.map((it) => ({
            id: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            imageUrl: it.imageUrl || it.image || null,
          })),
          shipping: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            zipcode: shippingInfo.zipcode,
            address: shippingInfo.address,
            detailAddress: shippingInfo.detailAddress,
            message: shippingInfo.message,
          },
          amount: getTotalPrice(),
          createdAt: Date.now(),
          source: 'checkout-toss',
        };
        localStorage.setItem('zootopia:lastOrder', JSON.stringify(summary));
      } catch {}
      const origin = window.location.origin; // 예: http://192.168.30.3:5173
      await requestTossPayment(tossInstanceRef.current, {
        orderId: newOrderId,
        orderName: orderItems[0]?.name || '주문상품',
        amount: getTotalPrice(),
        successUrl: `${origin}/pay/toss/success`,
        failUrl: `${origin}/pay/toss/fail`,
        preferWidget: true,
      });
      return;
    }

    // 그 외 결제수단(card/bank/phone): 처리 로딩 모사 후, 주문 생성 + 모달
    try {
      setIsProcessing(true);
      await new Promise((res) => setTimeout(res, 800));
      const orderId = newOrderId;
      // 백엔드 주문 생성
      try {
        await api.post('/orders', {
          orderCode: orderId,
          userId,
          productId: orderItems[0]?.id || 0,
          productName: orderItems[0]?.name || '주문상품',
          price: getTotalPrice(),
          status: '결제완료',
        });
      } catch (err) {
        console.warn('주문 생성 실패(일반 결제):', err);
      }
      // 주문 요약(주문 상세 내역 표기를 위한 로컬 저장)
      try {
        const summary = {
          orderCode: orderId,
          userId,
          items: orderItems.map((it) => ({
            id: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            imageUrl: it.imageUrl || it.image || null,
          })),
          shipping: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            zipcode: shippingInfo.zipcode,
            address: shippingInfo.address,
            detailAddress: shippingInfo.detailAddress,
            message: shippingInfo.message,
          },
          amount: getTotalPrice(),
          createdAt: Date.now(),
          source: 'checkout',
        };
        localStorage.setItem('zootopia:lastOrder', JSON.stringify(summary));
      } catch {}

      // 장바구니 정리
      try {
        await clearLocalOrApiCart(userId);
      } catch {}
      try {
        localStorage.removeItem(`cart:user:${userId}`);
      } catch {}
      try {
        localStorage.removeItem('tempOrder');
      } catch {}
      setOrderModal({ open: true, code: orderId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tw:min-h-screen tw:py-10 tw:relative" style={{ backgroundColor: '#FFF6F6' }}>
      <OrderCompleteModal
        open={orderModal.open}
        orderCode={orderModal.code}
        onClose={() => setOrderModal({ open: false, code: '' })}
        goDetailUrl={`/mypage?order=${orderModal.code}`}
      />
      <KakaoLoginModal
        open={kakaoLogin.modal}
        onClose={() => setKakaoLogin((prev) => ({ ...prev, modal: false }))}
        onLoggedIn={(ku) => setKakaoLogin({ loggedIn: true, user: ku, modal: false })}
      />

      {/* 결제 처리 로딩 오버레이 */}
      {isProcessing && (
        <div className="tw:fixed tw:inset-0 tw:z-[1200] tw:bg-black/30 tw:flex tw:items-center tw:justify-center">
          <div className="tw:bg-white tw:rounded-lg tw:shadow tw:p-6 tw:flex tw:flex-col tw:items-center tw:gap-3">
            <div className="tw:w-10 tw:h-10 tw:border-4 tw:border-[#FFC2C2] tw:border-t-transparent tw:rounded-full tw:animate-spin" />
            <div className="tw:text-gray-700 tw:text-sm">결제 처리 중입니다...</div>
          </div>
        </div>
      )}

      <div className="tw:max-w-6xl tw:mx-auto tw:px-4">
        {/* 브레드크럼 */}
        <nav className="tw:mb-8">
          <div className="tw:flex tw:items-center tw:space-x-2 tw:text-sm">
            <a href="/" className="tw:text-[#FF9999] tw:hover:text-[#FF7A7A]">
              홈
            </a>
            <span className="tw:text-gray-400">&gt;</span>
            <a href="/products/listp" className="tw:text-[#FF9999] tw:hover:text-[#FF7A7A]">
              스토어
            </a>
            <span className="tw:text-gray-400">&gt;</span>
            <a href="/cart" className="tw:text-pink-400 tw:hover:text-pink-500">
              장바구니
            </a>
            <span className="tw:text-gray-400">&gt;</span>
            <span className="tw:text-gray-600">결제</span>
          </div>
        </nav>

        {/* 페이지 제목 */}
        <div className="tw:mb-8">
          <h1 className="tw:text-3xl tw:font-bold tw:text-[#FF9999] tw:flex tw:items-center tw:gap-2">
            <span>🧾</span>
            주문/결제
          </h1>
        </div>

        <div className="tw:grid tw:grid-cols-1 lg:tw:grid-cols-3 tw:gap-8">
          {/* 결제 정보 입력 */}
          <div className="lg:tw:col-span-2">
            <form onSubmit={handleSubmit} className="tw:space-y-8">
              {/* 주문 상품 확인 */}
              <div className="tw:bg-white tw:rounded-lg tw:p-6 tw:shadow-sm tw:border" style={{ borderColor: '#FFE5E5' }}>
                <h2 className="tw:text-xl tw:font-bold tw:mb-4 tw:flex tw:items-center tw:gap-2 tw:text-gray-700">
                  <span>👜</span> 주문 상품 확인
                </h2>
                <div className="tw:space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="tw:flex tw:items-center tw:gap-4 tw:pb-4 tw:border-b tw:border-gray-200 tw:last:border-b-0 tw:last:pb-0"
                    >
                      <img
                        src={item.imageUrl || item.image || fallbackImg}
                        alt={item.name}
                        className="tw:w-16 tw:h-16 tw:object-cover tw:rounded tw:border"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImg;
                        }}
                      />
                      <div className="tw:flex-1">
                        <h3 className="tw:font-medium">{item.name}</h3>
                        <p className="tw:text-gray-600 tw:text-sm">수량: {item.quantity}개</p>
                      </div>
                      <div className="tw:text-right">
                        <p className="tw:font-bold tw:text-pink-500">{(item.price * item.quantity).toLocaleString()}원</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 배송 정보 */}
              <div className="tw:bg-white tw:rounded-lg tw:p-6 tw:shadow-sm tw:border" style={{ borderColor: '#FFE5E5' }}>
                <h2 className="tw:text-xl tw:font-bold tw:mb-4 tw:flex tw:items-center tw:gap-2 tw:text-gray-700">
                  <span>🚚</span> 배송 정보
                </h2>
                <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
                  <div>
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">받는 분</label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#FF9999]"
                      required
                    />
                  </div>
                  <div>
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">연락처</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#FF9999]"
                      required
                    />
                  </div>
                  <div className="md:tw:col-span-2 tw:grid tw:grid-cols-[1fr_auto] tw:gap-2">
                    <div>
                      <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">우편번호</label>
                      <input
                        type="text"
                        value={shippingInfo.zipcode}
                        onChange={(e) => handleInputChange('zipcode', e.target.value)}
                        className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-pink-400"
                        placeholder="우편번호"
                      />
                    </div>
                    <div className="tw:flex tw:items-end">
                      <button
                        type="button"
                        className="tw-h-[42px] tw:px-4 tw:rounded-lg tw:text-white"
                        style={{ backgroundColor: '#FF9999' }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FF8C8C')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF9999')}
                        onClick={handleSearchAddress}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                  <div className="md:tw:col-span-2">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">주소</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#FF9999] tw:mb-2"
                      placeholder="기본 주소"
                      required
                    />
                    <input
                      type="text"
                      value={shippingInfo.detailAddress}
                      onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                      className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#FF9999]"
                      placeholder="상세 주소"
                      ref={detailAddressRef}
                    />
                  </div>
                  <div className="md:tw:col-span-2">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">배송 메모</label>
                    <select
                      value={shippingInfo.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#FF9999]"
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
              <div className="tw:bg-white tw:rounded-lg tw:p-6 tw:shadow-sm tw:border" style={{ borderColor: '#FFE5E5' }}>
                <h2 className="tw:text-xl tw:font-bold tw:mb-4 tw:flex tw:items-center tw:gap-2 tw:text-gray-700">
                  <span>💳</span> 결제 방법
                </h2>
                <div className="tw:space-y-3">
                  {[
                    { id: 'card', name: '신용카드/체크카드', icon: 'fas fa-credit-card' },
                    { id: 'bank', name: '계좌이체', icon: 'fas fa-university' },
                    { id: 'phone', name: '휴대폰결제', icon: 'fas fa-mobile-alt' },
                    { id: 'toss', name: 'Toss 결제', icon: 'fas fa-wallet' },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`tw:border-2 tw:rounded-lg tw:p-4 tw:cursor-pointer tw:transition-all ${
                        paymentMethod === method.id ? 'tw:bg-[#FFF0F0]' : 'tw:border-gray-200 tw:hover:bg-[#FFECEC]'
                      }`}
                      style={paymentMethod === method.id ? { borderColor: '#FF9999' } : {}}
                    >
                      <div className="tw:flex tw:items-center tw:gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="tw:focus:ring-[#FF9999]"
                          style={{ accentColor: '#FF9999' }}
                        />
                        <i className={`${method.icon}`} style={{ color: '#FF9999' }}></i>
                        <span className="tw:font-medium">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'toss' && (
                  <div className="tw:mt-6 tw:space-y-4">
                    <div
                      id="toss-payment-methods"
                      ref={tossWidgetRef}
                      className="tw:border tw:rounded tw:p-4 tw:min-h-[140px] tw:relative"
                      style={{ borderColor: '#FFD1D1' }}
                    >
                      {tossLoading && (
                        <div className="tw:absolute tw:inset-0 tw:bg-white/70 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2">
                          <div className="tw:w-8 tw:h-8 tw:border-4 tw:border-[#FF9999] tw:border-t-transparent tw:rounded-full tw:animate-spin" />
                          <div className="tw:text-xs tw:text-gray-600">Toss 위젯 불러오는 중...</div>
                        </div>
                      )}
                      {!tossLoading && !tossInstanceRef.current && !tossError && (
                        <div className="tw:text-sm tw:text-gray-500">위젯 준비 중...</div>
                      )}
                      {tossError && (
                        <div className="tw:text-xs tw:text-red-500">
                          Toss 위젯 오류: {tossError} (데모 키일 경우 정상입니다)
                        </div>
                      )}
                    </div>
                    {/* Toss 자체 약관 영역 (로컬 동의 UI 대신 사용) */}
                    <div id="toss-agreement" className="tw:text-xs tw:text-gray-500"></div>
                    {tossInstanceRef.current && tossInstanceRef.current.__mock && !tossLoading && (
                      <div
                        className="tw:text-xs tw:text-gray-600 tw:bg-[#FFF5F5] tw:border tw:rounded tw:p-3 tw:space-y-1"
                        style={{ borderColor: '#FFD1D1' }}
                      >
                        <div>
                          <strong className="tw:text-pink-500">모의/데모 모드</strong> - 실제 결제 위젯 대신 시뮬레이션 동작
                        </div>
                        {tossInstanceRef.current.__mockReason && (
                          <div className="tw:text-[10px] tw:text-gray-500">사유: {tossInstanceRef.current.__mockReason}</div>
                        )}
                        <div className="tw:text-[11px]">결제하기 클릭 시 성공 페이지로 바로 이동합니다.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 결제 동의 – Toss 선택 시 숨김 (Toss 위젯 내에서 동의 처리) */}
              {paymentMethod !== 'toss' && (
                <div className="tw:bg-white tw:rounded-lg tw:p-6 tw:shadow-sm tw:border tw:border-pink-100">
                  <h2 className="tw:text-xl tw:font-bold tw:mb-4 tw:flex tw:items-center tw:gap-2 tw:text-gray-700">
                    <span>✅</span> 결제 동의
                  </h2>
                  <div className="tw:space-y-3 tw:text-sm">
                    <label className="tw:flex tw:items-center tw:gap-2">
                      <input
                        type="checkbox"
                        className="tw:focus:ring-[#FF9999]"
                        style={{ accentColor: '#FF9999' }}
                        checked={agreements.all}
                        onChange={toggleAllAgreements}
                      />
                      <span className="tw:font-medium">전체 약관에 동의합니다</span>
                    </label>
                    <div className="tw:pl-6 tw:space-y-2 tw:text-gray-700">
                      <label className="tw:flex tw:items-center tw:gap-2">
                        <input
                          type="checkbox"
                          className="tw:focus:ring-[#FF9999]"
                          style={{ accentColor: '#FF9999' }}
                          checked={agreements.terms}
                          onChange={() => toggleAgreement('terms')}
                        />
                        [필수] 이용약관 동의
                      </label>
                      <label className="tw:flex tw:items-center tw:gap-2">
                        <input
                          type="checkbox"
                          className="tw:focus:ring-[#FF9999]"
                          style={{ accentColor: '#FF9999' }}
                          checked={agreements.privacy}
                          onChange={() => toggleAgreement('privacy')}
                        />
                        [필수] 개인정보 처리방침 동의
                      </label>
                      <label className="tw:flex tw:items-center tw:gap-2">
                        <input
                          type="checkbox"
                          className="tw:focus:ring-[#FF9999]"
                          style={{ accentColor: '#FF9999' }}
                          checked={agreements.pg}
                          onChange={() => toggleAgreement('pg')}
                        />
                        [필수] 결제대행 서비스 약관 동의
                      </label>
                      <label className="tw:flex tw:items-center tw:gap-2">
                        <input
                          type="checkbox"
                          className="tw:focus:ring-[#FF9999]"
                          style={{ accentColor: '#FF9999' }}
                          checked={agreements.marketing}
                          onChange={() => toggleAgreement('marketing')}
                        />
                        [선택] 마케팅 정보 수신 동의
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 주문 요약 + 결제 버튼 (submit) */}
              <div className="lg:tw:hidden">
                {/* 모바일일 때 오른쪽 카드가 없으므로 버튼을 아래도 노출하고 싶다면 이 블록을 활용 */}
              </div>

              <div className="tw:hidden">{/* spacer */}</div>

              <button
                type="submit"
                disabled={!canPay}
                className={`tw:w-full tw:font-bold tw:py-3 tw:rounded-lg tw:transition-colors tw:flex tw:items-center tw:justify-center tw:gap-2 ${
                  canPay ? 'tw:bg-white tw:hover:bg-gray-100' : 'tw:bg-white/50 tw:text-white/80 tw:cursor-not-allowed'
                }`}
                style={canPay ? { color: '#B44444' } : {}}
              >
                <span>💳</span>
                <span>{getTotalPrice().toLocaleString()}원 결제하기</span>
              </button>
            </form>
          </div>

          {/* 주문 요약 (사이드) */}
          <div className="lg:tw:col-span-1">
            <div
              className="tw:text-white tw:rounded-lg tw:p-6 tw:sticky tw:top-20 tw:bg-gradient-to-br"
              style={{ backgroundImage: 'linear-gradient(135deg, #FF9999, #FF8C8C)' }}
            >
              <h2 className="tw:text-xl tw:font-bold tw:mb-6">주문 요약</h2>

              <div className="tw:space-y-3 tw:mb-6">
                <div className="tw:flex tw:justify-between">
                  <span>상품 ({getTotalItems()}개)</span>
                  <span>{getTotalPrice().toLocaleString()}원</span>
                </div>
                <div className="tw:flex tw:justify-between">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div className="tw:flex tw:justify-between tw:text-sm">
                  <span>할인</span>
                  <span>-0원</span>
                </div>
                <div className="tw:border-t tw:border-white tw:border-opacity-20 tw:pt-3">
                  <div className="tw:flex tw:justify-between tw:text-lg tw:font-bold">
                    <span>최종 결제 금액</span>
                    <span>{getTotalPrice().toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* 오른쪽 카드의 버튼은 보조: 실제 제출은 폼 submit과 동일 동작을 원하면 form 외 버튼 사용은 피하는 것이 안전 */}
              <button
                type="submit"
                form="" // 별도 폼 ID 없이 동작시키려면 onClick에서 handleSubmit 호출해야 하므로, 여기선 버튼을 제거/비활성 권장
                disabled
                className="tw:w-full tw:font-bold tw:py-3 tw:rounded-lg tw:opacity-60"
              >
                {getTotalPrice().toLocaleString()}원 결제하기
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = '/cart')}
                className="tw:w-full tw:mt-3 tw:bg-white/20 tw:text-white tw:font-semibold tw:py-3 tw:rounded-lg tw:hover:bg-white/25 tw:transition-colors"
              >
                ← 장바구니로 돌아가기
              </button>

              <div className="tw:mt-4 tw:text-xs tw:text-center tw:opacity-80">
                <i className="fas fa-shield-alt tw:mr-1"></i>
                안전한 결제를 위해 SSL 보안을 적용하고 있습니다
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
