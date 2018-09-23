import jwt from 'jsonwebtoken';
import passport from 'passport';

import { User } from '../../user/models/user.model';

/**
 * generate a signed son web token with the contents of user object
 * and return it in the response
 */
export const generateToken = user => jwt.sign(
  user.profile,
  process.env.JWT_SECRET_KEY,
  { expiresIn: 60 * 60 * 24 * 31 }, // 1 month
);

export default class AuthController {
  static signin(req, res, next) {
    // authenticate user with local passport strategy
    passport.authenticate('local', { session: false }, (passportErr, user, info) => {
      if (passportErr || !user) {
        return res.error(info.message);
      }

      req.login(user, { session: false }, (loginErr) => {
        if (loginErr) {
          return res.error(loginErr.message);
        }

        const token = generateToken(user);
        return res.success({ token });
      });
    })(req, res, next);
  }

  static signout(req, res) {
    req.logout();
    return res.success('Success');
  }

  static async signup(req, res) {
    try {
      const user = await User.create(req.body);

      req.login(user, { session: false }, (loginErr) => {
        if (loginErr) {
          return res.error(loginErr.message);
        }

        const token = generateToken(user);
        return res.success({ token });
      });
    } catch (err) {
      return res.error(err.message);
    }
  }

  static async signinByPin(req, res, next) {
    // authenticate user with pin passport strategy
    passport.authenticate('pin', { session: false }, (passportErr, user, info) => {
      if (passportErr || !user) {
        return res.error(info.message);
      }

      req.login(user, { session: false }, (loginErr) => {
        if (loginErr) {
          return res.error(loginErr.message);
        }

        const token = generateToken(user);
        return res.success({ token });
      });
    })(req, res, next);
  }

  static async signinByFacebook(req, res, next) {
    passport.authenticate(
      'facebook-token',
      {
        scope: ['email', 'public_profile'],
        session: false,
      },
      (passportErr, user, info) => {
        if (passportErr || !user) {
          return res.error('User Not Authenticated', 401);
        }

        req.login(user, { session: false }, (loginErr) => {
          if (loginErr) {
            return res.error(loginErr.message);
          }

          const token = generateToken(user);
          return res.success({ token });
        });
      },
    )(req, res, next);
  }

  static async signinByGoogle(req, res, next) {
    passport.authenticate(
      'google-token',
      {
        scope: ['email', 'profile'],
        session: false,
      },
      (passportErr, user, info) => {
        if (passportErr || !user) {
          return res.error('User Not Authenticated', 401);
        }

        req.login(user, { session: false }, (loginErr) => {
          if (loginErr) {
            return res.error(loginErr.message);
          }

          const token = generateToken(user);
          return res.success({ token });
        });
      },
    )(req, res, next);
  }  
}
