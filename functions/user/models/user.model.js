import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { ImageSchema } from './image.model';
import { ProfileSchema } from './profile.model';

if (!global.UserSchema) {
  mongoose.Promise = global.Promise;

  /**
   * User Schema - A user of the system
   */
  global.UserSchema = new mongoose.Schema(
    {
      first_name: {
        type: String,
        trim: true,
      },
      last_name: {
        type: String,
        trim: true,
      },
      username: {
        type: String,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: email => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email),
          message: 'Email is not valid.',
        },
        required: [true, 'Email is required.'],
      },
      passwordHash: {
        type: String,
      },
      roles: {
        type: [{
          type: String,
          enum: [
            'administrator',
            'course-creator',
            'elearner',
            'buyer',
            'seller',
          ],
        }],
        required: [true, 'Please provide at least one role'],
        default: ['elearner'],
      },
      image: ImageSchema,
      status: {
        type: String,
        enum: [
          'approved',
          'pending',
          'suspended',
        ],
        default: 'pending',
      },
      pin: { // for mobile app
        type: String,
        validate: {
          validator: pin => !pin || pin.length >= 4,
          message: 'Pincode must be at least 4 chars long.',
        },
      },
      profile: {
        type: ProfileSchema,
      },
      referred_by: { // the one who referred the user to register/sign up
        type: String,
      },
      deleted: { // a logical delete flag for the cart
        type: Boolean,
        default: false,
      },

      /* for social login */
      provider: {
        type: String,
        enum: [
          'facebook',
          'google',
        ],
      },
      providerData: {},

      /* for registration */
      signupToken: {
        type: String,
      },
      signupExpires: {
        type: Date,
      },

      /* for reset password */
      resetPasswordToken: {
        type: String,
      },
      resetPasswordExpires: {
        type: Date,
      },
    },
    {
      timestamps: {
        createdAt: 'dt_created',
        updatedAt: 'dt_updated',
      },
    },
  );

  /**
   * virtual `password` field
   */
  global.UserSchema
    .virtual('password')
    .set(function (password) { // eslint-disable-line func-names
      this.passwordHash = bcrypt.hashSync(password, 10);
    });

  /**
   * virtual `compact` field
   */
  global.UserSchema
    .virtual('compact')
    .get(function () { // eslint-disable-line func-names
      return {
        _id: this._id,
        first_name: this.first_name,
        last_name: this.last_name,
        username: this.username,
        email: this.email,
        roles: this.roles,
        status: this.status,
        image: this.image,
        profile: this.profile,
        dt_created: this.dt_created,
        dt_updated: this.dt_updated,
      };
    });

  /**
   * validation - email to be unique
   */
  global.UserSchema
    .path('email')
    .validate(
      async function (val) { // eslint-disable-line func-names
        try {
          const user = await this.model('User').findOne({ email: val });
          if (user && user._id.toString() !== this._id.toString()) {
            return false;
          }

          return true;
        } catch (err) {
          return false;
        }
      },
      'Email already exists',
    );

  /**
   * authenticate - check if the passwords are the same
   * @param {String} plainText
   * @return {Boolean}
   */
  global.UserSchema.methods.authenticate = function (plainText) { // eslint-disable-line func-names
    return bcrypt.compareSync(plainText, this.passwordHash);
  };
}

module.exports = {
  UserSchema: global.UserSchema,
  User: mongoose.model('User', global.UserSchema),
};
