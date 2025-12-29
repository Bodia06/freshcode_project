const { Router } = require('express');
const {
  checkToken,
  basicMiddlewares,
  fileUpload,
  validators,
} = require('../middlewares');
const { contestControllers, userControllers } = require('../controllers');

const contestRouters = Router();

contestRouters.use(checkToken.checkToken);

contestRouters.post('/dataForContest', contestControllers.dataForContest);

contestRouters.post(
  '/getCustomersContests',
  contestControllers.getCustomersContests
);

contestRouters.post(
  '/updateContest',
  fileUpload.updateContestFile,
  contestControllers.updateContest
);

contestRouters.get('/downloadFile/:fileName', contestControllers.downloadFile);

contestRouters.get(
  '/getContestById',
  basicMiddlewares.canGetContest,
  contestControllers.getContestById
);

contestRouters.post(
  '/getAllContests',
  basicMiddlewares.onlyForCreative,
  contestControllers.getContests
);

contestRouters.post(
  '/pay',
  basicMiddlewares.onlyForCustomer,
  fileUpload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userControllers.payment
);

contestRouters.post(
  '/setNewOffer',
  fileUpload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestControllers.setNewOffer
);

contestRouters.post(
  '/setOfferStatus',
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestControllers.setOfferStatus
);

module.exports = contestRouters;
