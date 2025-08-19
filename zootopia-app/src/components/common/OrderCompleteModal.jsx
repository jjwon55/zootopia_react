import React from 'react';

/**
 * OrderCompleteModal
 * 공통 주문 완료 모달 (카카오/카드/계좌/휴대폰 등)
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - orderCode: string
 *  - goDetailUrl?: 주문 상세 페이지 경로 (없으면 숨김)
 */
export default function OrderCompleteModal({ open, onClose, orderCode, goDetailUrl }) {
  if (!open) return null;
  return (
    <div className="tw:fixed tw:inset-0 tw:z-[1500] tw:flex tw:items-center tw:justify-center tw:bg-black/40">
      <div className="tw:bg-white tw:w-full tw:max-w-sm tw:rounded-lg tw:shadow-lg tw:p-6 tw:relative">
        <button
          onClick={onClose}
          className="tw:absolute tw:top-2 tw:right-2 tw:text-gray-400 hover:tw:text-gray-600 tw:text-xl"
          aria-label="닫기"
        >×</button>
        <h2 className="tw:text-lg tw:font-bold tw:text-pink-600 tw:mb-3">주문 완료</h2>
        <p className="tw:text-sm tw:text-gray-600 tw:mb-4">주문이 정상적으로 완료되었습니다.</p>
        <div className="tw:bg-gray-50 tw:border tw:border-pink-100 tw:rounded tw:p-3 tw:text-sm tw:mb-4">
          <span className="tw:text-gray-500">주문번호:</span>{' '}
          <code className="tw:bg-white tw:px-2 tw:py-1 tw:rounded tw:border tw:border-gray-200 tw:text-pink-600 tw:text-xs">{orderCode}</code>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-2">
          {goDetailUrl && (
            <a
              href={goDetailUrl}
              className="tw:block tw:w-full tw:text-center tw:bg-pink-500 hover:tw:bg-pink-600 tw:text-white tw:py-2 tw:rounded tw:text-sm"
            >주문 상세 보기</a>
          )}
          <a
            href="/products/listp"
            className="tw:block tw:w-full tw:text-center tw:bg-white tw:border tw:border-pink-400 tw:text-pink-500 hover:tw:bg-pink-50 tw:py-2 tw:rounded tw:text-sm"
          >쇼핑 계속하기</a>
        </div>
      </div>
    </div>
  );
}
