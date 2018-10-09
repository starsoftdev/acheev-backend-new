import axios from 'axios';
import _ from 'lodash';

import { User } from '../../functions/user/models/user.model';

import { MOCK_USER } from '../user/mock';
import {
  MOCK_OFFER,
  UPDATE_MOCK_OFFER,
  MOCK_IMAGE_ENCODED,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/offer`;

describe('Offer API', async () => {
  let offerId;
  let userId;
  let thumbnails = [];

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

  it('get a single offer - [get] /offer/:id', async () => {
    const res = await axios.get(`${BASE_URL}/${offerId}`);
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
  });

  it('get the list of offers - [get] /offer?page=XXX&limit=XXX&...', async () => {
    const res = await axios.get(
      `${BASE_URL}?page=0&limit=5&q=test&category=${MOCK_OFFER.category},Logo Design&`
      + `sub_category=${MOCK_OFFER.sub_category},Zeplin Design&price_from=0&price_to=100&`
      + 'delivery_from=0&delivery_to=10&tags=arshdeep,design',
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('limit');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('offers');
    expect(Array.isArray(data.offers)).toBe(true);
  });

  it('get the list of offers by a user - [get] /offer/user/:user_id', async () => {
    const res = await axios.get(
      `${BASE_URL}/user/${userId}`,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('upload thumbnails for an offer - [post] /offer/user/:user_id/thumbnails', async () => {
    const res = await axios.post(
      `${BASE_URL}/user/${userId}/thumbnails/`,
      {
        thumbnails: [
          MOCK_IMAGE_ENCODED,
          MOCK_IMAGE_ENCODED,
        ],
      },
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);

    thumbnails = data;
  });

  it('update an offer - [put] /offer/:id', async () => {
    const res = await axios.put(
      `${BASE_URL}/${offerId}`,
      _.assign(
        UPDATE_MOCK_OFFER,
        {
          gallery: [
            {
              src: thumbnails[0],
              alt: 'offer thumbnail',
              position: 0, // featured image
            },
            {
              src: thumbnails[1],
              alt: 'offer thumbnail',
              position: 1,
            },
          ],
        },
      ),
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.opening_message).toEqual(UPDATE_MOCK_OFFER.opening_message);
    expect(Array.isArray(data.gallery)).toBe(true);
    expect(data.gallery.length).toBe(2);
  });

  it('delete offer - [delete] /offer/:id', async () => {
    const res = await axios.delete(`${BASE_URL}/${offerId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });
});
