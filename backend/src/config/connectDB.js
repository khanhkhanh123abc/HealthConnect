const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger').default || require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'khankhank', 
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00',
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
  } catch (error) {
    logger.error({ err: error }, 'Unable to connect to the database');
  }
}

module.exports = connectDB;