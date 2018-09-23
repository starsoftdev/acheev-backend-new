import express from 'express';
import passport from 'passport';

import AuthController from '../controllers/auth.controller';
import PasswordController from '../controllers/password.controller';

const router = express.Router();

// setting up the password api
router.post('/forgot', PasswordController.forgot);
router.post('/reset/:token', PasswordController.reset);

// setting up the authentication api
router.post('/register', AuthController.signup);
router.post('/login', AuthController.signin);
router.post('/login/pin', AuthController.signinByPin);
router.get('/logout', passport.authenticate('jwt', { session: false }), AuthController.signout);

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/signin/pin', AuthController.signinByPin);
router.get('/signout', passport.authenticate('jwt', { session: false }), AuthController.signout);

export default router;
