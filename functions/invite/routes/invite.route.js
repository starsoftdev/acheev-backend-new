import express from 'express';

import InviteController from '../controllers/invite.controller';

// Assemble routing
const router = express.Router();

router.get('/', InviteController.list);
router.get('/:id', InviteController.getOne);
router.put('/:id', InviteController.update);
router.delete('/:id', InviteController.destroy);

router.get('/user/:user_id', InviteController.listByUser);
router.post('/user/:user_id', InviteController.create);

export default router;
