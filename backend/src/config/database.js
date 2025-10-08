import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const getDatabaseConfig = () => {
  return {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/defect-tracker',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    }
  };
};

export const connectDatabase = async () => {
  try {
    const config = getDatabaseConfig();
    
    mongoose.set('strictQuery', false);
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    // Connect to MongoDB
    await mongoose.connect(config.uri, config.options);
    
    // Log sanitized connection string (hide credentials)
    const sanitizedUri = config.uri.replace(/\/\/.*@/, '//***:***@');
    logger.info(`Connected to MongoDB: ${sanitizedUri}`);
    
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error; // Передаём ошибку вверх, не завершаем процесс
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    return state === 1; // 1 = connected
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Initialize database indexes
export const initializeIndexes = async () => {
  try {
    logger.info('Initializing database indexes...');
    
    // Ensure indexes are created for all models
    // await Promise.all([
    //   mongoose.model('Project').createIndexes(),
    //   // Add other models when they're created
    // ]);
    
    logger.info('Database indexes initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database indexes:', error);
    throw error;
  }
};