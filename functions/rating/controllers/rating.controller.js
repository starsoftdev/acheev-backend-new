import _ from 'lodash';

import { Rating } from '../models/rating.model';

export default class RatingController {
  /**
   * return the list of all ratings
   */
  static async list(req, res) {
    try {
      const ratings = await Rating
        .find({ deleted: false });

      return res.success(ratings);
    } catch (err) {
      return res.error(err.message);
    }
  }
}
