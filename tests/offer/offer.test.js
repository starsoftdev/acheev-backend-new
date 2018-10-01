import axios from 'axios';
import _ from 'lodash';

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
  let thumbnails = [];

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

  it('get a single offer - [get] /offer/:id', async() => {
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

  it('get the list of all offers - [get] /offer', async () => {
    const res = await axios.get(
      `${BASE_URL}`,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
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

  it('delete user - [delete] /user/:id', async () => {
    const res = await axios.delete(`${process.env.CONFIG_API_URL}/user/${userId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });
});
