'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Incomes', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        models: 'Users',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Incomes', 'UserId');
  }
};
