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
      left_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      offer_id: {
        type: String,
      },

      communication: {
        type: Number,
      },
      service_integrity: {
        type: Number,
      },
      would_recommend: {
        type: Number,
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
