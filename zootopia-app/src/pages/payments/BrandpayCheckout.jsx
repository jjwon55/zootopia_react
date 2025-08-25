import React, { useEffect, useRef, useState } from 'react';
import { createBrandpay, brandpayRequestPayment, brandpayAddPaymentMethod, brandpayChangeOneTouchPayEnabled, brandpayChangePassword, brandpayOpenSettings } from '../../apis/products/payments/toss';
import api from '../../apis/api';

export default function BrandpayCheckout() {
  const [status, setStatus] = useState('브랜드페이 초기화 중...');
  const [error, setError] = useState(null);
  const brandpayRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
  // Brandpay uses the API (ck) client key, not the widget gck.
  const clientKey = import.meta.env.VITE_TOSS_BRANDPAY_CLIENT_KEY || import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_xxxxxx';
        const customerKey = 'bp-' + (crypto?.randomUUID?.() || Date.now());
        const bp = await createBrandpay(clientKey, customerKey);
        if (cancelled) return;
        brandpayRef.current = bp;
        setStatus('브랜드페이 준비 완료');
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || '브랜드페이 초기화 실패');
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const totalAmount = 1000;
  const orderId = 'BP-' + (crypto?.randomUUID?.() || Date.now());
  const orderName = '브랜드페이 테스트 주문';

  const onPay = async () => {
    try {
      setStatus('결제 요청 중...');
      const res = await brandpayRequestPayment(brandpayRef.current, { orderId, orderName, amount: totalAmount });
      // 브랜드페이는 Promise 결과를 반환 → 서버에서 confirm 호출 필요
      const payload = { customerKey: res.customerKey, paymentKey: res.paymentKey, orderId: res.orderId, amount: res.amount };
      try {
        await api.post('/payments/brandpay/confirm', payload);
      } catch {}
      window.location.href = '/brandpay/success';
    } catch (e) {
      if (e?.code === 'USER_CANCEL') {
        alert('사용자가 결제를 취소했습니다.');
      } else {
        console.error(e);
        alert('결제 실패: ' + (e?.message || ''));
      }
    } finally {
      setStatus('브랜드페이 준비 완료');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Brandpay 결제</h2>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button disabled={!brandpayRef.current} onClick={onPay}>결제하기 ({totalAmount.toLocaleString()}원)</button>
        <button disabled={!brandpayRef.current} onClick={() => brandpayAddPaymentMethod(brandpayRef.current)}>결제수단 등록</button>
        <button disabled={!brandpayRef.current} onClick={() => brandpayChangeOneTouchPayEnabled(brandpayRef.current, true)}>원터치 결제 ON</button>
        <button disabled={!brandpayRef.current} onClick={() => brandpayChangeOneTouchPayEnabled(brandpayRef.current, false)}>원터치 결제 OFF</button>
        <button disabled={!brandpayRef.current} onClick={() => brandpayChangePassword(brandpayRef.current)}>비밀번호 변경</button>
        <button disabled={!brandpayRef.current} onClick={() => brandpayOpenSettings(brandpayRef.current)}>설정 열기</button>
      </div>
    </div>
  );
}
