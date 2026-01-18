module.exports = (sequelize, DataTypes) => {
  const CatalogChat = sequelize.define(
    'CatalogChat',
    {
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return CatalogChat;
};
