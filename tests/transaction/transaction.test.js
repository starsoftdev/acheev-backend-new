import axios from 'axios';

import { User } from '../../functions/user/models/user.model';
import {
  MOCK_DEPOSIT,
  MOCK_USER,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/transaction`;

describe('Transaction API', async () => {
  let userId;
  let tranId;

  beforeAll(async () => {
    const user = await User.create(MOCK_USER);
    userId = user._id;
  });

  afterAll(async () => {
    await User.findOneAndUpdate({ email: MOCK_USER.email }, { deleted: true });
  });

  it('get client token for braintree - [get] /transaction/clientToken', async () => {
    const res = await axios.get(`${BASE_URL}/clientToken`);
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data).toHaveProperty('clientToken');
  });

  it('deposit money - [post] /transaction/user/:user_id/deposit', async () => {
    const res = await axios.post(
      `${BASE_URL}/user/${userId}/deposit`,
      MOCK_DEPOSIT,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.success).toEqual(true);
    expect(data).toHaveProperty('transaction_id');

    tranId = data.transaction_id;
  });

  it('get user account balance - [get] /transaction/user/:user_id/balance', async () => {
    const res = await axios.get(`${BASE_URL}/user/${userId}/balance`);
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data).toHaveProperty('working_balance');
    expect(data).toHaveProperty('available_balance');
    expect(data).toHaveProperty('pending_balance');
  });
});
