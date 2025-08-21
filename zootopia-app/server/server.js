import express from 'express';
import cors from 'cors';
import paymentsRouter from './payments/payments.router.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Sandbox payments server running on ${port}`));
