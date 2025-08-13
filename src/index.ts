import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { api } from './routes';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://your-frontend-domain.com'
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Global error handler
app.onError((err, c) => {
  console.error('Application error:', err);
  return c.json(
    {
      success: false,
      message: 'Internal server error',
      errors: [err.message]
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: 'Endpoint not found',
      errors: ['The requested resource does not exist']
    },
    404
  );
});

// Mount API routes
app.route('/api', api);

// Root welcome message
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to Bengali News Paper API! 🗞️📰',
    data: {
      name: 'Bengali News Paper',
      description:
        'Traditional Bengali newspaper backend API similar to Prothom Alo',
      version: '1.0.0',
      api_docs: '/api',
      health_check: '/api/health',
      features: [
        'Article management with Bengali support',
        'Category hierarchy',
        'Comment system with moderation',
        'Tag-based organization',
        'Breaking news support',
        'Featured articles',
        'Analytics tracking',
        'SEO optimization'
      ]
    }
  });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`🚀 Bengali News Paper API is starting...`);
console.log(`📡 Server will run at http://localhost:${port}`);
console.log(`📊 Health check: http://localhost:${port}/api/health`);
console.log(`📖 API documentation: http://localhost:${port}/api`);

export default {
  port,
  fetch: app.fetch
};
