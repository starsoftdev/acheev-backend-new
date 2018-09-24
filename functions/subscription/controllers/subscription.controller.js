import Braintree from '../lib/braintree';
import { Subscription } from '../models/subscription.model';

const brainTree = new Braintree(
  process.env.BRAINTREE_MERCHANT_ID,
  process.env.BRAINTREE_PUBLIC_KEY,
  process.env.BRAINTREE_PRIVATE_KEY,
  false,
);

export default class SubscriptionController {
  /**
   * Return an array of all subscriptions
   */
  static async list(req, res) {
    try {
      const subscriptions = await Subscription.find({
        deleted: false,
      });

      return res.success(subscriptions);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Get a specific subscription
   */
  static async getOne(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const subscription = await Subscription.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!subscription) {
        return res.error('Item with id not found', 404);
      }

      return res.success(subscription);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Create a new subscription
   */
  static async create(req, res) {
    try {
      const txnId = await brainTree.subscribe({
        nonce: req.body.payment_method_nonce,
        plan: req.body.plan,
      });

      const subscription = await Subscription.create({
        user: req.user._id,
        subscription_id: txnId,
        plan_id: req.body.plan,
      });

      return res.success(subscription);
    } catch (err) {
      return res.error(err.message);
    }
  }

  static async destroy(req, res) {
    try {
      const subscription = await Subscription.findOne({
        user: req.user._id,
        deleted: false,
      });
      if (!subscription) {
        return res.error('Item with id not found', 404);
      }

      // remove subscription from braintree
      await brainTree.cancel(subscription.subscription_id);

      subscription.deleted = true;
      await subscription.save();

      return res.success('Success');
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Returns the list of all plans
   */
  static async getPlans(req, res) {
    try {
      const plans = await brainTree.plans();

      return res.success(plans);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Returns the client token
   */
  static async getClientToken(req, res) {
    try {
      const token = await brainTree.clientToken();

      return res.success({ token });
    } catch (err) {
      return res.error(err.message);
    }
  }
}
