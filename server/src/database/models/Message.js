module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Message.associate = models => {
    Message.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
  };

  return Message;
};
