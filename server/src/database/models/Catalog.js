module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define(
    'Catalog',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      catalogName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Catalog.associate = models => {
    Catalog.belongsToMany(models.Conversation, {
      through: 'CatalogChats',
      foreignKey: 'catalogId',
      otherKey: 'conversationId',
    });
  };

  return Catalog;
};
