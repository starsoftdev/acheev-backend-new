// https://github.com/braintree/braintree_express_example/blob/master/routes/index.js
import braintree from 'braintree';

class Braintree {
  constructor(merchantId, publicKey, privateKey, testMode) {
    this.testMode = testMode;
    this.gateway = braintree.connect({
      environment: testMode ? braintree.Environment.Sandbox : braintree.Environment.Production,
      merchantId,
      publicKey,
      privateKey,
    });
  }

  mode() {
    return this.testMode ? 'Sandbox' : 'Production';
  }

  async clientToken() {
    try {
      const res = await this.gateway.clientToken.generate({});

      return res.clientToken;
    } catch (err) {
      throw err;
    }
  }

  async plans() {
    try {
      const res = await this.gateway.plan.all();

      return res.plans;
    } catch (err) {
      throw err;
    }
  }

  async subscribe({
    nonce,
    plan,
  }) {
    try {
      const res = await this.gateway.customer.create({ paymentMethodNonce: nonce });
      if (!res.success) {
        throw new Error('Failed to create customer');
      }

      const { token } = res.customer.paymentMethods[0];
      const subRes = await this.gateway.subscription.create({
        paymentMethodToken: token,
        planId: plan,
      });

      if (!subRes.success) {
        throw new Error(subRes.message);
      }

      return subRes.transaction.id;
    } catch (err) {
      throw err;
    }
  }

  async cancel(subscriptionId) {
    try {
      const res = await this.gateway.subscription.cancel(subscriptionId);
      if (!res.success) {
        throw new Error(res.message);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async sale({
    amount,
    nonce,
  }) {
    try {
      const res = await this.gateway.transaction.sale({
        amount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      });
      if (!res.success) {
        throw new Error(res.message);
      }

      return res.transaction.id;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Braintree;
