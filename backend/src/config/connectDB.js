const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger').default || require('../utils/logger');

const useSSL = process.env.DB_SSL === 'true' || /[?&]ssl-mode=REQUIRED/i.test(process.env.DATABASE_URL || '');
const dialectOptions = useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {};

let sequelize;
if (process.env.DATABASE_URL) {
  const cleanUrl = process.env.DATABASE_URL.replace(/\?.*$/, '');
  sequelize = new Sequelize(cleanUrl, {
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00',
    dialectOptions
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'khankhank',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || null,
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      timezone: '+07:00',
      dialectOptions
    }
  );
}

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
  } catch (error) {
    logger.error({ err: error }, 'Unable to connect to the database');
  }
}

module.exports = connectDB;
