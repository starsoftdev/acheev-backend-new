module.exports = () => {
  require('./strategies/local')(); // eslint-disable-line global-require
  require('./strategies/jwt')(); // eslint-disable-line global-require
  require('./strategies/pin')(); // eslint-disable-line global-require
  require('./strategies/facebook')(); // eslint-disable-line global-require
  require('./strategies/google')(); // eslint-disable-line global-require
};
