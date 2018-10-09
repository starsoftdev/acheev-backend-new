import axios from 'axios';
import _ from 'lodash';

import { User } from '../../functions/user/models/user.model';

import { MOCK_USER } from '../user/mock';
import {
  MOCK_INVITE,
  UPDATE_MOCK_INVITE,
} from './mock';

jest.setTimeout(process.env.MAX_TIMEOUT || 100000);
const BASE_URL = `${process.env.CONFIG_API_URL}/invite`;

describe('Invite API', async () => {
  let inviteId;
  let userId;

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

  it('create an invite - [post] /invite/user/:user_id', async () => {
    const res = await axios.post(
      `${BASE_URL}/user/${userId}`,
      MOCK_INVITE,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.invitee_name).toEqual(MOCK_INVITE.invitee_name);
    expect(data.invitee_email).toEqual(MOCK_INVITE.invitee_email);
    expect(data.status).toEqual(MOCK_INVITE.status);

    inviteId = data._id; /* eslint no-underscore-dangle: 0 */
  });

  it('get a single invite - [get] /invite/:id', async () => {
    const res = await axios.get(`${BASE_URL}/${inviteId}`);
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.invitee_name).toEqual(MOCK_INVITE.invitee_name);
    expect(data.invitee_email).toEqual(MOCK_INVITE.invitee_email);
    expect(data.status).toEqual(MOCK_INVITE.status);
  });

  it('get the list of invites - [get] /invite?page=XXX&limit=XXX', async () => {
    const res = await axios.get(
      `${BASE_URL}?page=0&limit=5`,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('limit');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('invites');
    expect(Array.isArray(data.invites)).toBe(true);
  });

  it('get the list of invites by a user - [get] /invite/user/:user_id', async () => {
    const res = await axios.get(
      `${BASE_URL}/user/${userId}`,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('update an invite - [put] /invite/:id', async () => {
    const res = await axios.put(
      `${BASE_URL}/${inviteId}`,
      UPDATE_MOCK_INVITE,
    );
    const { data } = res;

    expect(res.status).toEqual(200);
    expect(typeof data).toBe('object');

    expect(data.status).toEqual(UPDATE_MOCK_INVITE.status);
    expect(data.collected_amount).toEqual(UPDATE_MOCK_INVITE.collected_amount);
  });

  it('delete invite - [delete] /invite/:id', async () => {
    const res = await axios.delete(`${BASE_URL}/${inviteId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toEqual('Success');
  });
});
