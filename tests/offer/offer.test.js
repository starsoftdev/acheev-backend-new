import axios from 'axios';

import {
  MOCK_OFFER,
  UPDATE_MOCK_USER,
  MOCK_IMAGE_ENCODED,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/offer`;

describe('Offer API', async () => {
  let offerId;

  it('delete offer - [delete] /offer/:id', async () => {
    const res = await axios.delete(`${BASE_URL}/${offerId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });
});
