const db = require('../database/models');
const ServerError = require('../middlewares/errors/ServerError');
const { contestQueries, userQueries } = require('./queries');
const controller = require('../socketInit');
const { utilFunctions, emailService } = require('../utils');
const CONSTANTS = require('../constants');

module.exports.dataForContest = async (req, res, next) => {
  const response = {};
  try {
    const {
      body: { characteristic1, characteristic2 },
    } = req;

    const types = [characteristic1, characteristic2, 'industry'].filter(
      Boolean
    );

    const characteristics = await db.Selects.findAll({
      where: { type: { [db.Sequelize.Op.or]: types } },
    });

    if (!characteristics) return next(new ServerError());

    characteristics.forEach(({ type, describe }) => {
      if (!response[type]) response[type] = [];
      response[type].push(describe);
    });

    res.send(response);
  } catch (err) {
    console.log(err);
    next(new ServerError('cannot get contest preferences'));
  }
};

module.exports.getContestById = async (req, res, next) => {
  const {
    headers: { contestid },
    tokenData,
  } = req;

  try {
    const contest = await db.Contests.findOne({ where: { id: contestid } });
    if (!contest) return next(new ServerError('Contest not found'));

    const isFinished = contest.status === CONSTANTS.CONTEST_STATUS_FINISHED;

    let contestInfo = await db.Contests.findOne({
      where: { id: contestid },
      order: [[db.Offers, 'id', 'asc']],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: {
            exclude: ['password', 'role', 'balance', 'accessToken'],
          },
        },
        {
          model: db.Offers,
          required: false,
          where:
            tokenData.role === CONSTANTS.CUSTOMER
              ? isFinished
                ? { status: CONSTANTS.OFFER_STATUS_WON }
                : { status: CONSTANTS.OFFER_STATUS_PENDING }
              : tokenData.role === CONSTANTS.CREATOR
              ? { userId: tokenData.userId }
              : {},
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: db.Users,
              required: true,
              attributes: {
                exclude: ['password', 'role', 'balance', 'accessToken'],
              },
            },
            {
              model: db.Ratings,
              required: false,
              where: { userId: tokenData.userId },
              attributes: { exclude: ['userId', 'offerId'] },
            },
          ],
        },
      ],
    });

    contestInfo = contestInfo.get({ plain: true });
    contestInfo.Offers.forEach(offer => {
      if (offer.Rating) offer.mark = offer.Rating.mark;
      delete offer.Rating;
    });

    res.send(contestInfo);
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.downloadFile = async (req, res) => {
  const {
    params: { fileName },
  } = req;
  const file = CONSTANTS.CONTESTS_DEFAULT_DIR + fileName;
  res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
  const {
    body: { contestId, ...bodyData },
    tokenData: { userId },
    file,
  } = req;

  if (file) {
    bodyData.fileName = file.filename;
    bodyData.originalFileName = file.originalname;
  }

  try {
    const updatedContest = await contestQueries.updateContest(bodyData, {
      id: contestId,
      userId,
    });
    res.send(updatedContest);
  } catch (e) {
    next(e);
  }
};

module.exports.getOffersForModeration = async (req, res, next) => {
  const { limit, offset } = req.pagination;
  try {
    const offers = await db.Offers.findAndCountAll({
      where: { status: CONSTANTS.OFFER_STATUS_PREPENDING },
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: ['id', 'text', 'fileName', 'contestId', 'status'],
    });
    res.send({ offers: offers.rows, count: offers.count });
  } catch (err) {
    next(new ServerError());
  }
};

