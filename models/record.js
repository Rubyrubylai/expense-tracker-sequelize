'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Record.belongsTo(models.User)
    }
  };
  Record.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    category: DataTypes.STRING,
    date: DataTypes.DATE,
    balance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Record',
  });
  return Record;
};