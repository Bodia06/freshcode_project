const db = require('../database/models');
const controller = require('../socketInit');

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

module.exports.getPreview = async (req, res, next) => {
  const { userId } = req.tokenData;

  try {
    const userConversations = await db.Conversation.findAll({
      include: [
        {
          model: db.Participant,
          as: 'AllParticipants',
          where: { userId: userId },
          required: true,
        },
        {
          model: db.Message,
          attributes: ['body', 'senderId', 'createdAt'],
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    });

    const interlocutorIds = new Set();
    const result = [];

    for (const conv of userConversations) {
      const allParticipants = await db.Participant.findAll({
        where: { conversationId: conv.id },
        order: [['userId', 'ASC']],
      });

      const currentUserParticipant = allParticipants.find(
        p => p.userId === Number(userId)
      );
      if (!currentUserParticipant) continue;

      const lastMsg = await db.Message.findOne({
        where: { conversationId: conv.id },
        order: [['createdAt', 'DESC']],
      });

      const sortedParticipants = allParticipants.sort(
        (a, b) => a.userId - b.userId
      );
      const participantsIds = sortedParticipants.map(p => p.userId);
      const blackList = sortedParticipants.map(p => !!p.isBlacklisted);
      const favoriteList = sortedParticipants.map(p => !!p.isFavorite);

      const interlocutorId = participantsIds.find(id => id !== Number(userId));

      if (interlocutorId) {
        interlocutorIds.add(interlocutorId);
      }

      result.push({
        _id: conv.id,
        sender: lastMsg ? lastMsg.senderId : null,
        text: lastMsg ? lastMsg.body : '',
        createAt: lastMsg ? lastMsg.createdAt : null,
        participants: participantsIds,
        blackList: blackList,
        favoriteList: favoriteList,
        interlocutor: { id: interlocutorId },
      });
    }

    const users = await db.Users.findAll({
      where: { id: Array.from(interlocutorIds) },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    result.forEach(item => {
      const interlocutorId = item.interlocutor.id;
      const userData = users.find(u => u.id === interlocutorId);

      if (userData) {
        item.interlocutor = {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          avatar: userData.avatar,
        };
      } else {
        item.interlocutor = {
          id: interlocutorId,
          firstName: 'Deleted',
          lastName: 'User',
          displayName: 'Deleted User',
          avatar: 'anon.png',
        };
      }
    });

    result.sort(
      (a, b) => new Date(b.createAt || 0) - new Date(a.createAt || 0)
    );

    res.send(result);
  } catch (err) {
    next(err);
  }
};

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
            where: { userId: participants },
          },
        ],
        group: ['Conversation.id'],
        having: db.sequelize.literal(
          `COUNT(DISTINCT "Participants"."userId") = ${participants.length}`
        ),
      });
      targetConversationId = conversation ? conversation.id : null;
    }

    if (!targetConversationId) return res.status(404).send('Chat not found');

    await db.Participant.update(
      { isBlacklisted: blackListFlag },
      { where: { userId, conversationId: targetConversationId } }
    );

    const updatedParticipants = await db.Participant.findAll({
      where: { conversationId: targetConversationId },
      order: [['userId', 'ASC']],
    });

    const chatData = {
      _id: targetConversationId,
      participants: updatedParticipants.map(p => p.userId),
      blackList: updatedParticipants.map(p => !!p.isBlacklisted),
      favoriteList: updatedParticipants.map(p => !!p.isFavorite),
    };

    res.send(chatData);

    const interlocutor = updatedParticipants.find(p => p.userId !== userId);
    if (interlocutor && controller.getChatController()) {
      controller
        .getChatController()
        .emitChangeBlockStatus(interlocutor.userId, chatData);
    }
  } catch (err) {
    next(err);
  }
};

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
            where: { userId: participants },
          },
        ],
        group: ['Conversation.id'],
        having: db.sequelize.literal(
          `COUNT(DISTINCT "Participants"."userId") = ${participants.length}`
        ),
      });
      targetConversationId = conversation ? conversation.id : null;
    }

    if (!targetConversationId) return res.status(404).send('Chat not found');

    await db.Participant.update(
      { isFavorite: favoriteFlag },
      { where: { userId, conversationId: targetConversationId } }
    );

    const updatedParticipants = await db.Participant.findAll({
      where: { conversationId: targetConversationId },
      order: [['userId', 'ASC']],
    });

    const chatData = {
      _id: targetConversationId,
      participants: updatedParticipants.map(p => p.userId),
      blackList: updatedParticipants.map(p => !!p.isBlacklisted),
      favoriteList: updatedParticipants.map(p => !!p.isFavorite),
    };

    res.send(chatData);
  } catch (err) {
    next(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { catalogName, chatId },
  } = req;

  const transaction = await db.sequelize.transaction();

  try {
    const catalog = await db.Catalog.create(
      { userId, catalogName },
      { transaction }
    );

    const cleanChatId = Number(chatId);

    await db.CatalogChat.create(
      {
        catalogId: catalog.id,
        conversationId: cleanChatId,
      },
      { transaction }
    );

    await transaction.commit();

    res.send({
      _id: catalog.id,
      userId: catalog.userId,
      catalogName: catalog.catalogName,
      chats: [cleanChatId],
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

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

module.exports.addNewChatToCatalog = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { catalogId, chatId } = req.body;

  try {
    const cleanCatalogId = Number(catalogId);
    const cleanChatId = Number(chatId);

    const catalog = await db.Catalog.findOne({
      where: { id: cleanCatalogId, userId },
    });

    if (!catalog) return res.status(404).send('Catalog not found');

    await db.CatalogChat.findOrCreate({
      where: {
        catalogId: cleanCatalogId,
        conversationId: cleanChatId,
      },
    });

    const updatedCatalog = await db.Catalog.findOne({
      where: { id: cleanCatalogId },
      include: [
        {
          model: db.Conversation,
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    const chats = (updatedCatalog.Conversations || []).map(c => c.id);

    res.send({
      _id: updatedCatalog.id,
      catalogName: updatedCatalog.catalogName,
      chats: chats,
    });
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
