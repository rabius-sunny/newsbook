import { Hono } from 'hono';
import { checkDatabaseConnection } from '../db/index';
import { ApiResponse, HealthCheckResult } from '../types/common';

const health = new Hono();

health.get('/', async (c) => {
  const startTime = Date.now();

  try {
    // Check database connectivity
    const isDatabaseConnected = await checkDatabaseConnection();

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const healthData: HealthCheckResult = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: isDatabaseConnected ? 'connected' : 'disconnected',
      version: '1.0.0',
      responseTime
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
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'disconnected',
      version: '1.0.0',
      responseTime
    };

    const response: ApiResponse<HealthCheckResult> = {
      success: false,
      message: 'Service is unhealthy',
      data: healthData,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };

    return c.json(response, 503);
  }
});

export { health as healthRoutes };
