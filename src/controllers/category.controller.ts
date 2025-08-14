import { Context } from 'hono';
import { CategoryService } from '../services/category.service';
import { ApiResponse } from '../types';

const categoryService = new CategoryService();

export class CategoryController {
  // GET /api/categories
  async getCategories(c: Context) {
    try {
      const result = await categoryService.getCategories();

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

  // GET /api/categories/with-count
  async getCategoriesWithCount(c: Context) {
    try {
      const result = await categoryService.getCategoriesWithCount();

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

  // GET /api/categories/:slug
  async getCategoryBySlug(c: Context) {
    try {
      const slug = c.req.param('slug');
      const result = await categoryService.getCategoryBySlug(slug);

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

  // POST /api/categories
  async createCategory(c: Context) {
    try {
      const body = await c.req.json();
      const result = await categoryService.createCategory(body);

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

  // PUT /api/categories/:id
  async updateCategory(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const body = await c.req.json();
      const result = await categoryService.updateCategory(id, body);

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

  // DELETE /api/categories/:id
  async deleteCategory(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const result = await categoryService.deleteCategory(id);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
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

  // GET /api/categories/popular
  async getPopularCategories(c: Context) {
    try {
      const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 5;
      const result = await categoryService.getPopularCategories(limit);

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
