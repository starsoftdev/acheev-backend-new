import axios from 'axios';
import _ from 'lodash';

import { User } from '../../functions/user/models/user.model';
import { MOCK_USER } from '../user/mock';
import {
  MOCK_RATING,
  UPDATE_MOCK_RATING,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/rating`;

describe('Rating API', async () => {
  let userId;
  let ratingId;

  /**
   * create a test user
   */
  beforeAll(async () => {
    const user = await User.create(MOCK_USER);
    userId = user._id;
  });

  /**
   * remove test user (soft delete)
   */
  afterAll(async () => {
    await User.findByIdAndUpdate(userId, { deleted: true });
  });

  it('create a rating entry - [post] /rating', async () => {
    const res = await axios.post(
      BASE_URL,
      _.assign(
        MOCK_RATING,
        {
          user: userId,
          left_by: userId, // in practice mode, it needs to be different from 'user'
        },
      ),
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.offer_id).toEqual(MOCK_RATING.offer_id);
    expect(data.communication).toEqual(MOCK_RATING.communication);
    expect(data.service_integrity).toEqual(MOCK_RATING.service_integrity);
    expect(data.would_recommend).toEqual(MOCK_RATING.would_recommend);

    ratingId = data._id; /* eslint no-underscore-dangle: 0 */
  });

  it('update rating entry - [put] /rating/:id', async () => {
    const res = await axios.put(
      `${BASE_URL}/${ratingId}`,
      UPDATE_MOCK_RATING,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.communication).toEqual(UPDATE_MOCK_RATING.communication);
    expect(data.service_integrity).toEqual(UPDATE_MOCK_RATING.service_integrity);
    expect(data.would_recommend).toEqual(UPDATE_MOCK_RATING.would_recommend);
  });

  it('get the list of all ratings - [get] /rating', async () => {
    const res = await axios.get(BASE_URL);
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('get the ratings for a specific user - [get] /rating/user/:user_id', async () => {
    const res = await axios.get(`${BASE_URL}/user/${userId}`);
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('delete rating entry - [delete] /rating/:id', async () => {
    const res = await axios.delete(`${BASE_URL}/${ratingId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });
});
