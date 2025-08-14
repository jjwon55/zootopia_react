import React, { useEffect, useState } from 'react';
import { KakaoPay } from '../../apis/products/payments/kakao';
import { clearCart as clearLocalOrApiCart } from '../../apis/products/cart';
import { toast } from '../../apis/products/notify';
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
        toast('주문 완료', { text: `주문번호: ${orderId}${priceText ? ` · 결제금액: ${priceText}` : ''}`, icon: 'success' });
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
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:p-6">
      <div className="tw:w-full tw:max-w-md tw:bg-white tw:shadow tw:rounded-lg tw:p-6 tw:text-center">
        <h1 className="tw:text-xl tw:font-bold tw:mb-2 tw:text-gray-800">카카오페이 결제</h1>
        <p className="tw:text-sm tw:text-gray-500 tw:mb-6">
          결제 처리 중입니다.
        </p>

        {status === 'ready' && (
          <div className="tw:space-y-4">
            <div className="tw:animate-pulse tw:text-gray-600">결제창으로 이동 중...</div>
          </div>
        )}

        {status === 'approving' && (
          <div className="tw:space-y-4">
            <div className="tw:animate-pulse tw:text-gray-600">결제를 승인하는 중...</div>
          </div>
        )}

        {status === 'success' && (
          <div className="tw:space-y-2 tw:text-green-600">
            <div className="tw:text-2xl">결제 성공</div>
            <div className="tw:text-sm tw:text-gray-500">주문 완료 페이지로 이동합니다...</div>
          </div>
        )}

        {status === 'fail' && (
          <div className="tw:space-y-2 tw:text-red-600">
            <div className="tw:text-2xl">결제 실패/취소</div>
            <div className="tw:text-sm tw:text-gray-500">잠시 후 결제 페이지로 돌아갑니다...</div>
          </div>
        )}

        <div className="tw:mt-6 tw:flex tw:items-center tw:justify-center tw:gap-3">
          <button
            onClick={onApprove}
            className="tw:px-4 tw:py-2 tw:rounded tw:bg-yellow-400 hover:tw:bg-yellow-500 tw:text-black tw:font-semibold"
          >
            결제 승인
          </button>
          <button
            onClick={onCancel}
            className="tw:px-4 tw:py-2 tw:rounded tw:bg-gray-200 hover:tw:bg-gray-300 tw:text-gray-800 tw:font-semibold"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
