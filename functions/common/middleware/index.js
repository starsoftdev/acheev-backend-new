import express from 'express';
import passport from 'passport';

const router = express.Router();

// middlewares
router.use(require('./allow_cors'));
router.use(require('./res_error'));
router.use(require('./res_success'));

router.use(passport.initialize());

export default router;
