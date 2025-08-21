// src/apis/products/payments/toss.js
// Toss Payments 결제 위젯 연동 헬퍼 (v1 & v2 호환 / 데모 지원)
// v1: const paymentWidget = PaymentWidget(clientKey, customerKey)
// v2: const widgets = TossPayments(clientKey).widgets({ customerKey, brandpay: { redirectUrl } })
//   - v2 스크립트: https://js.tosspayments.com/v2/standard
// 참고: https://docs.tosspayments.com/

const isDemo = String(import.meta?.env?.VITE_PAY_DEMO ?? 'true').toLowerCase() === 'true';
const forceWidget = String(import.meta?.env?.VITE_TOSS_FORCE_WIDGET ?? 'false').toLowerCase() === 'true';

// 간단한 지연
const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function loadTossWidget() {
  // 데모지만 UI 강제 표시 옵션 없으면 스킵
  if (isDemo && !forceWidget) return;
  if (window.__TOSS_WIDGET_DISABLED) return; // 키 불일치 등으로 비활성화된 경우
  if (window.TossPayments || window.PaymentWidget) return;
  // 먼저 v2 시도
  try {
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-toss-widget-v2]');
      if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', reject, { once: true }); return; }
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v2/standard';
      script.async = true; script.defer = true; script.setAttribute('data-toss-widget-v2','true');
      script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
    });
  } catch (e) {
    console.warn('[toss] v2 script load 실패, v1 fallback', e);
  }
  if (window.TossPayments || window.PaymentWidget) return;
  // v1 fallback
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget';
    script.async = true; script.defer = true; script.setAttribute('data-toss-widget','true');
    script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
  });
}

export async function createPaymentWidget(clientKey, customerKey = 'guest-'+Date.now(), options = {}) {
  if (isDemo && !forceWidget) {
    return {
      __mock: true,
      __mockReason: '데모 모드 (스크립트 미로드)',
      async setAmount() { return; },
      async renderPaymentMethods() { return; },
      async renderAgreement() { return; },
      async requestPayment(payload) { return requestTossPayment(this, { ...payload, amount: payload.amount?.value || 0 }); }
    };
  }
  await loadTossWidget();
  const brandpayRedirect = options.brandpayRedirect || import.meta?.env?.VITE_TOSS_BRANDPAY_REDIRECT_URL || undefined;
  // v2 시도
  if (window.TossPayments) {
    try {
      const tp = window.TossPayments(clientKey);
      const widgets = tp.widgets({
        customerKey,
        ...(brandpayRedirect ? { brandpay: { redirectUrl: brandpayRedirect } } : {})
      });
      return widgets;
    } catch (e) {
      // 키 타입 불일치 등 오류 → 특정 메시지면 즉시 mock 전환
      const msg = (e?.message || '').toString();
      const keyMismatch = /결제위젯 연동 키|API 개별 연동 키|클라이언트 키로 SDK를 연동|지원하지 않습니다/.test(msg);
      console.warn('[toss] v2 widgets 생성 실패', msg);
      if (keyMismatch) {
  // 이후 재시도 시 불필요한 스크립트 동작 방지
  window.__TOSS_WIDGET_DISABLED = true;
        return {
          __mock: true,
          __mockReason: '클라이언트 키 타입 불일치 (mock 전환)',
          async setAmount() {},
          async renderPaymentMethods() {},
          async renderAgreement() {},
          async requestPayment(payload) { return requestTossPayment(this, { ...payload, amount: payload.amount?.value || 0 }); }
        };
      }
      // 그 외 오류면 v1 재시도
      try {
        if (!window.PaymentWidget) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.tosspayments.com/v1/payment-widget';
            script.async = true; script.defer = true;
            script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
          });
        }
      } catch (e2) {
        console.error('[toss] v1 script load 실패', e2);
      }
    }
  }
  if (window.PaymentWidget) {
    try {
      return window.PaymentWidget(clientKey, customerKey);
    } catch (e) {
      console.error('[toss] v1 PaymentWidget 생성 실패', e);
    }
  }
  console.warn('[toss] 모든 위젯 초기화 실패 – mock widget 사용');
  return {
    __mock: true,
    __mockReason: '모든 스크립트 초기화 실패',
    async setAmount() {},
    async renderPaymentMethods() { /* no-op */ },
    async renderAgreement() {},
    async requestPayment(payload) { return requestTossPayment(this, { ...payload, amount: payload.amount?.value || 0 }); }
  };
}

