import mongoose from 'mongoose';

if (!global.AddressSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Address schema
   */
  global.AddressSchema = new mongoose.Schema({
    address_1: { // eg. 2112 SE Timberlane Rd
      type: String,
    },
    address_2: { // eg. Apartment
      type: String,
    },
    city: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    state: {
      type: String,
    },
    country: { // eg. US
      type: String,
    },
  });
}

module.exports = {
  AddressSchema: global.AddressSchema,
  Address: mongoose.model('Address', global.AddressSchema),
};
