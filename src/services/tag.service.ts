import { eq, desc, asc, like, and, count } from 'drizzle-orm';
import { db } from '../db/index';
import { tags, articleTags } from '../db/schema';
import {
  ServiceResult,
  Tag,
  CreateTag,
  TagWithArticleCount,
  SearchParams
} from '../types';

export class TagService {
  // Get all tags
  async getTags(params: SearchParams = {}): Promise<
    ServiceResult<{
      tags: TagWithArticleCount[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      const {
        page = 1,
        limit = 50,
        query,
        sortBy = 'name',
        sortOrder = 'asc'
      } = params;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [eq(tags.isActive, true)];

      if (query) {
        conditions.push(like(tags.name, `%${query}%`));
      }

      // Apply sorting
      const orderColumn =
        sortBy === 'nameBn'
          ? tags.nameBn
          : sortBy === 'createdAt'
          ? tags.createdAt
          : tags.name;

      const orderDirection =
        sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

      // Get tags with article count
      const tagsData = await db
        .select({
          id: tags.id,
          name: tags.name,
          nameBn: tags.nameBn,
          slug: tags.slug,
          description: tags.description,
          color: tags.color,
          isActive: tags.isActive,
          createdAt: tags.createdAt,
          articleCount: count(articleTags.articleId)
        })
        .from(tags)
        .leftJoin(articleTags, eq(tags.id, articleTags.tagId))
        .where(and(...conditions))
        .groupBy(tags.id)
        .orderBy(orderDirection)
        .limit(limit)
        .offset(offset);

      // Get total count
      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(tags)
        .where(and(...conditions));

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        message: 'Tags retrieved successfully',
        data: {
          tags: tagsData,
          total: totalCount,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error getting tags:', error);
      return {
        success: false,
        message: 'Failed to retrieve tags',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get single tag by slug
  async getTagBySlug(
    slug: string
  ): Promise<ServiceResult<TagWithArticleCount>> {
    try {
      const [tagData] = await db
        .select({
          id: tags.id,
          name: tags.name,
          nameBn: tags.nameBn,
          slug: tags.slug,
          description: tags.description,
          color: tags.color,
          isActive: tags.isActive,
          createdAt: tags.createdAt,
          articleCount: count(articleTags.articleId)
        })
        .from(tags)
        .leftJoin(articleTags, eq(tags.id, articleTags.tagId))
        .where(eq(tags.slug, slug))
        .groupBy(tags.id)
        .limit(1);

      if (!tagData) {
        return {
          success: false,
          message: 'Tag not found',
          errors: ['Tag with this slug does not exist']
        };
      }

      return {
        success: true,
        message: 'Tag retrieved successfully',
        data: tagData
      };
    } catch (error) {
      console.error('Error getting tag by slug:', error);
      return {
        success: false,
        message: 'Failed to retrieve tag',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Create new tag
  async createTag(data: CreateTag): Promise<ServiceResult<Tag>> {
    try {
      const [newTag] = await db.insert(tags).values(data).returning();

      return {
        success: true,
        message: 'Tag created successfully',
        data: newTag
      };
    } catch (error) {
      console.error('Error creating tag:', error);
      return {
        success: false,
        message: 'Failed to create tag',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Update tag
  async updateTag(
    id: string,
    data: Partial<CreateTag>
  ): Promise<ServiceResult<Tag>> {
    try {
      const [updatedTag] = await db
        .update(tags)
        .set(data)
        .where(eq(tags.id, id))
        .returning();

      if (!updatedTag) {
        return {
          success: false,
          message: 'Tag not found',
          errors: ['Tag with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Tag updated successfully',
        data: updatedTag
      };
    } catch (error) {
      console.error('Error updating tag:', error);
      return {
        success: false,
        message: 'Failed to update tag',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Delete tag
  async deleteTag(id: string): Promise<ServiceResult<void>> {
    try {
      // Check if tag has articles
      const [articleCount] = await db
        .select({ count: count() })
        .from(articleTags)
        .where(eq(articleTags.tagId, id));

      if (articleCount.count > 0) {
        return {
          success: false,
          message: 'Cannot delete tag',
          errors: ['Tag has articles associated with it']
        };
      }

      const [deletedTag] = await db
        .delete(tags)
        .where(eq(tags.id, id))
        .returning();

      if (!deletedTag) {
        return {
          success: false,
          message: 'Tag not found',
          errors: ['Tag with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Tag deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting tag:', error);
      return {
        success: false,
        message: 'Failed to delete tag',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get popular tags
  async getPopularTags(
    limit: number = 10
  ): Promise<ServiceResult<TagWithArticleCount[]>> {
    try {
      const popularTags = await db
        .select({
          id: tags.id,
          name: tags.name,
          nameBn: tags.nameBn,
          slug: tags.slug,
          description: tags.description,
          color: tags.color,
          isActive: tags.isActive,
          createdAt: tags.createdAt,
          articleCount: count(articleTags.articleId)
        })
        .from(tags)
        .leftJoin(articleTags, eq(tags.id, articleTags.tagId))
        .where(eq(tags.isActive, true))
        .groupBy(tags.id)
        .orderBy(desc(count(articleTags.articleId)))
        .limit(limit);

      return {
        success: true,
        message: 'Popular tags retrieved successfully',
        data: popularTags
      };
    } catch (error) {
      console.error('Error getting popular tags:', error);
      return {
        success: false,
        message: 'Failed to retrieve popular tags',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Search tags
  async searchTags(
    query: string,
    limit: number = 10
  ): Promise<ServiceResult<Tag[]>> {
    try {
      const searchResults = await db
        .select()
        .from(tags)
        .where(and(eq(tags.isActive, true), like(tags.name, `%${query}%`)))
        .orderBy(asc(tags.name))
        .limit(limit);

      return {
        success: true,
        message: 'Tag search completed',
        data: searchResults
      };
    } catch (error) {
      console.error('Error searching tags:', error);
      return {
        success: false,
        message: 'Failed to search tags',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
