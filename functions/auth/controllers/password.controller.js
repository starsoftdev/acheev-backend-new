import crypto from 'crypto';

import { User } from '../../user/models/user.model';
import mailer from '../../common/utils/smtp-mailer';

export default class PasswordController {
  static async forgot(req, res) {
    try {
      // find user
      const user = await User.findOne({
        email: req.body.email,
        deleted: false,
      });
      if (!user) {
        return res.error('User not found');
      }

      // generate token
      const buffer = crypto.randomBytes(20);
      const token = buffer.toString('hex');

      // update user
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // send email notification
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Password Reset',
        template: 'forgot-password-email',
        context: {
          name: `${user.first_name} ${user.last_name}`,
          url: `${process.env.FRONT_BASE_URL}/reset-password?token=${token}`,
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

  static async reset(req, res) {
    if (req.body.newPassword !== req.body.verifyPassword) {
      return res.error('Passwords are not equal');
    }

    try {
      // find user
      const user = await User.findOne({
        deleted: false,
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });
      if (!user) {
        return res.error('Invalid token');
      }

      // update user
      user.password = req.body.newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // send email notification
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Password Reset Confirmation',
        template: 'reset-password-email',
        context: {
          name: `${user.first_name} ${user.last_name}`,
        },
      };
      await mailer.sendMail(mailOptions);

      return res.success({ message: 'Password reset successfully' });
    } catch (err) {
      return res.error(err.message);
    }
  }
}
