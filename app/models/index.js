var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(module.filename)
// var env = process.env.NODE_ENV || 'development'
var env = 'development'
var config = require(__dirname + '/../config/config.json')[env]
var db = {}

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename)
  })
  .forEach(function (file) {
    if (file.slice(-3) !== '.js') return
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

// TODO : refactoring codes on my own
// var fs = require('fs')
// var path = require('path')
// var db = {}

// // Start Sequelize Database connection
// var Sequelize = require('sequelize')
// var config = fs.readFileSync(path.join(__dirname + '/../config/config.json'), 'utf-8')
// var env = JSON.parse(config).development // TODO : change environment from development only to production/staging/development
// var sequelize = new Sequelize(env.database, env.username, env.password, {
//   host: env.host,
//   dialect: env.dialect
// })

// db.sequelize = sequelize
// db.Sequelize = Sequelize

// module.exports = db

// // Load All model files into one
// var regex = new RegExp('(?:(?!-min)[\w-]{4}|^[\w-]{1,3})\.js$') // TODO : refactor regex pattern
// var models = fs.readdirSync(__dirname).filter(model => model.match(regex) && model != __filename)
