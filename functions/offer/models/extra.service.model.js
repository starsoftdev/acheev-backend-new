import mongoose from 'mongoose';

if (!global.ExtraServiceSchema) {
  mongoose.Promise = global.Promise;

  /**
   * ExtraService schema
   */
  global.ExtraServiceSchema = new mongoose.Schema({
    description: {
      type: String,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    price: {
      type: Number,
    },
  });
}

module.exports = {
  ExtraServiceSchema: global.ExtraServiceSchema,
  ExtraService: mongoose.model('ExtraService', global.ExtraServiceSchema),
};