module.exports.approveOfferByModerator = async (req, res, next) => {
  const { offerId, command } = req.body;
  try {
    const newStatus =
      command === 'approve'
        ? CONSTANTS.OFFER_STATUS_PENDING
        : CONSTANTS.OFFER_STATUS_REJECTED;

    const [updatedCount, [updatedOffer]] = await db.Offers.update(
      { status: newStatus },
      {
        where: { id: offerId },
        returning: true,
      }
    );

    if (updatedCount === 0) return res.status(404).send('Offer not found');

    const offerWithUser = await db.Offers.findByPk(offerId, {
      include: [{ model: db.Users, attributes: ['email'] }],
    });

    if (offerWithUser && offerWithUser.User) {
      emailService
        .sendModerationResult(
          offerWithUser.User.email,
          newStatus,
          offerWithUser.text || 'Your file'
        )
        .catch(err => console.error('Email sending failed:', err));
    }

    res.send(updatedOffer);
  } catch (err) {
    next(new Error('Error send info to email user'));
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  const {
    body: { contestType, offerData, contestId, customerId },
    file,
    tokenData: { userId },
  } = req;

  const obj = { userId, contestId };

  if (contestType === CONSTANTS.LOGO_CONTEST) {
    obj.fileName = file.filename;
    obj.originalFileName = file.originalname;
  } else {
    obj.text = offerData;
  }

  try {
    const result = await contestQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;

    controller.getNotificationController().emitEntryCreated(customerId);

    const User = { ...req.tokenData, id: userId };
    res.send({ ...result, User });
  } catch (e) {
    next(new ServerError());
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await contestQueries.updateOffer(
    { status: CONSTANTS.OFFER_STATUS_REJECTED },
    { id: offerId }
  );

  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      creatorId,
      'Someone of yours offers was rejected',
      contestId
    );

  return rejectedOffer;
};

const resolveOffer = async (
  contestId,
  creatorId,
  orderId,
  offerId,
  priority,
  transaction
) => {
  const finishedContest = await contestQueries.updateContestStatus(
    {
      status: db.sequelize.literal(`CASE
        WHEN "id"=${contestId} AND "orderId"='${orderId}' THEN '${
        CONSTANTS.CONTEST_STATUS_FINISHED
      }'
        WHEN "orderId"='${orderId}' AND "priority"=${priority + 1} THEN '${
        CONSTANTS.CONTEST_STATUS_ACTIVE
      }'
        ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
      END`),
    },
    { orderId },
    transaction
  );

  await userQueries.updateUser(
    { balance: db.sequelize.literal(`balance + ${finishedContest.prize}`) },
    creatorId,
    transaction
  );

  const [count, updatedOffers] = await db.Offers.update(
    {
      status: db.sequelize.literal(`CASE
        WHEN "id"=${offerId} THEN '${CONSTANTS.OFFER_STATUS_WON}'
        ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'
      END`),
    },
    {
      where: { contestId },
      transaction,
      returning: true,
    }
  );

  await transaction.commit();

  const arrayRoomsId = updatedOffers
    .filter(
      offer =>
        offer.status === CONSTANTS.OFFER_STATUS_REJECTED &&
        creatorId !== offer.userId
    )
    .map(o => o.userId);

  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      arrayRoomsId,
      'Someone of yours offers was rejected',
      contestId
    );

  controller
    .getNotificationController()
    .emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);

  return updatedOffers.find(offer => offer.id === offerId);
};

module.exports.setOfferStatus = async (req, res, next) => {
  const {
    body: { command, offerId, creatorId, contestId, orderId, priority },
  } = req;

  try {
    if (command === 'reject') {
      const result = await rejectOffer(offerId, creatorId, contestId);
      return res.send(result);
    }

    if (command === 'resolve') {
      let transaction;
      try {
        transaction = await db.sequelize.transaction();
        const winningOffer = await resolveOffer(
          contestId,
          creatorId,
          orderId,
          offerId,
          priority,
          transaction
        );
        return res.send(winningOffer);
      } catch (err) {
        if (transaction) await transaction.rollback();
        return next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getCustomersContests = (req, res, next) => {
  const {
    headers: { status },
    tokenData: { userId },
    body: { limit, offset = 0 },
  } = req;

  db.Contests.findAll({
    where: { status, userId },
    limit,
    offset,
    order: [['id', 'DESC']],
    include: [{ model: db.Offers, required: false, attributes: ['id'] }],
  })
    .then(contests => {
      contests.forEach(c => (c.dataValues.count = c.dataValues.Offers.length));
      res.send({ contests, haveMore: contests.length > 0 });
    })
    .catch(err => next(new ServerError(err)));
};

module.exports.getContests = (req, res, next) => {
  const {
    body: {
      typeIndex,
      contestId,
      industry,
      awardSort,
      limit,
      offset = 0,
      ownEntries,
    },
    tokenData: { userId },
  } = req;

  const predicates = utilFunctions.createWhereForAllContests(
    typeIndex,
    contestId,
    industry,
    awardSort
  );

  db.Contests.findAll({
    where: predicates.where,
    order: predicates.order,
    limit,
    offset,
    include: [
      {
        model: db.Offers,
        required: ownEntries,
        where: ownEntries ? { userId } : {},
        attributes: ['id'],
      },
    ],
  })
    .then(contests => {
      contests.forEach(c => (c.dataValues.count = c.dataValues.Offers.length));
      res.send({ contests, haveMore: contests.length > 0 });
    })
    .catch(() => next(new ServerError()));
};
