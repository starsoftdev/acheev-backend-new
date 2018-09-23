import mongoose from 'mongoose';

if (!global.SubscriptionSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Subscription Schema
   */
  global.SubscriptionSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      subscription_id: {
        type: String,
      },
      plan_id: { // subscription plan id
        type: String,
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
  SubscriptionSchema: global.SubscriptionSchema,
  Subscription: mongoose.model('Subscription', global.SubscriptionSchema),
};
