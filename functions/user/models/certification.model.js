import mongoose from 'mongoose';

if (!global.CertificationSchema) {
  mongoose.Promise = global.Promise;

  /**
   * Certification schema
   */
  global.CertificationSchema = new mongoose.Schema({
    org_name: { // eg. Domestika
      type: String,
    },
    cert_name: { // eg. Digital Marketing
      type: String,
    },
    dt_issued: {
      type: Date,
    },
  });
}

module.exports = {
  CertificationSchema: global.CertificationSchema,
  Certification: mongoose.model('Certification', global.CertificationSchema),
};
