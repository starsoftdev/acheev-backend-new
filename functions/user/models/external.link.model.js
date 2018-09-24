import mongoose from 'mongoose';

if (!global.ExternalLinkSchema) {
  mongoose.Promise = global.Promise;

  /**
   * ExternalLink schema
   */
  global.ExternalLinkSchema = new mongoose.Schema({
    name: { // eg. facebook, twitter
      type: String,
    },
    link: {
      type: String,
    },
  });
}

module.exports = {
  ExternalLinkSchema: global.ExternalLinkSchema,
  ExternalLink: mongoose.model('ExternalLink', global.ExternalLinkSchema),
};
