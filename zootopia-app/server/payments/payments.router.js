import { Router } from 'express';
import { confirmPaymentHandler, confirmBrandpayHandler } from './payments.controller.js';

const router = Router();

router.post('/confirm', confirmPaymentHandler);
router.post('/brandpay/confirm', confirmBrandpayHandler);

export default router;
