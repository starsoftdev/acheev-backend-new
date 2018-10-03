import axios from 'axios';

import { User } from '../../functions/user/models/user.model';

import {
  MOCK_USER,
  NEW_PASSWORD,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/auth`;

describe('Auth API', async () => {
  let resetToken;
  let registerToken;

  afterAll(async () => {
    await User.findOneAndUpdate({ email: MOCK_USER.email }, { deleted: true });
  });

  it('create a register token - [post] /auth/register-token', async () => {
    const res = await axios.post(
      `${BASE_URL}/register-token`,
      {
        email: MOCK_USER.email,
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('token');

    registerToken = data.token;
  });

  it('register a new user - [post] /auth/signup/:token', async () => {
    const res = await axios.post(
      `${BASE_URL}/signup/${registerToken}`,
      MOCK_USER,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('token');
  });

  it('sign in user by email + password - [post] /auth/signin', async () => {
    const res = await axios.post(
      `${BASE_URL}/signin`,
      {
        email: MOCK_USER.email,
        password: MOCK_USER.password,
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('token');
  });

  it('forgot password - [post] /auth/forgot', async () => {
    const res = await axios.post(
      `${BASE_URL}/forgot`,
      {
        email: MOCK_USER.email,
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('token');

    resetToken = data.token;
  });

  it('reset password - [post] /auth/reset/:token', async () => {
    const res = await axios.post(
      `${BASE_URL}/reset/${resetToken}`,
      {
        newPassword: NEW_PASSWORD,
        verifyPassword: NEW_PASSWORD,
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data.message).toEqual('Password reset successfully');
  });

  it('sign in user by username + password - [post] /auth/signin', async () => {
    const res = await axios.post(
      `${BASE_URL}/signin`,
      {
        email: MOCK_USER.username,
        password: NEW_PASSWORD, // password reset in the previous step
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('token');
  });
});
