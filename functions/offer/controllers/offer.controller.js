import _ from 'lodash';

import { User } from '../../user/models/user.model';
import { Offer } from '../models/offer.model';
import uploadToS3 from '../../common/utils/upload';

export default class OfferController {
  static __offerFilter(query) {
    const filter = { deleted: false };

    if (query.q) {
      filter.$or = [
        {
          offer_name: {
            $regex: query.q,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: query.q,
            $options: 'i',
          },
        },
      ];
    }

    if (query.category) {
      const categories = query.category.split(',');
      filter.category = {
        $in: categories,
      };
    }

    if (query.sub_category) {
      const subCategories = query.sub_category.split(',');
      filter.sub_category = {
        $in: subCategories,
      };
    }

    if (query.price_from || query.price_to) {
      filter.price = {};

      if (query.price_from) {
        filter.price.$gt = query.price_from;
      }

      if (query.price_to) {
        filter.price.$lt = query.price_to;
      }
    }

    if (query.delivery_from || query.delivery_to) {
      filter.time_of_delivery = {};

      if (query.delivery_from) {
        filter.time_of_delivery.$gt = query.delivery_from;
      }

      if (query.delivery_to) {
        filter.time_of_delivery.$lt = query.delivery_to;
      }
    }

    if (query.tags) {
      const tags = query.tags.split(',');
      filter.tags = { $all: tags };
    }

    return filter;
  }

  /**
   * return the list of all offers
   */
  static async list(req, res) {
    const pageOptions = {
      page: parseInt(req.query.page || 0, 10),
      limit: parseInt(req.query.limit || 10, 10),
    };

    try {
      const filter = OfferController.__offerFilter(req.query);
      const total = await Offer
        .find(filter)
        .count();

      const offers = await Offer
        .find(filter)
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .populate('user')
        .exec();

      return res.success({
        total,
        limit: pageOptions.limit,
        page: pageOptions.page,
        offers,
      });
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
