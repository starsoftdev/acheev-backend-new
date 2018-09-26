import axios from 'axios';

import {
  MOCK_OFFER,
  UPDATE_MOCK_OFFER,
  MOCK_IMAGE_ENCODED,
} from './mock';

import { MOCK_USER } from '../user/mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/offer`;

describe('Offer API', async () => {
  let offerId;
  let userId;

  it('create an offer owner - [post] /user', async () => {
    const res = await axios.post(
      `${process.env.CONFIG_API_URL}/user`,
      MOCK_USER,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    userId = data._id; /* eslint no-underscore-dangle: 0 */
  });

  it('create an offer - [post] /offer/user/:user_id', async () => {
    const res = await axios.post(
      `${BASE_URL}/user/${userId}`,
      MOCK_OFFER,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.job_name).toEqual(MOCK_OFFER.job_name);
    expect(data.category).toEqual(MOCK_OFFER.category);
    expect(data.sub_category).toEqual(MOCK_OFFER.sub_category);
    expect(data.price).toEqual(MOCK_OFFER.price);
    expect(data.time_of_delivery).toEqual(MOCK_OFFER.time_of_delivery);
    expect(data.description).toEqual(MOCK_OFFER.description);
    expect(data.opening_message).toEqual(MOCK_OFFER.opening_message);
    expect(data.status).toEqual(MOCK_OFFER.status);
    
    offerId = data._id; /* eslint no-underscore-dangle: 0 */
  });

  it('delete offer - [delete] /offer/:id', async () => {
    const res = await axios.delete(`${BASE_URL}/${offerId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });

  it('delete user - [delete] /user/:id', async () => {
    const res = await axios.delete(`${process.env.CONFIG_API_URL}/user/${userId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });
});
