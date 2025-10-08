import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger.js';

// Конфигурация подключения к PostgreSQL
const getDatabaseConfig = () => {
  return {
    database: process.env.DB_NAME || 'defect_tracker',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  };
};

// Создание экземпляра Sequelize
const config = getDatabaseConfig();
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    define: config.define
  }
);

// Подключение к базе данных
export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`✅ Connected to PostgreSQL database: ${config.database}`);
    
    // Синхронизация моделей с базой данных
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('📊 Database models synchronized');
    }
    
  } catch (error) {
    logger.error('❌ Failed to connect to PostgreSQL:', error);
    throw error;
  }
};

// Закрытие соединения
export const disconnectDatabase = async () => {
  try {
    await sequelize.close();
    logger.info('🔒 PostgreSQL connection closed');
  } catch (error) {
    logger.error('Error closing PostgreSQL connection:', error);
    throw error;
  }
};

// Проверка здоровья базы данных
export const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Инициализация индексов (будет выполнена через Sequelize модели)
export const initializeIndexes = async () => {
  try {
    logger.info('🔍 Database indexes will be created through Sequelize models');
  } catch (error) {
    logger.error('Failed to initialize database indexes:', error);
    throw error;
  }
};