module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CatalogChats', {
      catalogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Conversations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CatalogChats');
  },
};
