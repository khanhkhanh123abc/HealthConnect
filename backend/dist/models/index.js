'use strict';

require('dotenv').config();
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var process = require('process');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};
var sequelize;
var hasDbEnv = !!(process.env.DATABASE_URL || process.env.DB_HOST);
if (env === 'production' || hasDbEnv) {
  var useSSL = process.env.DB_SSL === 'true' || /[?&]ssl-mode=REQUIRED/i.test(process.env.DATABASE_URL || '') || env === 'production';
  var sslOptions = useSSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {};
  if (process.env.DATABASE_URL) {
    var cleanUrl = process.env.DATABASE_URL.replace(/\?.*$/, '');
    sequelize = new Sequelize(cleanUrl, {
      dialect: 'mysql',
      logging: false,
      timezone: '+07:00',
      dialectOptions: sslOptions
    });
  } else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      dialect: 'mysql',
      logging: false,
      timezone: '+07:00',
      dialectOptions: sslOptions
    });
  }
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1;
}).forEach(function (file) {
  var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;