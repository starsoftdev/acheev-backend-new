import axios from 'axios';

import {
  MOCK_USER,
  UPDATE_MOCK_USER,
  MOCK_IMAGE_ENCODED,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/user`;

describe('User API', async () => {
  let userId;

  it('add user - [post] /user', async () => {
    const res = await axios.post(
      BASE_URL,
      MOCK_USER,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.first_name).toEqual(MOCK_USER.first_name);
    expect(data.last_name).toEqual(MOCK_USER.last_name);
    expect(data.username).toEqual(MOCK_USER.username);
    expect(data.email).toEqual(MOCK_USER.email);
    expect(typeof data.password).toEqual('undefined');

    userId = data._id; /* eslint no-underscore-dangle: 0 */
  });

  it('update user - [put] /user/:id', async () => {
    const res = await axios.put(
      `${BASE_URL}/${userId}`,
      UPDATE_MOCK_USER,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.username).toEqual(UPDATE_MOCK_USER.username);
    expect(typeof data.password).toEqual('undefined');
  });

  it('get all users - [get] /user', async () => {
    const res = await axios.get(`${BASE_URL}`);
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('upload avatar - [post] /user/:id/avatar', async () => {
    const res = await axios.post(
      `${BASE_URL}/${userId}/avatar/`,
      {
        image: MOCK_IMAGE_ENCODED,
      },
    );

    expect(res.status).toEqual(200);
  });

  it('delete user - [delete] /user/:id', async () => {
    const res = await axios.delete(`${BASE_URL}/${userId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });
});
