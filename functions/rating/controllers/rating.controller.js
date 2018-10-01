import _ from 'lodash';

import { Rating } from '../models/rating.model';

export default class RatingController {
  /**
   * return the list of all rating entries
   */
  static async list(req, res) {
    try {
      const ratings = await Rating
        .find({ deleted: false })
        .populate('user')
        .populate('left_by');

      return res.success(ratings);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * create a new rating entry
   */
  static async create(req, res) {
    try {
      const rating = await Rating.create(req.body);
      await Rating.populate(rating, { path: 'user' });
      await Rating.populate(rating, { path: 'left_by' });

      return res.success(rating);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * update a rating entry
   */
  static async update(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const rating = await Rating.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!rating) {
        return res.error('Item with id not found', 404);
      }

      delete req.body._id; // eslint-disable-line no-underscore-dangle
      const updated = _.assign(rating, req.body);
      await updated.save();
      await Rating.populate(updated, { path: 'user' });
      await Rating.populate(updated, { path: 'left_by' });

      return res.success(updated);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * delete a rating entry
   */
  static async destroy(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const rating = await Rating.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!rating) {
        return res.error('Item with id not found', 404);
      }

      rating.deleted = true;
      await rating.save();

      return res.success('Success');
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * return the list of rating entries for the user
   */
  static async list(req, res) {
    if (!req.params.user_id) {
      return res.error('Invalid user id supplied');
    }

    try {
      const ratings = await Rating
        .find({
          user: req.params.user_id,
          deleted: false,
        })
        .populate('user')
        .populate('left_by');

      return res.success(ratings);
    } catch (err) {
      return res.error(err.message);
    }
  }
}
