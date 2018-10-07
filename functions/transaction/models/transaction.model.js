import mongoose from 'mongoose';

if (!global.TransactionSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Transaction schema
   */
  global.TransactionSchema = new mongoose.Schema({
    from: {
      type: String,
      default: 'acheev',
    },
    to: {
      type: String,
      default: 'acheev',
    },
    mode: {
      type: String,
      enum: ['Sandbox', 'Production'],
      default: 'Sandbox',
    },
    type: { // eg. 'deposit', 'withdraw', etc ...
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
    note: {
      type: String,
    },
    dt_created: {
      type: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  });
}

module.exports = {
  TransactionSchema: global.TransactionSchema,
  Transaction: mongoose.model('Transaction', global.TransactionSchema),
};
