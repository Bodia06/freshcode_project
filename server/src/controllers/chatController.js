//const mongoDb = require('../database/models/mongoModels');
const db = require('../database/models');
//const { userQueries } = require('./queries');
const controller = require('../socketInit');

// module.exports.addMessage = async (req, res, next) => {
//   const {
//     tokenData: { userId, firstName, lastName, displayName, avatar, email },
//     body: { recipient, messageBody, interlocutor },
//   } = req;

//   const participants = [userId, recipient];
//   participants.sort(
//     (participant1, participant2) => participant1 - participant2
//   );

//   try {
//     const newConversation = await mongoDb.Conversation.findOneAndUpdate(
//       {
//         participants,
//       },
//       { participants, blackList: [false, false], favoriteList: [false, false] },
//       {
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: true,
//         useFindAndModify: false,
//       }
//     );
//     const message = new mongoDb.Message({
//       sender: userId,
//       body: messageBody,
//       conversation: newConversation._id,
//     });
//     await message.save();
//     message._doc.participants = participants;
//     const interlocutorId = participants.filter(
//       participant => participant !== userId
//     )[0];
//     const preview = {
//       _id: newConversation._id,
//       sender: userId,
//       text: messageBody,
//       createAt: message.createdAt,
//       participants,
//       blackList: newConversation.blackList,
//       favoriteList: newConversation.favoriteList,
//     };
//     controller.getChatController().emitNewMessage(interlocutorId, {
//       message,
//       preview: {
//         _id: newConversation._id,
//         sender: userId,
//         text: messageBody,
//         createAt: message.createdAt,
//         participants,
//         blackList: newConversation.blackList,
//         favoriteList: newConversation.favoriteList,
//         interlocutor: {
//           id: userId,
//           firstName: firstName,
//           lastName: lastName,
//           displayName: displayName,
//           avatar: avatar,
//           email: email,
//         },
//       },
//     });
//     res.send({
//       message,
//       preview: Object.assign(preview, { interlocutor: interlocutor }),
//     });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.addMessage = async (req, res, next) => {
  const {
    tokenData: { userId, firstName, lastName, displayName, avatar, email },
    body: { recipient, messageBody, interlocutor },
  } = req;

  const transaction = await db.sequelize.transaction();

  try {
    const conversation = await db.Conversation.findOne({
      include: [
        {
          model: db.Participant,
          attributes: [],
          where: { userId: [userId, recipient] },
          required: true,
        },
      ],
      group: ['Conversation.id'],
      subQuery: false,
      having: db.sequelize.literal(
        `COUNT(DISTINCT "Participants"."userId") = 2`
      ),
      transaction,
    });

    let currentConversationId;

    if (!conversation) {
      const newConv = await db.Conversation.create({}, { transaction });
      await db.Participant.bulkCreate(
        [
          { conversationId: newConv.id, userId: userId },
          { conversationId: newConv.id, userId: recipient },
        ],
        { transaction }
      );
      currentConversationId = newConv.id;
    } else {
      currentConversationId = conversation.id;
    }

    const newMessage = await db.Message.create(
      {
        senderId: userId,
        body: messageBody,
        conversationId: currentConversationId,
      },
      { transaction }
    );

    await transaction.commit();

    const participantsData = await db.Participant.findAll({
      where: { conversationId: currentConversationId },
      order: [['userId', 'ASC']],
    });

    const participantsIds = participantsData.map(p => Number(p.userId));

    const preview = {
      _id: currentConversationId,
      sender: userId,
      text: messageBody,
      createAt: newMessage.createdAt,
      participants: participantsIds,
      blackList: participantsData.map(p => p.isBlacklisted),
      favoriteList: participantsData.map(p => p.isFavorite),
    };

    controller.getChatController().emitNewMessage(recipient, {
      message: newMessage,
      preview: {
        ...preview,
        interlocutor: {
          id: userId,
          firstName,
          lastName,
          displayName,
          avatar,
          email,
        },
      },
    });

    res.send({
      message: newMessage,
      preview: { ...preview, interlocutor },
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// module.exports.getChat = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { interlocutorId },
//   } = req;

//   const participants = [userId, interlocutorId].sort((a, b) => a - b);

//   try {
//     const messages = await mongoDb.Message.aggregate([
//       {
//         $lookup: {
//           from: 'conversations',
//           localField: 'conversation',
//           foreignField: '_id',
//           as: 'conversationData',
//         },
//       },
//       { $match: { 'conversationData.participants': participants } },
//       { $sort: { createdAt: 1 } },
//       {
//         $project: {
//           _id: 1,
//           sender: 1,
//           body: 1,
//           conversation: 1,
//           createdAt: 1,
//           updatedAt: 1,
//         },
//       },
//     ]);

//     const interlocutor = await userQueries.findUser({ id: interlocutorId });

//     res.send({
//       messages,
//       interlocutor: (({ firstName, lastName, displayName, id, avatar }) => ({
//         firstName,
//         lastName,
//         displayName,
//         id,
//         avatar,
//       }))(interlocutor),
//     });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.getChat = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { interlocutorId },
  } = req;

  try {
    const conversations = await db.Conversation.findAll({
      include: [
        {
          model: db.Participant,
          where: { userId: [userId, interlocutorId] },
          attributes: ['userId'],
        },
      ],
    });

    const conversation = conversations.find(conv => {
      const ids = conv.Participants.map(p => p.userId);
      return (
        ids.length === 2 &&
        ids.includes(userId) &&
        ids.includes(Number(interlocutorId))
      );
    });

    let messages = [];
    let chatData = null;

    if (conversation) {
      messages = await db.Message.findAll({
        where: { conversationId: conversation.id },
        order: [['createdAt', 'ASC']],
      });

      const participantsData = await db.Participant.findAll({
        where: { conversationId: conversation.id },
        order: [['userId', 'ASC']],
      });

      chatData = {
        _id: conversation.id,
        participants: participantsData.map(p => p.userId),
        blackList: participantsData.map(p => p.isBlacklisted),
        favoriteList: participantsData.map(p => p.isFavorite),
      };
    }

    const interlocutor = await db.Users.findByPk(interlocutorId, {
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    const safeInterlocutor = interlocutor
      ? interlocutor.toJSON()
      : {
          id: interlocutorId,
          firstName: 'Deleted',
          lastName: 'User',
          displayName: 'Deleted User',
          avatar: 'anon.png',
        };

    res.send({
      messages,
      interlocutor: safeInterlocutor,
      chatData,
    });
  } catch (err) {
    next(err);
  }
};

// module.exports.getPreview = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//   } = req;

//   try {
//     const conversations = await mongoDb.Message.aggregate([
//       {
//         $lookup: {
//           from: 'conversations',
//           localField: 'conversation',
//           foreignField: '_id',
//           as: 'conversationData',
//         },
//       },
//       { $unwind: '$conversationData' },
//       { $match: { 'conversationData.participants': userId } },
//       { $sort: { createdAt: -1 } },
//       {
//         $group: {
//           _id: '$conversationData._id',
//           sender: { $first: '$sender' },
//           text: { $first: '$body' },
//           createAt: { $first: '$createdAt' },
//           participants: { $first: '$conversationData.participants' },
//           blackList: { $first: '$conversationData.blackList' },
//           favoriteList: { $first: '$conversationData.favoriteList' },
//         },
//       },
//     ]);

//     const interlocutors = conversations.map(conv =>
//       conv.participants.find(p => p !== userId)
//     );

//     const senders = await db.Users.findAll({
//       where: { id: interlocutors },
//       attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
//     });

//     conversations.forEach(conv => {
//       const senderData = senders.find(s =>
//         conv.participants.includes(s.dataValues.id)
//       );
//       if (senderData) {
//         const { id, firstName, lastName, displayName, avatar } =
//           senderData.dataValues;
//         conv.interlocutor = { id, firstName, lastName, displayName, avatar };
//       }
//     });

//     res.send(conversations);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.getPreview = async (req, res, next) => {
  const { userId } = req.tokenData;

  try {
    const conversations = await db.Conversation.findAll({
      include: [
        {
          model: db.Participant,
          where: { userId },
          attributes: ['isBlacklisted', 'isFavorite'],
          required: true,
        },
        {
          model: db.Participant,
          as: 'AllParticipants',
          attributes: ['userId'],
        },
        {
          model: db.Message,
          attributes: ['body', 'senderId', 'createdAt'],
        },
      ],
      order: [[{ model: db.Message }, 'createdAt', 'DESC']],
    });

    const interlocutorIds = new Set();
    conversations.forEach(conv => {
      if (conv.AllParticipants) {
        conv.AllParticipants.forEach(p => {
          if (p.userId !== userId) interlocutorIds.add(p.userId);
        });
      }
    });

    let users = [];
    if (interlocutorIds.size > 0) {
      users = await db.Users.findAll({
        where: { id: Array.from(interlocutorIds) },
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
      });
    }

    const result = conversations.map(conv => {
      const lastMsg =
        conv.Messages && conv.Messages.length > 0 ? conv.Messages[0] : {};
      const mySettings =
        conv.Participants && conv.Participants[0] ? conv.Participants[0] : {};
      const participantsIds = conv.AllParticipants
        ? conv.AllParticipants.map(p => p.userId)
        : [];

      const interlocutorId = participantsIds.find(id => id !== userId);
      const userData = users.find(u => u.id === interlocutorId);

      return {
        _id: conv.id,
        sender: lastMsg.senderId || null,
        text: lastMsg.body || '',
        createAt: lastMsg.createdAt || null,
        participants: participantsIds,
        blackList: participantsIds.map(id =>
          id === userId ? !!mySettings.isBlacklisted : false
        ),
        favoriteList: participantsIds.map(id =>
          id === userId ? !!mySettings.isFavorite : false
        ),
        interlocutor: userData
          ? {
              id: userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              displayName: userData.displayName,
              avatar: userData.avatar,
            }
          : {
              id: interlocutorId,
              firstName: 'User',
              lastName: '',
              displayName: 'User',
              avatar: 'anon.png',
            },
      };
    });

    res.send(result);
  } catch (err) {
    next(err);
  }
};

// module.exports.blackList = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { participants, blackListFlag },
//   } = req;

//   const predicate = `blackList.${participants.indexOf(userId)}`;

//   try {
//     const chat = await mongoDb.Conversation.findOneAndUpdate(
//       { participants },
//       { $set: { [predicate]: blackListFlag } },
//       { new: true }
//     );

//     res.send(chat);

//     const interlocutorId = participants.find(p => p !== userId);
//     controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
//   } catch (err) {
//     res.send(err);
//   }
// };

module.exports.blackList = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { conversationId, blackListFlag, participants },
  } = req;

  try {
    let targetConversationId = conversationId;

    if (!targetConversationId && participants) {
      const conversation = await db.Conversation.findOne({
        include: [
          {
            model: db.Participant,
            attributes: [],
            where: { userId: participants },
            required: true,
          },
        ],
        group: ['Conversation.id'],
        subQuery: false,
        having: db.sequelize.literal(
          `COUNT(DISTINCT "Participants"."userId") = ${participants.length}`
        ),
      });
      targetConversationId = conversation ? conversation.id : null;
    }

    if (!targetConversationId) {
      return res.status(404).send('Conversation not found');
    }

    await db.Participant.update(
      { isBlacklisted: blackListFlag },
      {
        where: {
          userId: userId,
          conversationId: targetConversationId,
        },
      }
    );

    const updatedChat = await db.Conversation.findByPk(targetConversationId, {
      include: [{ model: db.Participant }],
    });

    const chatData = {
      _id: updatedChat.id,
      participants: updatedChat.Participants.map(p => p.userId),
      blackList: updatedChat.Participants.map(p => p.isBlacklisted),
      favoriteList: updatedChat.Participants.map(p => p.isFavorite),
    };

    res.send(chatData);

    const interlocutor = updatedChat.Participants.find(
      p => p.userId !== userId
    );
    if (interlocutor) {
      controller
        .getChatController()
        .emitChangeBlockStatus(interlocutor.userId, chatData);
    }
  } catch (err) {
    next(err);
  }
};

