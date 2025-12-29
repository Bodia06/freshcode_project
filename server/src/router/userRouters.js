const { Router } = require('express');
const {
  checkToken,
  basicMiddlewares,
  validators,
  hashPassMiddle,
  fileUpload,
} = require('../middlewares');
const { userControllers } = require('../controllers');

const userRouters = Router();

userRouters.post(
  '/registration',
  validators.validateRegistrationData,
  hashPassMiddle,
  userControllers.registration
);

userRouters.post('/login', validators.validateLogin, userControllers.login);

userRouters.post('/getUser', checkToken.checkAuth);

userRouters.use(checkToken.checkToken);

userRouters.post(
  '/changeMark',
  basicMiddlewares.onlyForCustomer,
  userControllers.changeMark
);

userRouters.post(
  '/updateUser',
  fileUpload.uploadAvatar,
  userControllers.updateUser
);

userRouters.post(
  '/cashout',
  basicMiddlewares.onlyForCreative,
  userControllers.cashout
);

module.exports = userRouters;
