import mongoose from 'mongoose';

if (!global.UserStatSchema) {
  mongoose.Promise = global.Promise;

  /**
   * UserStat schema
   */
  global.UserStatSchema = new mongoose.Schema({
    name: { // eg: Avg. Response Time
      type: String,
    },
    value: { // eg. 1 hour
      type: String,
    },
  });
}

module.exports = {
  UserStatSchema: global.UserStatSchema,
  UserStat: mongoose.model('UserStat', global.UserStatSchema),
};
