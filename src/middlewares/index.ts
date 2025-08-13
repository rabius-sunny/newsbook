import { Context, Next } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { ApiResponse } from '../types/common';
import config from '../config/app';

// CORS middleware
export const corsMiddleware = cors({
  origin: config.cors.origins,
  credentials: config.cors.credentials,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

// Security headers middleware
export const securityMiddleware = secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"]
  },
  crossOriginEmbedderPolicy: false // Disable for API
});

// Request logging middleware
export const requestLogger = logger((message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
});

// Rate limiting middleware (simple in-memory implementation)
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> =
    new Map();

  middleware = async (c: Context, next: Next) => {
    const clientId =
      c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowMs = config.rateLimit.windowMs;
    const maxRequests = config.rateLimit.maxRequests;

    let clientData = this.requests.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 1,
        resetTime: now + windowMs
      };
    } else {
      clientData.count++;
    }

    this.requests.set(clientId, clientData);

    if (clientData.count > maxRequests) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Too many requests. Please try again later.'
      };
      return c.json(response, 429);
    }

    // Set rate limit headers
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header(
      'X-RateLimit-Remaining',
      (maxRequests - clientData.count).toString()
    );
    c.header('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());

    await next();
  };

  // Clean up expired entries periodically
  cleanup() {
    const now = Date.now();
    const entriesToDelete: string[] = [];

    this.requests.forEach((data, clientId) => {
      if (now > data.resetTime) {
        entriesToDelete.push(clientId);
      }
    });

    entriesToDelete.forEach((clientId) => {
      this.requests.delete(clientId);
    });
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup rate limiter every 10 minutes
setInterval(() => rateLimiter.cleanup(), 10 * 60 * 1000);

// Request validation middleware
export const validateContentType = (requiredType = 'application/json') => {
  return async (c: Context, next: Next) => {
    const method = c.req.method;

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = c.req.header('content-type');

      if (!contentType || !contentType.includes(requiredType)) {
        const response: ApiResponse<null> = {
          success: false,
          message: `Content-Type must be ${requiredType}`
        };
        return c.json(response, 400);
      }
    }

    await next();
  };
};

// Error boundary middleware
export const errorBoundary = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error('Unhandled error:', error);

    const response: ApiResponse<null> = {
      success: false,
      message: 'Internal server error'
    };

    return c.json(response, 500);
  }
};

// Request ID middleware
export const requestId = async (c: Context, next: Next) => {
  const id = crypto.randomUUID();
  c.set('requestId', id);
  c.header('X-Request-ID', id);
  await next();
};
