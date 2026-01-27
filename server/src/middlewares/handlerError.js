const saveErrorToLog = require('../utils/logger');

module.exports.errorHandler = async (err, req, res, next) => {
  if (
    err.message ===
      'new row for relation "Banks" violates check constraint "Banks_balance_ck"' ||
    err.message ===
      'new row for relation "Users" violates check constraint "Users_balance_ck"'
  ) {
    err.message = 'Not Enough money';
    err.code = 406;
  }

  if (!err.code) {
    err.code = 500;
  }
  if (!err.message) {
    err.message = 'Server Error';
  }

  await saveErrorToLog(err);

  res.status(err.code).send(err.message);
};
