import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDatabase, initializeIndexes } from './config/database-postgres.js';
import { logger } from './utils/logger.js';

// Import models to initialize associations
import './models/index-postgres.js';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import defectRoutes from './routes/defects.js';

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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/defects', defectRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Defect Tracker API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
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
  try {
    // Connect to database
    await connectDatabase();
    await initializeIndexes();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`🚀 Defect Tracker API running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    // Запускаем без БД для разработки
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} (without database)`);
      console.log(`🚀 Defect Tracker API running on http://localhost:${PORT} (no DB)`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
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