// module.exports.favoriteChat = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { participants, favoriteFlag },
//   } = req;

//   const predicate = `favoriteList.${participants.indexOf(userId)}`;

//   try {
//     const chat = await mongoDb.Conversation.findOneAndUpdate(
//       { participants },
//       { $set: { [predicate]: favoriteFlag } },
//       { new: true }
//     );
//     res.send(chat);
//   } catch (err) {
//     res.send(err);
//   }
// };

module.exports.favoriteChat = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { conversationId, favoriteFlag, participants },
  } = req;

  try {
    let targetConversationId = conversationId;

    if (!targetConversationId && participants) {
      const conversation = await db.Conversation.findOne({
        include: [
          {
            model: db.Participant,
            attributes: [],
            where: { userId: participants },
            required: true,
          },
        ],
        group: ['Conversation.id'],
        subQuery: false,
        having: db.sequelize.literal(
          `COUNT(DISTINCT "Participants"."userId") = ${participants.length}`
        ),
      });
      targetConversationId = conversation ? conversation.id : null;
    }

    if (!targetConversationId) {
      return res.status(404).send('Conversation not found');
    }

    await db.Participant.update(
      { isFavorite: favoriteFlag },
      {
        where: {
          userId: userId,
          conversationId: targetConversationId,
        },
      }
    );

    const updatedChat = await db.Conversation.findByPk(targetConversationId, {
      include: [{ model: db.Participant }],
    });

    const chatData = {
      _id: updatedChat.id,
      participants: updatedChat.Participants.map(p => p.userId),
      blackList: updatedChat.Participants.map(p => p.isBlacklisted),
      favoriteList: updatedChat.Participants.map(p => p.isFavorite),
    };

    res.send(chatData);
  } catch (err) {
    next(err);
  }
};

