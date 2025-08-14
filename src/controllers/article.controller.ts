import { Context } from 'hono';
import { ArticleService } from '../services/article.service';
import { ApiResponse, SearchParams, ArticleFilters } from '../types';

const articleService = new ArticleService();

export class ArticleController {
  // GET /api/articles
  async getArticles(c: Context) {
    try {
      const query = c.req.query();
      const filters: SearchParams & ArticleFilters = {
        page: parseInt(query.page as string) || 1,
        limit: parseInt(query.limit as string) || 20,
        query: query.q as string,
        categoryId: query.category
          ? parseInt(query.category as string)
          : undefined,
        authorId: query.author ? parseInt(query.author as string) : undefined,
        status: query.status as string,
        isPublished:
          query.published === 'true'
            ? true
            : query.published === 'false'
            ? false
            : undefined,
        isFeatured:
          query.featured === 'true'
            ? true
            : query.featured === 'false'
            ? false
            : undefined,
        isBreaking:
          query.breaking === 'true'
            ? true
            : query.breaking === 'false'
            ? false
            : undefined,
        sortBy: (query.sortBy as string) || 'publishedAt',
        sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await articleService.getArticles(filters);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: result.data,
        errors: result.errors,
        meta: result.data
          ? {
              page: result.data.page,
              limit: result.data.limit,
              total: result.data.total,
              totalPages: result.data.totalPages
            }
          : undefined
      };

      return c.json(response, result.success ? 200 : 400);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }

  // GET /api/articles/:slug
  async getArticleBySlug(c: Context) {
    try {
      const slug = c.req.param('slug');
      const result = await articleService.getArticleBySlug(slug);

      // Increment view count if article found
      if (result.success && result.data) {
        await articleService.incrementViewCount(result.data.id);
      }

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: result.data,
        errors: result.errors
      };

      return c.json(response, result.success ? 200 : 404);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }

  // POST /api/articles
  async createArticle(c: Context) {
    try {
      const body = await c.req.json();
      const result = await articleService.createArticle(body);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: result.data,
        errors: result.errors
      };

      return c.json(response, result.success ? 201 : 400);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }

  // PUT /api/articles/:id
  async updateArticle(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const body = await c.req.json();
      const result = await articleService.updateArticle(id, body);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: result.data,
        errors: result.errors
      };

      return c.json(response, result.success ? 200 : 400);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }

  // DELETE /api/articles/:id
  async deleteArticle(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const result = await articleService.deleteArticle(id);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        errors: result.errors
      };

      return c.json(response, result.success ? 200 : 404);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }

  // GET /api/articles/featured
  async getFeaturedArticles(c: Context) {
    try {
      const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 5;
      const result = await articleService.getFeaturedArticles(limit);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: result.data,
        errors: result.errors
      };

      return c.json(response, result.success ? 200 : 400);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }

  // GET /api/articles/breaking
  async getBreakingNews(c: Context) {
    try {
      const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 3;
      const result = await articleService.getBreakingNews(limit);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: result.data,
        errors: result.errors
      };

      return c.json(response, result.success ? 200 : 400);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }

  // GET /api/categories/:slug/articles
  async getArticlesByCategory(c: Context) {
    try {
      const categorySlug = c.req.param('slug');
      const query = c.req.query();

      const params: SearchParams = {
        page: query.page ? parseInt(query.page) : 1,
        limit: query.limit ? parseInt(query.limit) : 10,
        query: query.q || query.query,
        sortBy: query.sortBy || 'publishedAt',
        sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await articleService.getArticlesByCategory(
        categorySlug,
        params
      );

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: result.data,
        errors: result.errors,
        meta: result.data
          ? {
              page: result.data.page,
              limit: result.data.limit,
              total: result.data.total,
              totalPages: result.data.totalPages
            }
          : undefined
      };

      return c.json(response, result.success ? 200 : 404);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Internal server error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      return c.json(response, 500);
    }
  }
}
