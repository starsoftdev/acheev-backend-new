import mongoose from 'mongoose';

import { ImageSchema } from '../../user/models/image.model';

if (!global.OfferSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Offer schema
   */
  global.OfferSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      job_name: {
        type: String,
      },
      category: {
        type: String,
      },
      sub_category: {
        type: String,
      },
      price: {
        type: Number,
      },
      time_of_delivery: { // in days
        type: Number,
      },
      description: {
        type: String,
      },
      gallery: [{
        type: ImageSchema,
      }],
      opening_message: {
        type: String,
      },
      status: {
        type: String,
        enum: [
          'draft',
          'published',
        ],
      },
      deleted: { // a logical delete flag for the cart
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
  OfferSchema: global.OfferSchema,
  Offer: mongoose.model('Offer', global.OfferSchema),
};
