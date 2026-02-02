const { validationSchemes } = require('../utils');
const BadRequestError = require('./errors/BadRequestError');

module.exports.validateRegistrationData = async (req, res, next) => {
  const validationResult = await validationSchemes.registrationSchem.isValid(
    req.body
  );
  if (!validationResult) {
    return next(new BadRequestError('Invalid data for registration'));
  } else {
    next();
  }
};

module.exports.validateLogin = async (req, res, next) => {
  const validationResult = await validationSchemes.loginSchem.isValid(req.body);
  if (validationResult) {
    next();
  } else {
    return next(new BadRequestError('Invalid data for login'));
  }
};

module.exports.validateContestCreation = (req, res, next) => {
  const promiseArray = req.body.contests.map(el =>
    validationSchemes.contestSchem.isValid(el)
  );

  return Promise.all(promiseArray)
    .then(results => {
      const hasError = results.some(result => !result);

      if (hasError) {
        return next(new BadRequestError('Invalid contest data'));
      }
      next();
    })
    .catch(err => {
      next(err);
    });
};
