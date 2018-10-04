import mongoose from 'mongoose';

if (!global.UserOnlineStatusSchema) {
  mongoose.Promise = global.Promise;

  /**
   * UserOnlineStatus schema
   */
  global.UserOnlineStatusSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      online_status: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: {
        createdAt: 'dt_created',
        updatedAt: 'dt_updated',
      },
    },
  );
}

module.exports = {
  UserOnlineStatusSchema: global.UserOnlineStatusSchema,
  UserOnlineStatus: mongoose.model('UserOnlineStatus', global.UserOnlineStatusSchema),
};
