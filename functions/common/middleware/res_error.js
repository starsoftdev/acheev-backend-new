module.exports = (req, res, next) => {
  res.error = (message, code = 400) => res.status(code).json({
    error: message,
  });

  next();
};
