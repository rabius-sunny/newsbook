import { eq, desc, asc, count, sql } from 'drizzle-orm';
import { db } from '../db/index';
import { categories, articles } from '../db/schemas';
import {
  ServiceResult,
  Category,
  CreateCategory,
  CategoryWithParent,
  CategoryWithArticleCount
} from '../types';

export class CategoryService {
  // Get all categories
  async getCategories(): Promise<ServiceResult<CategoryWithParent[]>> {
    try {
      const categoriesData = await db
        .select()
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.displayOrder), asc(categories.name));

      // Build hierarchy
      const categoryMap = new Map<number, CategoryWithParent>();
      const rootCategories: CategoryWithParent[] = [];

      // First pass: create all categories
      categoriesData.forEach((cat) => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      // Second pass: build hierarchy
      categoriesData.forEach((cat) => {
        const category = categoryMap.get(cat.id)!;

        if (cat.parentId) {
          const parent = categoryMap.get(cat.parentId);
          if (parent) {
            category.parent = parent;
            parent.children = parent.children || [];
            parent.children.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: rootCategories
      };
    } catch (error) {
      console.error('Error getting categories:', error);
      return {
        success: false,
        message: 'Failed to retrieve categories',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get categories with article count
  async getCategoriesWithCount(): Promise<
    ServiceResult<CategoryWithArticleCount[]>
  > {
    try {
      const categoriesData = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          parentId: categories.parentId,
          displayOrder: categories.displayOrder,
          isActive: categories.isActive,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
          articleCount: count(articles.id)
        })
        .from(categories)
        .leftJoin(articles, eq(categories.id, articles.categoryId))
        .where(eq(categories.isActive, true))
        .groupBy(categories.id)
        .orderBy(asc(categories.displayOrder), asc(categories.name));

      return {
        success: true,
        message: 'Categories with counts retrieved successfully',
        data: categoriesData
      };
    } catch (error) {
      console.error('Error getting categories with count:', error);
      return {
        success: false,
        message: 'Failed to retrieve categories',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get single category by slug
  async getCategoryBySlug(
    slug: string
  ): Promise<ServiceResult<CategoryWithParent>> {
    try {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      if (!category) {
        return {
          success: false,
          message: 'Category not found',
          errors: ['Category with this slug does not exist']
        };
      }

      // Get parent if exists
      let parent = null;
      if (category.parentId) {
        const [parentData] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, category.parentId))
          .limit(1);
        parent = parentData || null;
      }

      // Get children
      const children = await db
        .select()
        .from(categories)
        .where(eq(categories.parentId, category.id))
        .orderBy(asc(categories.displayOrder), asc(categories.name));

      const categoryWithRelations: CategoryWithParent = {
        ...category,
        parent,
        children
      };

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: categoryWithRelations
      };
    } catch (error) {
      console.error('Error getting category by slug:', error);
      return {
        success: false,
        message: 'Failed to retrieve category',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Create new category
  async createCategory(data: CreateCategory): Promise<ServiceResult<Category>> {
    try {
      const [newCategory] = await db
        .insert(categories)
        .values(data)
        .returning();

      return {
        success: true,
        message: 'Category created successfully',
        data: newCategory
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        message: 'Failed to create category',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Update category
  async updateCategory(
    id: number,
    data: Partial<CreateCategory>
  ): Promise<ServiceResult<Category>> {
    try {
      const [updatedCategory] = await db
        .update(categories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning();

      if (!updatedCategory) {
        return {
          success: false,
          message: 'Category not found',
          errors: ['Category with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        message: 'Failed to update category',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Delete category
  async deleteCategory(id: number): Promise<ServiceResult<void>> {
    try {
      // Check if category has articles
      const [articleCount] = await db
        .select({ count: count() })
        .from(articles)
        .where(eq(articles.categoryId, id));

      if (articleCount.count > 0) {
        return {
          success: false,
          message: 'Cannot delete category',
          errors: ['Category has articles associated with it']
        };
      }

      // Check if category has children
      const [childCount] = await db
        .select({ count: count() })
        .from(categories)
        .where(eq(categories.parentId, id));

      if (childCount.count > 0) {
        return {
          success: false,
          message: 'Cannot delete category',
          errors: ['Category has subcategories']
        };
      }

      const [deletedCategory] = await db
        .delete(categories)
        .where(eq(categories.id, id))
        .returning();

      if (!deletedCategory) {
        return {
          success: false,
          message: 'Category not found',
          errors: ['Category with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Category deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        message: 'Failed to delete category',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get popular categories
  async getPopularCategories(
    limit: number = 5
  ): Promise<ServiceResult<CategoryWithArticleCount[]>> {
    try {
      const popularCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          parentId: categories.parentId,
          displayOrder: categories.displayOrder,
          isActive: categories.isActive,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
          articleCount: count(articles.id)
        })
        .from(categories)
        .leftJoin(articles, eq(categories.id, articles.categoryId))
        .where(eq(categories.isActive, true))
        .groupBy(categories.id)
        .orderBy(desc(count(articles.id)))
        .limit(limit);

      return {
        success: true,
        message: 'Popular categories retrieved successfully',
        data: popularCategories
      };
    } catch (error) {
      console.error('Error getting popular categories:', error);
      return {
        success: false,
        message: 'Failed to retrieve popular categories',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
