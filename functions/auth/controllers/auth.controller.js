import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import _ from 'lodash';

import { User } from '../../user/models/user.model';
import mailer from '../../common/utils/smtp-mailer';

/**
 * generate a signed son web token with the contents of user object
 * and return it in the response
 */
export const generateToken = user => jwt.sign(
  user.compact,
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

  /*
   * registers a user email, and generates a signup token
   */
  static async signupToken(req, res) {
    try {
      let user = await User.findOne({
        email: req.body.email.toLowerCase(),
        deleted: false,
      });
      if (user && user.status !== 'pending') {
        return res.error('User already exists.');
      }
      if (!user) {
        user = await User.create({
          email: req.body.email,
          status: 'pending',
        });
      }

      // generate token
      const buffer = crypto.randomBytes(20);
      const token = buffer.toString('hex');
      user.signupToken = token;
      user.signupExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // send email notification
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Complete Registration',
        template: 'complete-registration-email',
        context: {
          url: `${process.env.FRONT_BASE_URL}/register/${token}`,
        },
      };
      await mailer.sendMail(mailOptions);

      return res.success({
        message: 'An email has been sent to the provided email with further instructions',
        token,
      });
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * completes registration
   * `token` must exist in the req.body
   */
  static async signup(req, res) {
    try {
      // find user
      const user = await User.findOne({
        status: 'pending',
        deleted: false,
        signupToken: req.params.token,
        signupExpires: {
          $gt: Date.now(),
        },
      });
      if (!user) {
        return res.error('Invalid token');
      }

      delete req.body._id; // eslint-disable-line no-underscore-dangle
      const updated = _.assign(
        user,
        req.body,
        {
          status: 'approved',
          signupToken: undefined,
          signupExpires: undefined,
        },
      );
      await updated.save();
      
      // send email notification
      const mailOptions = {
        to: updated.email,
        from: process.env.FROM_EMAIL,
        subject: 'Registration Successful',
        template: 'registration-success-email',
        context: {
          name: `${updated.first_name} ${updated.last_name}`,
        },
      };
      await mailer.sendMail(mailOptions);

      req.login(updated, { session: false }, (loginErr) => {
        if (loginErr) {
          return res.error(loginErr.message);
        }

        const token = generateToken(updated);
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
      (passportErr, user) => {
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
      (passportErr, user) => {
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
