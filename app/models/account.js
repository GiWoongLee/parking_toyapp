'use strict'
module.exports = (sequelize, DataTypes) => {
  var Account = sequelize.define('Account', {
    address: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {})
  Account.associate = function (models) {
    Account.belongsTo(models.User)
  }
  return Account
}
