const jwt = require('jsonwebtoken');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const CONSTANTS = require('../constants');
const bd = require('../database/models');
const NotUniqueEmail = require('../middlewares/errors/NotUniqueEmail');
const controller = require('../socketInit');
const { userQueries, bankQueries, ratingQueries } = require('./queries');

module.exports.login = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;
  try {
    const foundUser = await userQueries.findUser({ email });
    await userQueries.passwordCompare(password, foundUser.password);

    const accessToken = jwt.sign(
      {
        firstName: foundUser.firstName,
        userId: foundUser.id,
        role: foundUser.role,
        lastName: foundUser.lastName,
        avatar: foundUser.avatar,
        displayName: foundUser.displayName,
        balance: foundUser.balance,
        email: foundUser.email,
        rating: foundUser.rating,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );

    await userQueries.updateUser({ accessToken }, foundUser.id);
    res.send({ token: accessToken });
  } catch (err) {
    next(err);
  }
};

module.exports.registration = async (req, res, next) => {
  const { body } = req;
  try {
    const newUser = await userQueries.userCreation({
      ...body,
      password: req.hashPass,
    });

    const accessToken = jwt.sign(
      {
        firstName: newUser.firstName,
        userId: newUser.id,
        role: newUser.role,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
        displayName: newUser.displayName,
        balance: newUser.balance,
        email: newUser.email,
        rating: newUser.rating,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );

    await userQueries.updateUser({ accessToken }, newUser.id);
    res.send({ token: accessToken });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

function getQuery (offerId, userId, mark, isFirst, transaction) {
  const getCreateQuery = () =>
    ratingQueries.createRating({ offerId, mark, userId }, transaction);
  const getUpdateQuery = () =>
    ratingQueries.updateRating({ mark }, { offerId, userId }, transaction);
  return isFirst ? getCreateQuery : getUpdateQuery;
}

module.exports.changeMark = async (req, res, next) => {
  const {
    body: { isFirst, offerId, mark, creatorId },
    tokenData: { userId },
  } = req;
  let sum = 0;
  let avg = 0;
  let transaction;
  try {
    transaction = await bd.sequelize.transaction({
      isolationLevel:
        bd.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });

    const query = getQuery(offerId, userId, mark, isFirst, transaction);
    await query();

    const offersArray = await bd.Ratings.findAll({
      include: [
        {
          model: bd.Offers,
          required: true,
          where: { userId: creatorId },
        },
      ],
      transaction,
    });

    offersArray.forEach(o => (sum += o.dataValues.mark));
    avg = sum / offersArray.length;

    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    transaction.commit();

    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.payment = async (req, res, next) => {
  const {
    body: { number, cvc, expiry, price, contests },
    tokenData: { userId },
  } = req;

  let transaction;
  try {
    transaction = await bd.sequelize.transaction();

    await bankQueries.updateBankBalance(
      {
        balance: bd.sequelize.literal(`
          CASE
            WHEN "cardNumber"='${number.replace(
              / /g,
              ''
            )}' AND "cvc"='${cvc}' AND "expiry"='${expiry}' THEN "balance"-${price}
            WHEN "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' AND "cvc"='${
          CONSTANTS.SQUADHELP_BANK_CVC
        }' AND "expiry"='${
          CONSTANTS.SQUADHELP_BANK_EXPIRY
        }' THEN "balance"+${price}
          END
        `),
      },
      {
        cardNumber: {
          [bd.Sequelize.Op.in]: [
            CONSTANTS.SQUADHELP_BANK_NUMBER,
            number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );

    const orderId = uuid();

    contests.forEach((contest, index) => {
      const prize =
        index === contests.length - 1
          ? Math.ceil(price / contests.length)
          : Math.floor(price / contests.length);

      Object.assign(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });
    });

    await bd.Contests.bulkCreate(contests, transaction);
    transaction.commit();
    res.send();
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const {
    body,
    file,
    tokenData: { userId },
  } = req;
  try {
    if (file) body.avatar = file.filename;

    const updatedUser = await userQueries.updateUser(body, userId);
    const {
      firstName,
      lastName,
      displayName,
      avatar,
      email,
      balance,
      role,
      id,
    } = updatedUser;
    res.send({
      firstName,
      lastName,
      displayName,
      avatar,
      email,
      balance,
      role,
      id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  const {
    body: { sum, number, expiry, cvc },
    tokenData: { userId },
  } = req;
  let transaction;
  try {
    transaction = await bd.sequelize.transaction();

    const updatedUser = await userQueries.updateUser(
      { balance: bd.sequelize.literal(`balance - ${sum}`) },
      userId,
      transaction
    );

    await bankQueries.updateBankBalance(
      {
        balance: bd.sequelize.literal(`
          CASE 
            WHEN "cardNumber"='${number.replace(
              / /g,
              ''
            )}' AND "expiry"='${expiry}' AND "cvc"='${cvc}' THEN "balance"+${sum}
            WHEN "cardNumber"='${
              CONSTANTS.SQUADHELP_BANK_NUMBER
            }' AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}' AND "cvc"='${
          CONSTANTS.SQUADHELP_BANK_CVC
        }' THEN "balance"-${sum}
          END
        `),
      },
      {
        cardNumber: {
          [bd.Sequelize.Op.in]: [
            CONSTANTS.SQUADHELP_BANK_NUMBER,
            number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );

    transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};
