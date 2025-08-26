import React, { useEffect, useState } from 'react';
import api from '../../apis/api';

export default function TossSuccess() {
  const [status, setStatus] = useState('확인 중...');
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');
    if (!paymentKey || !orderId || !amount) {
      setError('필수 결제 파라미터가 없습니다.');
      return;
    }
    (async () => {
      try {
        const res = await api.post('/payments/confirm', { paymentKey, orderId, amount: Number(amount) });
        setStatus('결제 성공');
        setDetail(res.data);
      } catch (e) {
        setError(e.response?.data?.message || '결제 확인 실패');
      }
    })();
  }, []);

  return (
    <div style={{padding:40}}>
      <h2>Toss 결제 결과</h2>
      <p>{status}</p>
      {error && <p style={{color:'red'}}>{error}</p>}
      {detail && (
        <div style={{marginTop:16}}>
          <div>paymentKey: {detail.paymentKey}</div>
          <div>orderId: {detail.orderId}</div>
          <div>amount: {detail.amount}</div>
          <div>method: {detail.method}</div>
          <div>approvedAt: {detail.approvedAt}</div>
        </div>
      )}
      <div style={{marginTop:24}}>
        <a href={`/mypage?order=${detail?.orderId || ''}`}>주문 상세 보기</a> | <a href="/products/listp">계속 쇼핑</a>
      </div>
    </div>
  );
}
