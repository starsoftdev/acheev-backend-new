import mongoose from 'mongoose';

let isConnected;
mongoose.Promise = global.Promise;

module.exports = (req, res, next) => {
  if (isConnected) {
    return next();
  }

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then((db) => {
      isConnected = db.connections[0].readyState;
      next();
    })
    .catch(err => res.error(err.message));
};
