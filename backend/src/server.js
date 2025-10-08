import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDatabase, initializeIndexes } from './config/database-postgres.js';
import { logger } from './utils/logger.js';

// Import models to initialize associations (only when database is available)
// import './models/index-postgres.js';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import defectRoutes from './routes/defects.js';
import mockDataRoutes from './routes/mock-data.js';

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection flag
let isDatabaseConnected = false;

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/defects', defectRoutes);

// Mock data routes (fallback when database is not available)
app.use('/api', mockDataRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Defect Tracker API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: isDatabaseConnected ? 'connected' : 'disconnected',
    mode: isDatabaseConnected ? 'production' : 'development'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Error occurred:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server startup
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  
  try {
    // Try to connect to database
    await connectDatabase();
    await initializeIndexes();
    isDatabaseConnected = true;
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} with PostgreSQL`);
      console.log(`🚀 Defect Tracker API running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`✅ PostgreSQL database connected`);
    });
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    
    // Запускаем без БД для разработки
    logger.info('Starting server without database for development...');
    isDatabaseConnected = false;
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} (development mode - no database)`);
      console.log(`🚀 Defect Tracker API running on http://localhost:${PORT} (Development Mode)`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`⚠️  Database not connected - using mock data for development`);
      console.log(`📱 Frontend can connect to http://localhost:${PORT}/api`);
    });
  }
};

startServer();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});