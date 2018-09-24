import mongoose from 'mongoose';

if (!global.LanguageSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Language schema
   */
  global.LanguageSchema = new mongoose.Schema({
    language_name: { // eg. English
      type: String,
    },
    proficiency: {
      type: String,
      enum: [
        'basic',
        'conversational',
        'fluent',
        'native/bilingual',
      ],
      default: 'basic',
    },
  });
}

module.exports = {
  LanguageSchema: global.LanguageSchema,
  Language: mongoose.model('Language', global.LanguageSchema),
};
