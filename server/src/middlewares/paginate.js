module.exports.paginateOffers = (req, res, next) => {
  const { limit = 9, offset = 0 } = req.body;

  req.pagination = {
    limit: Number(limit),
    offset: Number(offset),
  };

  next();
};
