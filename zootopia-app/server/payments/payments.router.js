import { Router } from 'express';
import { confirmPaymentHandler } from './payments.controller.js';

const router = Router();

router.post('/confirm', confirmPaymentHandler);

export default router;
