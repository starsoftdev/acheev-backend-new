import mongoose from 'mongoose';

if (!global.TransactionSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Transaction schema
   */
  global.TransactionSchema = new mongoose.Schema({
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    transaction_id: {
      type: String,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    amount: {
      type: Number,
    },
    dt_created: {
      type: Date,
    },
  });
}

module.exports = {
  TransactionSchema: global.TransactionSchema,
  Transaction: mongoose.model('Transaction', global.TransactionSchema),
};
