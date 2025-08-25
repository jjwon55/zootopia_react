// src/apis/products/payments/toss.js
// Toss Payments: Standard Widget(v2 전용) + Brandpay(v1 SDK) helpers
// - Standard Widget(v2): https://js.tosspayments.com/v2/standard -> window.TossPayments().widgets()
// - Brandpay(v1 SDK): https://js.tosspayments.com/v1/brandpay -> window.BrandPay()
// Docs: https://docs.tosspayments.com/

const isDemo = String(import.meta?.env?.VITE_PAY_DEMO ?? 'false').toLowerCase() === 'true';
const forceWidgetEnv = String(import.meta?.env?.VITE_TOSS_FORCE_WIDGET ?? 'false').toLowerCase() === 'true';

// 간단한 지연
const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function loadTossWidget(force = false) {
  // Demo이면 보통 실제 위젯을 스킵하지만, 강제표시 옵션일 때만 로드합니다.
  if (isDemo && !force && !forceWidgetEnv) return;
  if (window.__TOSS_WIDGET_DISABLED) return;
  if (window.TossPayments) return;
  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-toss-widget-v2]');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.async = true; script.defer = true; script.setAttribute('data-toss-widget-v2','true');
    script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
  });
}

export async function createPaymentWidget(clientKey, customerKey = 'guest-'+Date.now(), options = {}) {
  const force = options?.force === true;
  if (isDemo && !force && !forceWidgetEnv) {
    return {
      __mock: true,
      __mockReason: '데모 모드 (스크립트 미로드)',
      async setAmount() { return; },
      async renderPaymentMethods() { return; },
      async renderAgreement() { return; },
      async requestPayment(payload) {
        const value = Number(payload?.amount?.value ?? payload?.amount ?? 0);
        await delay(300);
        const qs = new URLSearchParams({
          paymentKey: 'DEMO_KEY_'+Math.random().toString(36).slice(2,10),
          orderId: payload?.orderId || 'DEMO',
          amount: String(value)
        });
        window.location.href = `/pay/toss/success?${qs.toString()}`;
      }
    };
  }
  // Validate key type: must be gck for Standard Widget v2
  if (!/^((test|live)_gck_)/.test(String(clientKey))) {
    throw new Error('Invalid clientKey for widget: use a test_gck_... (or live_gck_...) key');
  }
  await loadTossWidget(force);
  const brandpayRedirect = options.brandpayRedirect || import.meta?.env?.VITE_TOSS_BRANDPAY_REDIRECT_URL || undefined;
  if (window.TossPayments) {
    try {
      const tp = window.TossPayments(clientKey);
      const widgets = tp.widgets({
        customerKey,
        ...(brandpayRedirect ? { brandpay: { redirectUrl: brandpayRedirect } } : {})
      });
      return widgets;
    } catch (e) {
      console.warn('[toss] v2 widgets 생성 실패', e?.message || e);
    }
  }
  console.warn('[toss] v2 위젯 초기화 실패 – mock widget 사용');
  return {
    __mock: true,
    __mockReason: '모든 스크립트 초기화 실패',
    async setAmount() {},
    async renderPaymentMethods() { /* no-op */ },
    async renderAgreement() {},
    async requestPayment(payload) {
      const value = Number(payload?.amount?.value ?? payload?.amount ?? 0);
      await delay(300);
      const qs = new URLSearchParams({
        paymentKey: 'DEMO_KEY_'+Math.random().toString(36).slice(2,10),
        orderId: payload?.orderId || 'DEMO',
        amount: String(value)
      });
      window.location.href = `/pay/toss/success?${qs.toString()}`;
    }
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
  // v2 widgets 객체 전용
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
}

export async function renderAgreement(widget, selector) {
  if (typeof widget.renderAgreement === 'function') {
    return widget.renderAgreement({ selector, variantKey: 'AGREEMENT' });
  }
  return null;
}

export async function setAmount(widget, amount) {
  if (typeof widget.setAmount === 'function') {
    return widget.setAmount({ currency: 'KRW', value: amount });
  }
  return null;
}

export async function requestTossPayment(widget, { orderId, orderName, amount, successUrl, failUrl, preferWidget } = {}) {
  // 모의 위젯이면 즉시 성공으로 시뮬레이션
  if (widget?.__mock) {
    await delay(400);
    const qs = new URLSearchParams({ paymentKey: 'DEMO_KEY_'+Math.random().toString(36).slice(2,10), orderId, amount: String(amount || 0) });
    window.location.href = `/pay/toss/success?${qs.toString()}`;
    return;
  }
  if (isDemo && !preferWidget) {
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
  // v2: 금액은 setAmount로 이미 설정됨
  return widget.requestPayment(payload);
}

// ------------------------
// Brandpay(v1 SDK) helpers
// ------------------------
export async function loadBrandpayScript() {
  if (window.BrandPay) return;
  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-toss-brandpay]');
    if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', reject, { once: true }); return; }
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/brandpay';
    script.async = true; script.defer = true; script.setAttribute('data-toss-brandpay','true');
    script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
  });
}

export async function createBrandpay(clientKey, customerKey, options = {}) {
  const redirectUrl = options.redirectUrl || import.meta?.env?.VITE_TOSS_BRANDPAY_REDIRECT_URL || (window.location.origin + '/brandpay/success');
  if (isDemo && !forceWidgetEnv) {
    return {
      __mock: true,
      async requestPayment({ amount, orderId }) {
        await delay(400);
        return { paymentKey: 'DEMO_BRANDPAY_'+Math.random().toString(36).slice(2,10), orderId, amount };
      },
      async addPaymentMethod() { return true; },
      async changeOneTouchPayEnabled() { return true; },
      async changePassword() { return true; },
      async openSettings() { return true; }
    };
  }
  await loadBrandpayScript();
  try {
    return window.BrandPay(clientKey, customerKey, { redirectUrl });
  } catch (e) {
    console.warn('[brandpay] init 실패, mock 사용', e?.message || e);
    return {
      __mock: true,
      async requestPayment({ amount, orderId }) {
        await delay(400);
        return { paymentKey: 'DEMO_BRANDPAY_'+Math.random().toString(36).slice(2,10), orderId, amount };
      },
      async addPaymentMethod() { return true; },
      async changeOneTouchPayEnabled() { return true; },
      async changePassword() { return true; },
      async openSettings() { return true; }
    };
  }
}

export async function brandpayRequestPayment(brandpay, { orderId, orderName, amount }) {
  if (brandpay?.__mock) {
    const res = await brandpay.requestPayment({ amount, orderId, orderName });
    return res;
  }
  return brandpay.requestPayment({ amount, orderId, orderName });
}

export async function brandpayAddPaymentMethod(brandpay) {
  return brandpay.addPaymentMethod();
}
export async function brandpayChangeOneTouchPayEnabled(brandpay, enabled) {
  return brandpay.changeOneTouchPayEnabled(enabled);
}
export async function brandpayChangePassword(brandpay) {
  return brandpay.changePassword();
}
export async function brandpayOpenSettings(brandpay) {
  return brandpay.openSettings();
}

export default { createPaymentWidget, initPaymentMethods, requestTossPayment, renderAgreement, setAmount, createBrandpay, brandpayRequestPayment, brandpayAddPaymentMethod, brandpayChangeOneTouchPayEnabled, brandpayChangePassword, brandpayOpenSettings };
