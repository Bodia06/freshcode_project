module.exports = (sequelize, DataTypes) => {
  const Participant = sequelize.define(
    'Participant',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isBlacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Participant.associate = models => {
    Participant.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
    });
  };

  return Participant;
};
