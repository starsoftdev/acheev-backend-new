import mongoose from 'mongoose';

if (!global.RatingSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Rating Schema
   */
  global.RatingSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      deleted: { // logical delete
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
  RatingSchema: global.RatingSchema,
  Rating: mongoose.model('Rating', global.RatingSchema),
};
