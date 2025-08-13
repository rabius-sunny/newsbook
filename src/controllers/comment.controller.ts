import { Context } from 'hono';
import { CommentService } from '../services/comment.service';
import { ApiResponse, SearchParams, CommentFilters } from '../types';

const commentService = new CommentService();

export class CommentController {
  // GET /api/comments
  async getComments(c: Context) {
    try {
      const query = c.req.query();
      const params: SearchParams & CommentFilters = {
        page: query.page ? parseInt(query.page) : 1,
        limit: query.limit ? parseInt(query.limit) : 20,
        articleId: query.articleId,
        isApproved:
          query.approved === 'true'
            ? true
            : query.approved === 'false'
            ? false
            : undefined,
        isReported:
          query.reported === 'true'
            ? true
            : query.reported === 'false'
            ? false
            : undefined,
        sortBy: query.sortBy || 'createdAt',
        sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await commentService.getComments(params);

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

  // GET /api/articles/:articleId/comments
  async getArticleComments(c: Context) {
    try {
      const articleId = c.req.param('articleId');
      const page = c.req.query('page') ? parseInt(c.req.query('page')!) : 1;
      const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 20;

      const result = await commentService.getArticleComments(
        articleId,
        page,
        limit
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

  // POST /api/comments
  async createComment(c: Context) {
    try {
      const body = await c.req.json();

      // Add IP address and user agent from request
      const commentData = {
        ...body,
        ipAddress:
          c.req.header('x-forwarded-for') ||
          c.req.header('x-real-ip') ||
          'unknown',
        userAgent: c.req.header('user-agent') || 'unknown'
      };

      const result = await commentService.createComment(commentData);

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

  // PUT /api/comments/:id
  async updateComment(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const result = await commentService.updateComment(id, body);

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

  // DELETE /api/comments/:id
  async deleteComment(c: Context) {
    try {
      const id = c.req.param('id');
      const result = await commentService.deleteComment(id);

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

  // POST /api/comments/:id/moderate
  async moderateComment(c: Context) {
    try {
      const id = c.req.param('id');
      const { action, moderatorId } = await c.req.json();

      if (!['approve', 'reject'].includes(action)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid action',
          errors: ['Action must be either approve or reject']
        };
        return c.json(response, 400);
      }

      const result = await commentService.moderateComment(
        id,
        action,
        moderatorId
      );

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

  // POST /api/comments/:id/report
  async reportComment(c: Context) {
    try {
      const id = c.req.param('id');
      const result = await commentService.reportComment(id);

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

  // GET /api/comments/pending
  async getPendingComments(c: Context) {
    try {
      const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 50;
      const result = await commentService.getPendingComments(limit);

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
}
