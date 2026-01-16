const bd = require('../database/models');
const RightsError = require('./errors/RightsError');
const ServerError = require('./errors/ServerError');
const CONSTANTS = require('../constants');

module.exports.parseBody = (req, res, next) => {
  req.body.contests = JSON.parse(req.body.contests);
  for (let i = 0; i < req.body.contests.length; i++) {
    if (req.body.contests[i].haveFile) {
      const file = req.files.splice(0, 1);
      req.body.contests[i].fileName = file[0].filename;
      req.body.contests[i].originalFileName = file[0].originalname;
    }
  }
  next();
};

module.exports.canGetContest = async (req, res, next) => {
  let result = null;
  const {
    tokenData: { role, userId },
  } = req;
  const contestId = req.headers.contestid;

  try {
    if (role === CONSTANTS.MODERATOR) {
      result = await bd.Contests.findOne({
        where: { id: contestId },
      });
    } else if (role === CONSTANTS.CUSTOMER) {
      result = await bd.Contests.findOne({
        where: { id: contestId, userId: userId },
      });
    } else if (role === CONSTANTS.CREATOR) {
      result = await bd.Contests.findOne({
        where: {
          id: contestId,
          status: {
            [bd.Sequelize.Op.or]: [
              CONSTANTS.CONTEST_STATUS_ACTIVE,
              CONSTANTS.CONTEST_STATUS_FINISHED,
            ],
          },
        },
      });
    }

    result
      ? next()
      : next(new RightsError('Contest not found or access denied'));
  } catch (e) {
    next(new ServerError(e));
  }
};

module.exports.onlyForModerator = (req, res, next) => {
  if (req.tokenData.role !== CONSTANTS.MODERATOR) {
    return next(new RightsError('This action is only for moderators'));
  }
  next();
};

module.exports.onlyForCreative = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CUSTOMER) {
    next(new RightsError());
  } else {
    next();
  }
};

module.exports.onlyForCustomer = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CREATOR) {
    return next(new RightsError('this page only for customers'));
  } else {
    next();
  }
};

module.exports.canSendOffer = async (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CUSTOMER) {
    return next(new RightsError());
  }
  try {
    const result = await bd.Contests.findOne({
      where: {
        id: req.body.contestId,
      },
      attributes: ['status'],
    });
    if (
      result.get({ plain: true }).status === CONSTANTS.CONTEST_STATUS_ACTIVE
    ) {
      next();
    } else {
      return next(new RightsError());
    }
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.onlyForCustomerWhoCreateContest = async (req, res, next) => {
  try {
    const result = await bd.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: {
          [bd.Sequelize.Op.or]: [
            CONSTANTS.CONTEST_STATUS_ACTIVE,
            CONSTANTS.CONTEST_STATUS_PENDING,
          ],
        },
      },
    });

    if (!result) {
      return next(new RightsError('Access denied or contest is finished'));
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.canUpdateContest = async (req, res, next) => {
  try {
    const result = bd.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: { [bd.Sequelize.Op.not]: CONSTANTS.CONTEST_STATUS_FINISHED },
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};
