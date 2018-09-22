import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import middleware from '../middleware';

module.exports = (app) => {
  // Connect to database
  mongoose.connect(process.env.MONGO_URI);

  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(bodyParser.json({ limit: '10mb', extended: true }));
  app.use(middleware);
  require('./auth')(); // eslint-disable-line global-require
};
