'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Records', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        models: 'Users',
        key: 'Id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Records', 'UserId');
  }
};