// module.exports.createCatalog = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { catalogName, chatId },
//   } = req;

//   try {
//     const catalog = new mongoDb.Catalog({
//       userId,
//       catalogName,
//       chats: [chatId],
//     });
//     await catalog.save();
//     res.send(catalog);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.createCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogName, chatId },
  } = req;

  const transaction = await db.sequelize.transaction();

  try {
    const catalog = await db.Catalog.create(
      {
        userId,
        catalogName,
      },
      { transaction }
    );

    await db.CatalogChat.create(
      {
        catalogId: catalog.id,
        conversationId: chatId,
      },
      { transaction }
    );

    await transaction.commit();

    const result = {
      _id: catalog.id,
      userId: catalog.userId,
      catalogName: catalog.catalogName,
      chats: [chatId],
    };

    res.send(result);
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// module.exports.updateNameCatalog = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { catalogId, catalogName },
//   } = req;

//   try {
//     const catalog = await mongoDb.Catalog.findOneAndUpdate(
//       { _id: catalogId, userId },
//       { catalogName },
//       { new: true }
//     );
//     res.send(catalog);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.updateNameCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId, catalogName },
  } = req;

  try {
    const [updatedCount] = await db.Catalog.update(
      { catalogName },
      {
        where: {
          id: catalogId,
          userId: userId,
        },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).send('Catalog not found or access denied');
    }

    const updatedCatalog = await db.Catalog.findOne({
      where: { id: catalogId },
      include: [
        {
          model: db.Conversation,
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    const catalogData = updatedCatalog.toJSON();
    const result = {
      _id: catalogData.id,
      catalogName: catalogData.catalogName,
      chats: catalogData.Conversations.map(c => c.id),
    };

    res.send(result);
  } catch (err) {
    next(err);
  }
};

// module.exports.addNewChatToCatalog = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { catalogId, chatId },
//   } = req;

//   try {
//     const catalog = await mongoDb.Catalog.findOneAndUpdate(
//       { _id: catalogId, userId },
//       { $addToSet: { chats: chatId } },
//       { new: true }
//     );
//     res.send(catalog);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.addNewChatToCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId, chatId },
  } = req;

  try {
    if (!catalogId || isNaN(parseInt(catalogId))) {
      return res.status(400).send('Invalid Catalog ID');
    }

    const catalog = await db.Catalog.findOne({
      where: {
        id: parseInt(catalogId),
        userId: userId,
      },
    });

    if (!catalog) {
      return res.status(404).send('Catalog not found');
    }

    await db.CatalogChat.findOrCreate({
      where: {
        catalogId: parseInt(catalogId),
        conversationId: parseInt(chatId),
      },
    });

    const updatedCatalog = await db.Catalog.findOne({
      where: { id: parseInt(catalogId) },
      include: [
        {
          model: db.Conversation,
          through: { attributes: [] },
        },
      ],
    });

    const response = updatedCatalog.toJSON();
    response.chats = response.Conversations
      ? response.Conversations.map(c => c.id)
      : [];
    delete response.Conversations;
    response._id = response.id;

    res.send(response);
  } catch (err) {
    next(err);
  }
};

// module.exports.removeChatFromCatalog = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { catalogId, chatId },
//   } = req;

//   try {
//     const catalog = await mongoDb.Catalog.findOneAndUpdate(
//       { _id: catalogId, userId },
//       { $pull: { chats: chatId } },
//       { new: true }
//     );
//     res.send(catalog);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.removeChatFromCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId, chatId },
  } = req;

  try {
    const catalog = await db.Catalog.findOne({
      where: { id: catalogId, userId },
    });

    if (!catalog) {
      return res.status(404).send('Catalog not found or access denied');
    }

    await db.CatalogChat.destroy({
      where: {
        catalogId: catalogId,
        conversationId: chatId,
      },
    });

    const updatedCatalog = await db.Catalog.findOne({
      where: { id: catalogId },
      include: [
        {
          model: db.Conversation,
          through: { attributes: [] },
        },
      ],
    });

    const response = updatedCatalog.toJSON();
    response.chats = response.Conversations
      ? response.Conversations.map(c => c.id)
      : [];
    delete response.Conversations;

    res.send(response);
  } catch (err) {
    next(err);
  }
};

