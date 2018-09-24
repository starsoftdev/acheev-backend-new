import mongoose from 'mongoose';

import { ImageSchema } from './image.model';

if (!global.PortfolioSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Portfolio schema
   */
  global.PortfolioSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    thumbnails: [{
      type: ImageSchema,
    }],
    category: {
      type: String,
    },
    sub_category: {
      type: String,
    },
    project_url: {
      type: String,
    },
    dt_completed: {
      type: Date,
    },
    skills: [{
      type: String,
    }],
  });
}

module.exports = {
  PortfolioSchema: global.PortfolioSchema,
  Portfolio: mongoose.model('Portfolio', global.PortfolioSchema),
};
