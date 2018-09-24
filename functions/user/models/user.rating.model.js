import mongoose from 'mongoose';

if (!global.UserRatingSchema) {
  mongoose.Promise = global.Promise;

  /**
   * UserRating schema
   */
  global.UserRatingSchema = new mongoose.Schema({
    number_of_ratings: {
      type: Number,
    },
    communication: {
      type: Number,
    },
    service_integrity: {
      type: Number,
    },
    would_recommend: {
      type: Number,
    },
  });
}

module.exports = {
  UserRatingSchema: global.UserRatingSchema,
  UserRating: mongoose.model('UserRating', global.UserRatingSchema),
};
