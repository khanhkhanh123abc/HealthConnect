'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
const hasDbEnv = !!(process.env.DATABASE_URL || process.env.DB_HOST);
if (env === 'production' || hasDbEnv) {
  // Prefer DATABASE_URL (also used by sequelize-cli through use_env_variable
  // in config.json); fall back to discrete DB_* variables.
  const useSSL = process.env.DB_SSL === 'true'
    || /[?&]ssl-mode=REQUIRED/i.test(process.env.DATABASE_URL || '')
    || env === 'production';
  const sslOptions = useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {};

  if (process.env.DATABASE_URL) {
    const cleanUrl = process.env.DATABASE_URL.replace(/\?.*$/, '');
    sequelize = new Sequelize(cleanUrl, {
      dialect: 'mysql',
      logging: false,
      timezone: '+07:00',
      dialectOptions: sslOptions
    });
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        dialect: 'mysql',
        logging: false,
        timezone: '+07:00',
        dialectOptions: sslOptions
      }
    );
  }
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
