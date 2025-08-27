import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import OrderCompleteModal from '../../components/common/OrderCompleteModal';
import { clearCart as clearLocalOrApiCart } from '../../apis/products/cart';
import { useLoginContext } from '../../context/LoginContextProvider';

export default function TossSuccess() {
  const [status, setStatus] = useState('확인 중...');
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { userInfo } = useLoginContext();
  const userId = userInfo?.userId || 1;
  const [orderIdFromUrl, setOrderIdFromUrl] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get('paymentKey');
  const orderId = params.get('orderId');
  setOrderIdFromUrl(orderId || '');
    const amount = params.get('amount');
    if (!paymentKey || !orderId || !amount) {
      setError('필수 결제 파라미터가 없습니다.');
      return;
    }
    (async () => {
      try {
        // 서버에 결제 승인 확인
        const res = await api.post('/payments/confirm', { paymentKey, orderId, amount: Number(amount) });
        setStatus('success');
  setDetail(res.data);

        // 주문 요약 로컬 스토리지 저장이 있다면 갱신
        try {
          const prev = localStorage.getItem('zootopia:lastOrder');
          if (prev) {
            const parsed = JSON.parse(prev);
            parsed.orderCode = orderId;
            parsed.amount = Number(amount);
            parsed.paidAt = Date.now();
            parsed.source = 'checkout-toss-success';
            localStorage.setItem('zootopia:lastOrder', JSON.stringify(parsed));
          }
        } catch {}

        // 장바구니 정리 (로컬/서버)
        try { await clearLocalOrApiCart(userId); } catch {}
        try { localStorage.removeItem(`cart:user:${userId}`); } catch {}
        try { localStorage.removeItem('tempOrder'); } catch {}

        // 주문 완료 모달 열기
        setModalOpen(true);
      } catch (e) {
        setError(e.response?.data?.message || '결제 확인 실패');
      }
    })();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      {/* 화면 접근성: 백업 텍스트 */}
      <h2 style={{ marginBottom: 8 }}>주문 완료</h2>
      {!error ? (
        <p>주문이 정상적으로 완료되었습니다.</p>
      ) : (
        <p style={{ color: 'red' }}>{error}</p>
      )}
      {status === '확인 중...' && !error && <p>결제 확인 중입니다...</p>}

      {/* 스크린샷과 동일한 주문 완료 모달 */}
      <OrderCompleteModal
        open={modalOpen && !error}
  onClose={() => { setModalOpen(false); window.location.href = '/products/listp'; }}
  orderCode={detail?.orderId || orderIdFromUrl || ''}
  goDetailUrl={`/mypage?order=${detail?.orderId || orderIdFromUrl || ''}`}
      />
    </div>
  );
}
