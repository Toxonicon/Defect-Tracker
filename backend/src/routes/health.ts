import { Router } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     timestamp:
 *                       type: string
 *                     database:
 *                       type: string
 *                       enum: [connected, disconnected]
 *                     uptime:
 *                       type: number
 *                     version:
 *                       type: string
 */
router.get('/', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    const healthStatus = {
      status: dbHealth ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      database: dbHealth ? 'connected' : 'disconnected',
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    const statusCode = dbHealth ? 200 : 503;
    
    res.status(statusCode).json({
      success: dbHealth,
      data: healthStatus
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
