import axios from 'axios';

// Confirm payment using Toss API if secret key is set; otherwise return a mock success
export async function confirmPayment({ paymentKey, orderId, amount }) {
  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) {
    await new Promise(r => setTimeout(r, 150));
    return {
      paymentKey,
      orderId,
      approvedAt: new Date().toISOString(),
      status: 'DONE',
      amount
    };
  }
  const auth = Buffer.from(`${secret}:`).toString('base64');
  const url = 'https://api.tosspayments.com/v1/payments/confirm';
  const { data } = await axios.post(url, { paymentKey, orderId, amount }, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });
  return data;
}

// Confirm Brandpay payment
export async function confirmBrandpayPayment({ customerKey, paymentKey, orderId, amount }) {
  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) {
    await new Promise(r => setTimeout(r, 150));
    return {
      paymentKey,
      orderId,
      approvedAt: new Date().toISOString(),
      status: 'DONE',
      amount,
      customerKey
    };
  }
  const auth = Buffer.from(`${secret}:`).toString('base64');
  const url = 'https://api.tosspayments.com/v1/brandpay/payments/confirm';
  const { data } = await axios.post(url, { customerKey, paymentKey, orderId, amount }, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });
  return data;
}
