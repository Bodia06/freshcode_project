const mongoDb = require('../database/models/mongoModels');
const db = require('../database/models');
const { userQueries } = require('./queries');
const controller = require('../socketInit');

module.exports.addMessage = async (req, res, next) => {
  const {
    tokenData: { userId, firstName, lastName, displayName, avatar, email },
    body: { recipient, messageBody, interlocutor },
  } = req;

  const participants = [userId, recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

  try {
    const newConversation = await mongoDb.Conversation.findOneAndUpdate(
      {
        participants,
      },
      { participants, blackList: [false, false], favoriteList: [false, false] },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      }
    );
    const message = new mongoDb.Message({
      sender: userId,
      body: messageBody,
      conversation: newConversation._id,
    });
    await message.save();
    message._doc.participants = participants;
    const interlocutorId = participants.filter(
      participant => participant !== userId
    )[0];
    const preview = {
      _id: newConversation._id,
      sender: userId,
      text: messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList,
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        _id: newConversation._id,
        sender: userId,
        text: messageBody,
        createAt: message.createdAt,
        participants,
        blackList: newConversation.blackList,
        favoriteList: newConversation.favoriteList,
        interlocutor: {
          id: userId,
          firstName: firstName,
          lastName: lastName,
          displayName: displayName,
          avatar: avatar,
          email: email,
        },
      },
    });
    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: interlocutor }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { interlocutorId },
  } = req;

  const participants = [userId, interlocutorId].sort((a, b) => a - b);

  try {
    const messages = await mongoDb.Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      { $match: { 'conversationData.participants': participants } },
      { $sort: { createdAt: 1 } },
      {
        $project: {
          _id: 1,
          sender: 1,
          body: 1,
          conversation: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    const interlocutor = await userQueries.findUser({ id: interlocutorId });

    res.send({
      messages,
      interlocutor: (({ firstName, lastName, displayName, id, avatar }) => ({
        firstName,
        lastName,
        displayName,
        id,
        avatar,
      }))(interlocutor),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const conversations = await mongoDb.Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      { $unwind: '$conversationData' },
      { $match: { 'conversationData.participants': userId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationData._id',
          sender: { $first: '$sender' },
          text: { $first: '$body' },
          createAt: { $first: '$createdAt' },
          participants: { $first: '$conversationData.participants' },
          blackList: { $first: '$conversationData.blackList' },
          favoriteList: { $first: '$conversationData.favoriteList' },
        },
      },
    ]);

    const interlocutors = conversations.map(conv =>
      conv.participants.find(p => p !== userId)
    );

    const senders = await db.Users.findAll({
      where: { id: interlocutors },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    conversations.forEach(conv => {
      const senderData = senders.find(s =>
        conv.participants.includes(s.dataValues.id)
      );
      if (senderData) {
        const { id, firstName, lastName, displayName, avatar } =
          senderData.dataValues;
        conv.interlocutor = { id, firstName, lastName, displayName, avatar };
      }
    });

    res.send(conversations);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { participants, blackListFlag },
  } = req;

  const predicate = `blackList.${participants.indexOf(userId)}`;

  try {
    const chat = await mongoDb.Conversation.findOneAndUpdate(
      { participants },
      { $set: { [predicate]: blackListFlag } },
      { new: true }
    );

    res.send(chat);

    const interlocutorId = participants.find(p => p !== userId);
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { participants, favoriteFlag },
  } = req;

  const predicate = `favoriteList.${participants.indexOf(userId)}`;

  try {
    const chat = await mongoDb.Conversation.findOneAndUpdate(
      { participants },
      { $set: { [predicate]: favoriteFlag } },
      { new: true }
    );
    res.send(chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogName, chatId },
  } = req;

  try {
    const catalog = new mongoDb.Catalog({
      userId,
      catalogName,
      chats: [chatId],
    });
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId, catalogName },
  } = req;

  try {
    const catalog = await mongoDb.Catalog.findOneAndUpdate(
      { _id: catalogId, userId },
      { catalogName },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId, chatId },
  } = req;

  try {
    const catalog = await mongoDb.Catalog.findOneAndUpdate(
      { _id: catalogId, userId },
      { $addToSet: { chats: chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId, chatId },
  } = req;

  try {
    const catalog = await mongoDb.Catalog.findOneAndUpdate(
      { _id: catalogId, userId },
      { $pull: { chats: chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId },
  } = req;

  try {
    await mongoDb.Catalog.deleteOne({ _id: catalogId, userId });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const catalogs = await mongoDb.Catalog.aggregate([
      { $match: { userId } },
      { $project: { _id: 1, catalogName: 1, chats: 1 } },
    ]);
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};
