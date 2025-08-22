import './style.css';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

async function init() {
  const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_Ba5PzR0ArnLnBXnl0OYx3vmYnNeD');
  const button = document.getElementById('checkout-button');
  if (!button) return;
  button.addEventListener('click', async () => {
    try {
      const orderId = 'sample-' + Date.now();
      await tossPayments.requestPayment('카드', {
        amount: 5000,
        orderId,
        orderName: '샘플 결제',
        customerName: '테스트',
        successUrl: window.location.origin + '/sandbox/success',
        failUrl: window.location.origin + '/sandbox/fail'
      });
    } catch (err) {
      console.error(err);
      alert('결제 요청 중 오류 발생: ' + err.message);
    }
  });
}

init();
