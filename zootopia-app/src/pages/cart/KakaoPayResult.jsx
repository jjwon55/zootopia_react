import React, { useEffect, useState } from 'react';
import { KakaoPay } from '../../apis/products/payments/kakao';
import { clearCart as clearLocalOrApiCart } from '../../apis/products/cart';
import { useLoginContext } from '../../context/LoginContextProvider';
import OrderCompleteModal from '../../components/common/OrderCompleteModal';

/**
 * 카카오페이 실제 콜백 (success) 시 pg_token을 쿼리로 받고 백엔드 승인 호출하는 페이지
 * 개발 모드에서는 demo fallback
 */
export default function KakaoPayResult() {
  const { userInfo } = useLoginContext();
  const userId = userInfo?.userId || 1;
  const [state, setState] = useState({ status: 'init', message: '결제 승인 중...' });
  const [orderModal, setOrderModal] = useState({ open: false, code: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pg_token = params.get('pg_token');
    const orderId = sessionStorage.getItem('kakao:orderId');
    const tid = sessionStorage.getItem('kakao:tid');

    if (!pg_token || !orderId) {
      setState({ status: 'error', message: '잘못된 접근입니다.' });
      return;
    }

    (async () => {
      try {
        setState({ status: 'approving', message: '결제 승인 중입니다...' });
        const res = await KakaoPay.approve({ tid, orderId, pg_token, userId });
        if (res?.approved) {
          const orderCode = orderId;
          try { await clearLocalOrApiCart(userId); } catch {}
          try { localStorage.removeItem(`cart:user:${userId}`); } catch {}
          try { localStorage.removeItem('tempOrder'); } catch {}
          try { sessionStorage.removeItem('kakao:tid'); } catch {}
          try { sessionStorage.removeItem('kakao:orderId'); } catch {}
          setState({ status: 'success', message: '결제가 완료되었습니다.' });
          setOrderModal({ open: true, code: orderCode });
        } else {
          setState({ status: 'error', message: '결제 승인에 실패했습니다.' });
        }
      } catch (e) {
        console.error(e);
        setState({ status: 'error', message: '승인 처리 중 오류가 발생했습니다.' });
      }
    })();
  }, [userId]);

  return (
    <div className="tw:min-h-screen tw:relative tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:p-6">
      {/* 주문 완료 모달 (체크아웃 화면과 동일) */}
      <OrderCompleteModal
        open={orderModal.open}
        orderCode={orderModal.code}
        onClose={() => { setOrderModal({ open: false, code: '' }); window.location.href = '/products/listp'; }}
        goDetailUrl={`/orders/${orderModal.code}`}
      />

      {/* 승인 진행/에러 카드 (성공 시 모달만 보이도록 숨김) */}
      {!orderModal.open && (
        <div className="tw:w-full tw:max-w-md tw:bg-white tw:rounded-lg tw:shadow tw:p-6 tw:text-center">
          <h1 className="tw:text-xl tw:font-bold tw:mb-4">카카오페이 결제</h1>
          <div className="tw:mb-4 tw:text-gray-700">{state.message}</div>
          {state.status === 'approving' && (
            <div className="tw:flex tw:flex-col tw:items-center tw:gap-2">
              <div className="tw:w-8 tw:h-8 tw:border-4 tw:border-pink-200 tw:border-t-pink-500 tw:rounded-full tw:animate-spin" />
              <div className="tw:text-sm tw:text-gray-500">카카오 승인 처리 중...</div>
            </div>
          )}
          {state.status === 'error' && (
            <button
              onClick={() => (window.location.href = '/checkout')}
              className="tw:mt-4 tw:px-4 tw:py-2 tw:bg-pink-500 hover:tw:bg-pink-600 tw:text-white tw:rounded"
            >
              다시 결제하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
