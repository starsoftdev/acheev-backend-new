import mongoose from 'mongoose';

if (!global.InviteSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Invite schema
   */
  global.InviteSchema = new mongoose.Schema(
    {
      inviter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      invitee_name: {
        type: String,
      },
      invitee_email: {
        type: String,
      },
      status: {
        type: String,
        enum: [
          'pending', // Invite sent
          'registered',
        ],
      },
      collected_amount: {
        type: Number,
      },
      deleted: {
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
  InviteSchema: global.InviteSchema,
  Invite: mongoose.model('Invite', global.InviteSchema),
};
