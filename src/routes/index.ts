import { Hono } from 'hono';
import { articleRoutes } from './articles';
import { categoryRoutes } from './categories';
import { commentRoutes } from './comments';
import { healthRoutes } from './health';

const api = new Hono();

// Mount all routes
api.route('/health', healthRoutes);
api.route('/articles', articleRoutes);
api.route('/categories', categoryRoutes);
api.route('/comments', commentRoutes);

// Root endpoint
api.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Bengali News Paper API v1.0.0',
    data: {
      name: 'Bengali News Paper API',
      version: '1.0.0',
      description:
        'Traditional Bengali newspaper backend API similar to Prothom Alo',
      endpoints: {
        health: '/api/health',
        articles: '/api/articles',
        categories: '/api/categories',
        comments: '/api/comments'
      },
      documentation: 'https://github.com/your-repo/news-paper'
    }
  });
});

export { api };
