import express from 'express';

import TransactionController from '../controllers/transaction.controller';

// Assemble routing
const router = express.Router();

router.get('/clientToken', TransactionController.getClientToken);

router.use('/user/:user_id', TransactionController.createUserBalance);
router.get('/user/:user_id/balance', TransactionController.getBalance);
router.post('/user/:user_id/deposit', TransactionController.despoit);

export default router;
