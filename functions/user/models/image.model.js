import mongoose from 'mongoose';

if (!global.ImageSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Image [jpg|png|gif]
   */
  global.ImageSchema = new mongoose.Schema(
    {
      src: { // url to the s3 bucket image
        type: String,
      },
      alt: { // alt text
        type: String,
      },
      position: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        enum: ['small-thumbnail', 'thumbnail', 'large'],
        default: 'small-thumbnail',
      },
    },
    {
      timestamps: {
        createdAt: 'dt_created',
        updatedAt: 'dt_updated',
      },
    },
  );
}

module.exports = {
  ImageSchema: global.ImageSchema,
  Image: mongoose.model('Image', global.ImageSchema),
};
