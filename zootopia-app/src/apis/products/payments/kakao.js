// src/apis/payments/kakao.js
// 카카오페이 결제 흐름을 위한 어댑터 (데모 모드 지원)
// - DEMO 모드: 실제 외부 호출 없이 ready/approve 결과를 비동기로 모사
// - REAL 모드: 백엔드 프록시 API(/api/payments/kakao/*)로 호출 위임 (백엔드가 카카오 서버와 통신)

import api from '../../api';

const isDemo = (import.meta?.env?.VITE_PAY_DEMO ?? 'true') === 'true';

// 간단한 지연 유틸리티
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const KakaoPay = {
  /**
   * ready: 결제 준비 (카카오페이: /v1/payment/ready)
   * 입력: amount, orderId, orderName, items 등
   * 출력: { tid, next_redirect_pc_url }
   */
  async ready(payload) {
    if (isDemo) {
      // 데모: 외부 연동 없이 redirect URL을 모의
      await delay(600);
      return {
        tid: 'DEMO_TID_' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        next_redirect_pc_url: '/kakao-pay-mock'
      };
    }

    // 실제(또는 테스트 CID) 사용 시: 백엔드 프록시 엔드포인트로 호출
    // 백엔드 컨트롤러: POST /api/payments/kakao/ready
    const { data } = await api.post('/payments/kakao/ready', {
      orderId: payload.orderId,
      userId: payload.userId || 'guest',
      itemName: payload.orderName,
      quantity: payload.items?.reduce((s, i) => s + (i.quantity||0), 0) || 1,
      totalAmount: payload.amount
    });
    return data;
  },

  /**
   * approve: 결제 승인 (카카오페이: /v1/payment/approve)
   * 입력: { tid, pg_token, orderId }
   * 출력: { approved: true, ... } 형태 가정
   */
  async approve(payload) {
    if (isDemo) {
      // MOCK 승인 반환 (실제 호출 시 백엔드 경유)
      await delay(600);
      return { approved: true, payload, mock: true };
    }
    const { data } = await api.post('/payments/kakao/approve', {
      orderId: payload.orderId,
      userId: payload.userId || 'guest',
      pgToken: payload.pg_token || payload.pgToken || 'PG_TOKEN'
    });
    return data;
  }
}

export async function kakaoPayCancel({ tid, cancelAmount, cancelReason }) {
  const { data } = await api.post('/payments/kakao/cancel', { tid, cancelAmount, cancelReason });
  return data;
}
// Note: separate named export for cancellation (not part of KakaoPay object for clarity)

export default KakaoPay;
