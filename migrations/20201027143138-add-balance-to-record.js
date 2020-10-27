'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('records', 'balance', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('records', 'balance');
  }
};
