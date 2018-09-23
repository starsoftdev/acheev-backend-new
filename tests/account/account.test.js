import axios from 'axios';

import {
  MOCK_USER,
  UPDATE_MOCK_USER,
  NEW_PASSWORD,
  MOCK_IMAGE_ENCODED,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/account`;

describe('Account API, requires token header', async () => {
  let token;

  it('register a new user - [post] /auth/signup', async () => {
    const res = await axios.post(
      `${process.env.CONFIG_API_URL}/auth/signup`,
      MOCK_USER,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('token');

    ({ token } = data);
  });

  it('get profile information - [get] /account/me', async () => {
    const res = await axios.get(
      `${BASE_URL}/me`,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.first_name).toEqual(MOCK_USER.first_name);
    expect(data.last_name).toEqual(MOCK_USER.last_name);
    expect(data.username).toEqual(MOCK_USER.username);
    expect(data.email).toEqual(MOCK_USER.email);
  });

  it('update profile information - [put] /account/', async () => {
    const res = await axios.put(
      `${BASE_URL}/`,
      UPDATE_MOCK_USER,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('token');

    ({ token } = data);
  });

  it('change password - [post] /account/password', async () => {
    const res = await axios.post(
      `${BASE_URL}/password`,
      {
        currentPassword: MOCK_USER.password,
        newPassword: NEW_PASSWORD,
        verifyPassword: NEW_PASSWORD,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(data).toEqual('Password changed successfully');
  });

  it('change profile avatar - [post] /account/avatar', async () => {
    const res = await axios.post(
      `${BASE_URL}/avatar`,
      {
        image: MOCK_IMAGE_ENCODED,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('image');
  });

  it('soft delete user - [delete] /user/email/:email', async () => {
    const res = await axios.delete(`${process.env.CONFIG_API_URL}/user/email/${MOCK_USER.email}`);

    expect(res.status).toEqual(200);
  });
});
