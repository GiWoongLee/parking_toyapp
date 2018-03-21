'use strict';
module.exports = (sequelize, DataTypes) => {
  var Account = sequelize.define('Account', {
    address: DataTypes.STRING
  }, {});
  Account.associate = function(models) {
    Account.belongsTo(models.User)
  };
  return Account;
};