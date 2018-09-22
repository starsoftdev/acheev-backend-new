module.exports = (req, res, next) => {
  res.success = (obj, code = 200) => res.status(code).json(obj);

  next();
};
