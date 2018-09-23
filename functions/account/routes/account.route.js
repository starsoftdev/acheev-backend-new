import express from 'express';

import AccountController from '../controllers/account.controller';

const router = express.Router();

router.get('/me', AccountController.me);
router.put('/', AccountController.update);
router.post('/password', AccountController.changePassword);
router.post('/avatar', AccountController.changeAvatar);

export default router;
