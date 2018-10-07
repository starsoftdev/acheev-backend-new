import _ from 'lodash';

import Braintree from '../../subscription/lib/braintree';
import { Transaction } from '../models/transaction.model';
import { UserBalance } from '../models/user.balance.model';

const brainTree = new Braintree(
  process.env.BRAINTREE_MERCHANT_ID,
  process.env.BRAINTREE_PUBLIC_KEY,
  process.env.BRAINTREE_PRIVATE_KEY,
  process.env.BRAINTREE_TEST_MODE,
);

export default class TransactionController {
  static async createUserBalance(req, res, next) {
    if (!req.params.user_id) {
      return res.error('Invalid user_id supplied');
    }

    try {
      let userBalance = await UserBalance.findOne({
        user: req.params.user_id,
        deleted: false,
      });

      if (!userBalance) {
        userBalance = await UserBalance.create({
          user: req.params.user_id,
          working_balance: 0,
          available_balance: 0,
          pending_balance: 0,
        });
      }

      req.userBalance = userBalance;
      next();
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Returns the client token
   */
  static async getClientToken(req, res) {
    try {
      const clientToken = await brainTree.clientToken();

      return res.success({ clientToken });
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * deposits money to user account
   */
  static async despoit(req, res) {
    try {
      const amount = req.body.amount;
      const nonce = req.body.payment_method_nonce;

      const gatewayTranId = await brainTree.sale({
        amount,
        nonce,
      });

      // log the transaction
      const tranId = await Transaction.create({
        from: req.params.user_id,
        type: 'deposit',
        transaction_id: gatewayTranId,
        amount,
        dt_created: new Date(),
        mode: brainTree.mode(), // Sandbox or Production
      });

      // update user balance
      req.userBalance += amount;
      await req.userBalance.save();

      return res.success({
        success: true,
        'transaction_id': tranId,
      });
    } catch (err) {
      return res.error(err.message);
    }
  }
}
