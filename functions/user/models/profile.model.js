import mongoose from 'mongoose';

import { AddressSchema } from './address.model';
import { CertificationSchema } from './certification.model';
import { ExternalLinkSchema } from './external.link.model';
import { LanguageSchema } from './language.model';
import { PortfolioSchema } from './portfolio.model';
import { UserRatingSchema } from './user.rating.model';
import { UserStatSchema } from './user.stat.model';

if (!global.ProfileSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Profile schema
   */
  global.ProfileSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    address: {
      type: AddressSchema,
    },
    certifications: [{
      type: CertificationSchema,
    }],
    languages: [{
      type: LanguageSchema,
    }],
    portfolios: [{
      type: PortfolioSchema,
    }],
    professional_presence: [{
      type: ExternalLinkSchema,
    }],
    rating: {
      type: UserRatingSchema,
    },
    skills: [{ // eg. Graphic Design
      type: String,
    }],
    social_presence: [{
      type: ExternalLinkSchema,
    }],
    stats: [{
      type: UserStatSchema,
    }],
  });
}

module.exports = {
  ProfileSchema: global.ProfileSchema,
  Profile: mongoose.model('Profile', global.ProfileSchema),
};
