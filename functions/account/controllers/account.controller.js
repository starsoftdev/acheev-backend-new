import _ from 'lodash';

import { generateToken } from '../../auth/controllers/auth.controller';
import { User } from '../../user/models/user.model';
import uploadToS3 from '../../common/utils/upload';

export default class AccountController {
  static me(req, res) {
    return res.success(req.user);
  }

  static async update(req, res) {
    let { user } = req;

    try {
      user = _.assign(user, req.body);
      await user.save();

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

  static async changePassword(req, res) {
    const passwordDetails = req.body;

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.error('User is not found', 404);
      }

      if (!user.authenticate(passwordDetails.currentPassword)) {
        return res.error('Current password is incorrect');
      }

      if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
        return res.error('Passwords do not match');
      }

      // update user password
      user.password = passwordDetails.newPassword;
      await user.save();

      // log in
      req.login(user, { session: false }, (loginErr) => {
        if (loginErr) {
          return res.error(loginErr.message);
        }

        return res.success('Password changed successfully');
      });
    } catch (err) {
      return res.error(err.message);
    }
  }

  static async changeAvatar(req, res) {
    try {
      // upload avatar to S3
      const filePath = await uploadToS3(req.body.image, 'avatars');

      // update user image attribute
      const user = _.assign(
        req.user,
        {
          image: {
            src: filePath,
            alt: 'avatar',
          },
        },
      );
      await user.save();

      return res.success(user.profile);
    } catch (err) {
      return res.error(err.message);
    }
  }
}
