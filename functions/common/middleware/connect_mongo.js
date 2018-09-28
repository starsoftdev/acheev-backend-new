import mongoose from 'mongoose';

module.exports = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    next();
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};
