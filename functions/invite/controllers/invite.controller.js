import _ from 'lodash';

import { User } from '../../user/models/user.model';
import { Invite } from '../models/invite.model';

export default class OfferController {
  /**
   * return the list of all invites
   */
  static async list(req, res) {
    const pageOptions = {
      page: parseInt(req.query.page || 0, 10),
      limit: parseInt(req.query.limit || 10, 10),
    };

    try {
      const total = await Invite
        .find({ deleted: false });
        .count();

      const invites = await Invite
        .find({ deleted: false })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .populate('inviter')
        .exec();

      return res.success({
        total,
        limit: pageOptions.limit,
        page: pageOptions.page,
        invites,
      });
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * get a single invite
   */
  static async getOne(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const invite = await Invite.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!invite) {
        return res.error('Item with id not found', 404);
      }

      await Invite.populate(invite, { path: 'inviter' });

      return res.success(invite);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * update a single invite
   */
  static async update(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const invite = await Invite.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!invite) {
        return res.error('Item with id not found', 404);
      }

      delete req.body._id; // eslint-disable-line no-underscore-dangle
      const updated = _.assign(invite, req.body);
      await updated.save();
      await Invite.populate(updated, { path: 'inviter' });

      return res.success(updated);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * delete an invite
   */
  static async destroy(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const invite = await Invite.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!invite) {
        return res.error('Item with id not found', 404);
      }

      invite.deleted = true;
      await invite.save();

      return res.success('Success');
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * create a new invite
   */
  static async create(req, res) {
    if (!req.params.user_id) {
      return res.error('Invalid id supplied');
    }

    try {
      const user = await User.findOne({
        _id: req.params.user_id,
        deleted: false,
      });
      if (!user) {
        return res.error('User with id not found', 404);
      }

      const invite = await Invite.create(_.assign(
        req.body,
        {
          inviter: req.params.user_id,
        },
      ));
      await Offer.populate(invite, { path: 'inviter' });

      return res.success(invite);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * returns the list of invites by user
   */
  static async listByUser(req, res) {
    if (!req.params.user_id) {
      return res.error('Invalid id supplied');
    }

    try {
      const invites = await Invite
        .find({
          inviter: req.params.user_id,
          deleted: false,
        });

      return res.success(invites);
    } catch (err) {
      return res.error(err.message);
    }
  }
}
