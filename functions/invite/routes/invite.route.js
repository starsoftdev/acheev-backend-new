import express from 'express';

import InviteController from '../controllers/invite.controller';

// Assemble routing
const router = express.Router();

router.get('/', InviteController.list);
router.get('/:id', OfferController.getOne);
router.put('/:id', OfferController.update);
router.delete('/:id', OfferController.destroy);

router.get('/user/:user_id', InviteController.listByUser);
router.post('/user/:user_id', InviteController.create);

export default router;
