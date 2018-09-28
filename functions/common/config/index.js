import bodyParser from 'body-parser';

import middleware from '../middleware';

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(bodyParser.json({ limit: '10mb', extended: true }));
  app.use(middleware);
  require('./auth')(); // eslint-disable-line global-require
};
