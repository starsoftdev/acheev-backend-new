import mongoose from 'mongoose';

if (!global.UserBalanceSchema) {
  mongoose.Promise = global.Promise;

  /**
   * UserBalance schema
   */
  global.UserBalanceSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    working_balance: {
      type: Number,
    },
    available_balance: {
      type: Number,
    },
    pending_balance: {
      type: Number,
    },
  });
}

module.exports = {
  UserBalanceSchema: global.UserBalanceSchema,
  UserBalance: mongoose.model('UserBalance', global.UserBalanceSchema),
};
