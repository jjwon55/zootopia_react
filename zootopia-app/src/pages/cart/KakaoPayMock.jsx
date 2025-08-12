import React, { useEffect, useState } from 'react';
import { KakaoPay } from '../../apis/payments/kakao';
import { clearCart as clearLocalOrApiCart } from '../../apis/products/cart';
import { toast } from '../../apis/alert';
import { useLoginContext } from '../../context/LoginContextProvider';

// 결제창을 모사하는 데모 페이지
// - 자동으로 1.2초 후 성공으로 승인 호출
// - 상단의 버튼으로 실패/취소 분기도 실험 가능
export default function KakaoPayMock() {
  const { userInfo } = useLoginContext();
  const userIdFromContext = userInfo?.userId;
  const [status, setStatus] = useState('ready'); // ready | approving | success | fail

  useEffect(() => {
    const timer = setTimeout(() => {
      onApprove();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const onApprove = async () => {
    setStatus('approving');
    try {
      const tid = sessionStorage.getItem('kakao:tid');
      const orderId = sessionStorage.getItem('kakao:orderId');
      // 카카오 실제 콜백에선 pg_token을 받지만, 데모에선 가상 토큰 사용
      const pg_token = 'DEMO_PG_TOKEN_' + Math.random().toString(36).slice(2, 8);
      const res = await KakaoPay.approve({ tid, orderId, pg_token });
      if (res?.approved) {
        setStatus('success');
        // 장바구니/바로구매 임시 데이터 제거
        try { sessionStorage.removeItem('kakao:tid'); } catch {}
        try { sessionStorage.removeItem('kakao:orderId'); } catch {}
        try { localStorage.removeItem('tempOrder'); } catch {}
        // 장바구니 비우기 (로그인 사용자 id 우선, 없으면 세션값/기본 1)
        const userIdFromSession = Number(sessionStorage.getItem('kakao:userId')) || undefined;
        const userId = userIdFromContext || userIdFromSession || 1;
        try { localStorage.removeItem(`cart:user:${userId}`); } catch {}
        try { await clearLocalOrApiCart(userId); } catch {}

        // 주문번호/금액 토스트
        const amount = res?.payload?.amount || res?.amount || undefined;
        const priceText = amount ? `${Number(amount).toLocaleString()}원` : '';
        toast('주문 완료', `주문번호: ${orderId}${priceText ? ` · 결제금액: ${priceText}` : ''}`, 'success');
        // 1.2초 후 주문 완료 이동 (스토어 목록)
        setTimeout(() => {
          window.location.href = '/products/listp';
        }, 1200);
      } else {
        setStatus('fail');
      }
    } catch (e) {
      console.error(e);
      setStatus('fail');
    }
  };

  const onCancel = () => {
    setStatus('fail');
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-2 text-gray-800">카카오페이 결제</h1>
        <p className="text-sm text-gray-500 mb-6">
          결제 처리 중입니다.
        </p>

        {status === 'ready' && (
          <div className="space-y-4">
            <div className="animate-pulse text-gray-600">결제창으로 이동 중...</div>
          </div>
        )}

        {status === 'approving' && (
          <div className="space-y-4">
            <div className="animate-pulse text-gray-600">결제를 승인하는 중...</div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-2 text-green-600">
            <div className="text-2xl">결제 성공</div>
            <div className="text-sm text-gray-500">주문 완료 페이지로 이동합니다...</div>
          </div>
        )}

        {status === 'fail' && (
          <div className="space-y-2 text-red-600">
            <div className="text-2xl">결제 실패/취소</div>
            <div className="text-sm text-gray-500">잠시 후 결제 페이지로 돌아갑니다...</div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={onApprove} className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
            결제 승인
          </button>
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
