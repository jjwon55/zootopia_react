// src/apis/products/payments/toss.js
// Toss Payments 결제 위젯 연동 헬퍼 (v1 & v2 호환 / 데모 지원)
// v1: const paymentWidget = PaymentWidget(clientKey, customerKey)
// v2: const widgets = TossPayments(clientKey).widgets({ customerKey, brandpay: { redirectUrl } })
//   - v2 스크립트: https://js.tosspayments.com/v2/standard
// 참고: https://docs.tosspayments.com/

const isDemo = (import.meta?.env?.VITE_PAY_DEMO ?? 'true') === 'true';

// 간단한 지연
const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function loadTossWidget() {
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
  await loadTossWidget();
  const brandpayRedirect = options.brandpayRedirect || import.meta?.env?.VITE_TOSS_BRANDPAY_REDIRECT_URL || undefined;
  // v2 우선 사용
  if (window.TossPayments) {
    const tp = window.TossPayments(clientKey);
    const widgets = tp.widgets({
      customerKey,
      ...(brandpayRedirect ? { brandpay: { redirectUrl: brandpayRedirect } } : {})
    });
    return widgets; // v2 widgets 객체 (renderPaymentMethods / requestPayment 동일)
  }
  // fallback: v1
  if (window.PaymentWidget) {
    return window.PaymentWidget(clientKey, customerKey);
  }
  throw new Error('Toss Payments SDK 로드 실패');
}

/**
 * widget.renderPaymentMethods('#selector', { value: amount }, { variantKey: 'DEFAULT' }) 등을
 * checkout 컴포넌트에서 수행할 수 있도록 helper 노출
 */
export async function initPaymentMethods(widget, selector, amount) {
  // v2 widgets 객체: setAmount 먼저
  if (widget.setAmount) {
    await widget.setAmount({ currency: 'KRW', value: amount });
    await widget.renderPaymentMethods({ selector, variantKey: 'DEFAULT' });
    try { await widget.renderAgreement({ selector: '#toss-agreement', variantKey: 'AGREEMENT' }); } catch {}
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

export async function requestTossPayment(widget, { orderId, orderName, amount }) {
  if (isDemo) {
    await delay(600);
    const qs = new URLSearchParams({ paymentKey: 'DEMO_KEY_'+Math.random().toString(36).slice(2,10), orderId, amount: String(amount) });
    window.location.href = `/pay/toss/success?${qs.toString()}`;
    return;
  }
  const payload = {
    orderId,
    orderName,
    successUrl: import.meta.env.VITE_TOSS_SUCCESS_URL,
    failUrl: import.meta.env.VITE_TOSS_FAIL_URL
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
