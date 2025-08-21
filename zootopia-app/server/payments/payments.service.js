// This is a simplified mock confirmation. In real usage you'd call Toss Payments confirm API.
export async function confirmPayment({ paymentKey, orderId, amount }) {
  // Simulate async confirmation
  await new Promise(r => setTimeout(r, 200));
  return {
    paymentKey,
    orderId,
    approvedAt: new Date().toISOString(),
    status: 'DONE',
    amount
  };
}