// module.exports.deleteCatalog = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//     body: { catalogId },
//   } = req;

//   try {
//     await mongoDb.Catalog.deleteOne({ _id: catalogId, userId });
//     res.end();
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.deleteCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogId },
  } = req;

  try {
    const deletedRows = await db.Catalog.destroy({
      where: {
        id: catalogId,
        userId: userId,
      },
    });

    if (deletedRows === 0) {
      return res.status(404).send('Catalog not found or access denied');
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// module.exports.getCatalogs = async (req, res, next) => {
//   const {
//     tokenData: { userId },
//   } = req;

//   try {
//     const catalogs = await mongoDb.Catalog.aggregate([
//       { $match: { userId } },
//       { $project: { _id: 1, catalogName: 1, chats: 1 } },
//     ]);
//     res.send(catalogs);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.getCatalogs = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const catalogs = await db.Catalog.findAll({
      where: { userId },
      attributes: ['id', 'catalogName'],
      include: [
        {
          model: db.Conversation,
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    const formattedCatalogs = catalogs.map(catalog => {
      const catalogData = catalog.toJSON();

      return {
        _id: catalogData.id,
        catalogName: catalogData.catalogName,
        chats: catalogData.Conversations.map(chat => chat.id),
      };
    });

    res.send(formattedCatalogs);
  } catch (err) {
    next(err);
  }
};