/**
 * widget.renderPaymentMethods('#selector', { value: amount }, { variantKey: 'DEFAULT' }) 등을
 * checkout 컴포넌트에서 수행할 수 있도록 helper 노출
 */
export async function initPaymentMethods(widget, selector, amount) {
  if (widget?.__mock) {
    const el = document.querySelector(selector);
    if (el) {
      const reason = widget.__mockReason ? ` - ${widget.__mockReason}` : '';
      el.innerHTML = `<div style="padding:8px;font-size:13px;color:#555;">(모의 위젯${reason}) 기본 결제수단 선택 UI 대신 시뮬레이션 됩니다.</div>` +
        '<ul style="margin-top:6px;padding-left:16px;list-style:disc;font-size:12px;color:#666;">'+
        '<li>신용/체크카드</li><li>계좌이체</li><li>가상계좌</li><li>간편결제</li></ul>';
    }
    return;
  }
  // v2 widgets 객체: setAmount 먼저
  if (widget.setAmount) {
    try {
      await widget.setAmount({ currency: 'KRW', value: amount });
      await widget.renderPaymentMethods({ selector, variantKey: 'DEFAULT' });
      try { await widget.renderAgreement({ selector: '#toss-agreement', variantKey: 'AGREEMENT' }); } catch {}
    } catch (e) {
      console.warn('[toss] v2 renderPaymentMethods 실패, mock 전환', e?.message || e);
      const el = document.querySelector(selector);
      if (el) {
        el.innerHTML = '<div style="padding:8px;font-size:13px;color:#555;">(위젯 렌더 실패 → 모의 모드 전환)</div>';
      }
      widget.__mock = true;
      widget.__mockReason = 'v2 렌더 실패';
    }
    return;
  }
  // v1
  return widget.renderPaymentMethods(selector, { value: amount, currency: 'KRW' }, { variantKey: 'DEFAULT' });
}

export async function renderAgreement(widget, selector) {
  if (typeof widget.renderAgreement === 'function') {
    return widget.renderAgreement({ selector, variantKey: 'AGREEMENT' });
  }
  // v1 은 별도 이용약관 위젯 없음 -> noop
  return null;
}

export async function setAmount(widget, amount) {
  if (typeof widget.setAmount === 'function') {
    return widget.setAmount({ currency: 'KRW', value: amount });
  }
  // v1 fallback: 재렌더 필요 (호출 측에서 다시 initPaymentMethods 호출권장)
  return null;
}

export async function requestTossPayment(widget, { orderId, orderName, amount, successUrl, failUrl }) {
  if (isDemo) {
    await delay(600);
    const qs = new URLSearchParams({ paymentKey: 'DEMO_KEY_'+Math.random().toString(36).slice(2,10), orderId, amount: String(amount) });
    window.location.href = `/pay/toss/success?${qs.toString()}`;
    return;
  }
  const payload = {
    orderId,
    orderName,
  successUrl: successUrl || import.meta.env.VITE_TOSS_SUCCESS_URL || (window.location.origin + '/pay/toss/success'),
  failUrl: failUrl || import.meta.env.VITE_TOSS_FAIL_URL || (window.location.origin + '/pay/toss/fail')
  };
  if (widget.setAmount) {
    // v2: 금액은 setAmount로 이미 설정됨
    return widget.requestPayment(payload);
  }
  // v1
  return widget.requestPayment({
    ...payload,
    amount: { currency: 'KRW', value: amount }
  });
}

export default { createPaymentWidget, initPaymentMethods, requestTossPayment, renderAgreement, setAmount };
