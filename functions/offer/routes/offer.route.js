import express from 'express';

import OfferController from '../controllers/offer.controller';

// Assemble routing
const router = express.Router();

router.get('/', OfferController.list);
router.put('/:id', OfferController.update);
router.delete('/:id', OfferController.destroy);

router.get('/user/:user_id', OfferController.listByUser);
router.post('/user/:user_id', OfferController.create);

export default router;
