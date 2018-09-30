import mongoose from 'mongoose';

import { ExtraServiceSchema } from './extra.service.model';
import { FaqSchema } from './faq.model';
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
      offer_name: {
        type: String,
      },
      category: {
        type: String,
      },
      sub_category: {
        type: String,
      },
      currency: {
        type: String,
        default: 'USD',
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
      faq: [{
        type: FaqSchema,
      }],
      tags: [{
        type: String,
      }],
      extra_services: [{
        type: ExtraServiceSchema,
      }],
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
