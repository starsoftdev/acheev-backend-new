import express from 'express';

import UserController from '../controllers/user.controller';

// Assemble routing
const router = express.Router();

router.get('/', UserController.list);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.destroy);
router.post('/:id/avatar', UserController.uploadPhoto);
router.delete('/email/:email', UserController.destroyByEmail);

export default router;
