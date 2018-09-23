import _ from 'lodash';

import { User } from '../models/user.model';
import uploadToS3 from '../../common/utils/upload';

export default class UserController {
  /**
   * Return an array of all users
   */
  static async list(req, res) {
    try {
      const users = await User.find(
        { deleted: false },
        '-passwordHash',
      );

      return res.success(users);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Add a new user
   */
  static async create(req, res) {
    try {
      const user = await User.create(req.body);

      return res.success(user.profile);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Update a user object properties
   */
  static async update(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const user = await User.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!user) {
        return res.error('Item with id not found', 404);
      }

      delete req.body._id; // eslint-disable-line no-underscore-dangle
      const updated = _.assign(user, req.body);
      await updated.save();

      return res.success(updated.profile);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Users are never deleted only flagged as deleted
   */
  static async destroy(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const user = await User.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!user) {
        return res.error('Item with id not found', 404);
      }

      user.deleted = true;
      await user.save();

      return res.success('Success');
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Upload photo to S3
   * Photo included a request body as a base64 encoded string
   */
  static async uploadPhoto(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      // find user first
      const user = await User.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!user) {
        return res.error('Item with id not found', 404);
      }

      // upload avatar to S3
      const filePath = await uploadToS3(req.body.image, 'avatars');

      // update user image attribute
      const updated = _.assign(
        user,
        {
          image: {
            src: filePath,
            alt: 'avatar',
          },
        },
      );
      await updated.save();

      return res.success(updated.profile);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Logical delete of user
   */
  static async destroyByEmail(req, res) {
    if (!req.params.email) {
      return res.error('Invalid email supplied');
    }

    try {
      const user = await User.findOne({
        email: req.params.email,
        deleted: false,
      });
      if (!user) {
        return res.error('Item with eamil not found', 404);
      }

      user.deleted = true;
      await user.save();

      return res.success('Success');
    } catch (err) {
      return res.error(err.message);
    }
  }
}
