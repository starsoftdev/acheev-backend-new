import mongoose from 'mongoose';

import { AddressSchema } from './address.model';
import { CertificationSchema } from './certification.model';

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
  });
}

module.exports = {
  ProfileSchema: global.ProfileSchema,
  Profile: mongoose.model('Profile', global.ProfileSchema),
};
