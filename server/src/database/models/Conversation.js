module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'Conversation',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Conversation.associate = models => {
    Conversation.hasMany(models.Message, { foreignKey: 'conversationId' });
    Conversation.hasMany(models.Participant, { foreignKey: 'conversationId' });
    Conversation.hasMany(models.Participant, {
      foreignKey: 'conversationId',
      as: 'AllParticipants',
    });
  };

  return Conversation;
};
