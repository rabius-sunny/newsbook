import { Hono } from 'hono';
import { db } from '../db';
import { ApiResponse, HealthCheckResult } from '../types/common';

const health = new Hono();

health.get('/', async (c) => {
  const startTime = Date.now();

  try {
    // Check database connectivity
    await db.execute('SELECT 1');

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const healthData: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime,
      database: {
        status: 'connected',
        responseTime
      },
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100
      }
    };

    const response: ApiResponse<HealthCheckResult> = {
      success: true,
      message: 'Service is healthy',
      data: healthData
    };

    return c.json(response);
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const healthData: HealthCheckResult = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime,
      database: {
        status: 'disconnected',
        responseTime,
        error:
          error instanceof Error ? error.message : 'Database connection failed'
      },
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100
      }
    };

    const response: ApiResponse<HealthCheckResult> = {
      success: false,
      message: 'Service is unhealthy',
      data: healthData
    };

    return c.json(response, 503);
  }
});

export { health };
