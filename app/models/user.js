module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    licenseNumber: DataTypes.STRING,
    password: DataTypes.STRING // TODO : refactoring password => password(virtual)/password_digest(string) using BCrypt
  }, {})
  User.associate = function (models) {
    User.hasOne(models.Account)
  }
  return User
}
