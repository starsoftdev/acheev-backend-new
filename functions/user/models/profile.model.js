import mongoose from 'mongoose';

import { AddressSchema } from './address.model';
import { CertificationSchema } from './certification.model';
import { ExternalLinkSchema } from './external.link.model';
import { LanguageSchema } from './language.model';

if (!global.ProfileSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Profile schema
   */
  global.ProfileSchema = new mongoose.Schema({
    address: {
      type: AddressSchema,
    },
    certifications: [{
      type: CertificationSchema,
    }],
    languages: [{
      type: LanguageSchema,
    }],
    professional_presence: [{
      type: ExternalLinkSchema,
    }],
    social_presence: [{
      type: ExternalLinkSchema,
    }],
    skills: [{ // eg. Graphic Design
      type: String,
    }],
  });
}

module.exports = {
  ProfileSchema: global.ProfileSchema,
  Profile: mongoose.model('Profile', global.ProfileSchema),
};
