import _ from 'lodash';

import { User } from '../../user/models/user.model';
import { Offer } from '../models/offer.model';
import uploadToS3 from '../../common/utils/upload';

export default class OfferController {
  /**
   * return the list of all offers
   */
  static async list(req, res) {
    try {
      const offers = await Offer
        .find({ deleted: false })
        .populate('user');

      return res.success(offers);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * get a single offer
   */
  static async getOne(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const offer = await Offer.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!offer) {
        return res.error('User with id not found', 404);
      }

      await Offer.populate(offer, { path: 'user' });

      return res.success(offer);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * update an offer
   */
  static async update(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const offer = await Offer.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!offer) {
        return res.error('Item with id not found', 404);
      }

      delete req.body._id; // eslint-disable-line no-underscore-dangle
      const updated = _.assign(offer, req.body);
      await updated.save();
      await Offer.populate(updated, { path: 'user' });

      return res.success(updated);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * delete an offer
   */
  static async destroy(req, res) {
    if (!req.params.id) {
      return res.error('Invalid id supplied');
    }

    try {
      const offer = await Offer.findOne({
        _id: req.params.id,
        deleted: false,
      });
      if (!offer) {
        return res.error('Item with id not found', 404);
      }

      offer.deleted = true;
      await offer.save();

      return res.success('Success');
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * create a new offer
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

      const offer = await Offer.create(_.assign(
        req.body,
        {
          user: req.params.user_id,
        },
      ));
      await Offer.populate(offer, { path: 'user' });

      return res.success(offer);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * returns the list of offers by user
   */
  static async listByUser(req, res) {
    if (!req.params.user_id) {
      return res.error('Invalid id supplied');
    }

    try {
      const offers = await Offer
        .find({
          user: req.params.user_id,
          deleted: false,
        })
        .populate('user');

      return res.success(offers);
    } catch (err) {
      return res.error(err.message);
    }
  }

  /**
   * Upload thumbnails to S3
   * Thumbnails included in a request body as a base64 encoded string
   */
  static async uploadThumbnails(req, res) {
    if (!req.params.user_id) {
      return res.error('Invalid id supplied');
    }

    try {
      // find user first
      const user = await User.findOne({
        _id: req.params.user_id,
        deleted: false,
      });
      if (!user) {
        return res.error('User with id not found', 404);
      }

      const uploadPromises = [];
      let filename = (new Date()).getTime();
      _.each(req.body.thumbnails, (thumbnail) => {
        uploadPromises.push(uploadToS3(thumbnail, `offer-thumbnails-${user._id}`, filename.toString()));
        filename += 1;
      });
      const uploadLinks = await Promise.all(uploadPromises);

      return res.success(uploadLinks);
    } catch (err) {
      return res.error(err.message);
    }
  }
}
