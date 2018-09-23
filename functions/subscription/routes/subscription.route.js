import express from 'express';
import passport from 'passport';

import SubscriptionController from '../controllers/subscription.controller';

// Assemble routing
const router = express.Router();

router.get('/', SubscriptionController.list);
router.get('/plans', SubscriptionController.getPlans);
router.get('/token', SubscriptionController.getClientToken);
router.post('/', passport.authenticate('jwt', { session: false }), SubscriptionController.create);
router.get('/:id', SubscriptionController.getOne);
router.delete('/', passport.authenticate('jwt', { session: false }), SubscriptionController.destroy);

export default router;
