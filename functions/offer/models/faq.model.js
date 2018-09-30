import mongoose from 'mongoose';

if (!global.FaqSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Faq schema
   */
  global.FaqSchema = new mongoose.Schema(
    {
      question: {
        type: String,
      },
      answer: {
        type: String,
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
  FaqSchema: global.FaqSchema,
  Faq: mongoose.model('Faq', global.FaqSchema),
};
