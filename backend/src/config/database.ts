import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const config: DatabaseConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/defect-tracker',
    options: {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority',
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    }
  };

  return config;
};

export const connectDatabase = async (): Promise<void> => {
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
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const state = mongoose.connection.readyState;
    return state === 1; // 1 = connected
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Initialize database indexes
export const initializeIndexes = async (): Promise<void> => {
  try {
    logger.info('Initializing database indexes...');
    
    // Ensure indexes are created for all models
    await Promise.all([
      mongoose.model('Project').createIndexes(),
      // Add other models when they're created
    ]);
    
    logger.info('Database indexes initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database indexes:', error);
    throw error;
  }
};
