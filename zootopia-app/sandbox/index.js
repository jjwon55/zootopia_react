import './style.css';
import { createPaymentWidget, initPaymentMethods, requestTossPayment, renderAgreement, setAmount } from '/src/apis/products/payments/toss.js';

async function init() {
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_Ba5PzR0ArnLnBXnl0OYx3vmYnNeD';
  // force: true → 데모에서도 실제 위젯 로드하여 표시
  const widget = await createPaymentWidget(clientKey, undefined, { force: true });

  // checkout에서 전달한 파라미터 파싱
  const qs = new URLSearchParams(window.location.search);
  const passedOrderId = qs.get('orderId');
  const passedOrderName = qs.get('orderName') || '샌드박스 주문';
  const passedAmount = Number(qs.get('amount')) || 5000;

  // 위젯 표시 (가능하면 실제 위젯, 실패 시 mock 메시지)
  try {
    if (widget?.__mock) {
      await initPaymentMethods(widget, '#toss-methods', passedAmount);
    } else {
      await initPaymentMethods(widget, '#toss-methods', passedAmount);
      try { await renderAgreement(widget, '#toss-agreement'); } catch {}
    }
  } catch (e) {
    console.warn('Toss methods render fail', e);
  }

  const button = document.getElementById('checkout-button');
  if (!button) return;
  button.addEventListener('click', async () => {
    try {
      const orderId = passedOrderId || 'SBOX-' + Date.now();
      await requestTossPayment(widget, {
        orderId,
        orderName: passedOrderName,
        amount: passedAmount
        // Demo 모드에서는 /pay/toss/success 로 자동 리다이렉트 됩니다
      });
    } catch (err) {
      console.error(err);
      alert('결제 요청 중 오류 발생: ' + (err?.message || ''));
    }
  });
}

init();
