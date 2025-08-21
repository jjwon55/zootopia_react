import { confirmPayment } from './payments.service.js';

export async function confirmPaymentHandler(req, res) {
  try {
    const { paymentKey, orderId, amount } = req.body;
    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await confirmPayment({ paymentKey, orderId, amount });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
}
