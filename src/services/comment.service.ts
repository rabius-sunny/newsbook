import { eq, desc, asc, and, count, isNull } from 'drizzle-orm';
import { db } from '../db/index';
import { comments, articles, users } from '../db/schemas';
import {
  ServiceResult,
  Comment,
  CreateComment,
  CommentWithRelations,
  SearchParams,
  CommentFilters
} from '../types';

export class CommentService {
  // Get comments with filters
  async getComments(params: SearchParams & CommentFilters): Promise<
    ServiceResult<{
      comments: CommentWithRelations[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      const {
        page = 1,
        limit = 20,
        articleId,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];

      if (articleId) {
        conditions.push(eq(comments.articleId, articleId));
      }

      // Apply sorting
      const orderColumn =
        sortBy === 'likeCount' ? comments.likeCount : comments.createdAt;

      const orderDirection =
        sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

      // Get comments with relations
      let baseQuery = db
        .select({
          // Comment fields
          id: comments.id,
          articleId: comments.articleId,
          authorName: comments.authorName,
          authorEmail: comments.authorEmail,
          authorAvatar: comments.authorAvatar,
          content: comments.content,
          likeCount: comments.likeCount,
          ipAddress: comments.ipAddress,
          userAgent: comments.userAgent,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          // Article fields
          articleTitle: articles.title,
          articleSlug: articles.slug,
          // Moderator fields
          moderatorName: users.name
        })
        .from(comments)
        .leftJoin(articles, eq(comments.articleId, articles.id));

      if (conditions.length > 0) {
        baseQuery = (baseQuery as any).where(and(...conditions));
      }

      const commentsData = await baseQuery
        .orderBy(orderDirection)
        .limit(limit)
        .offset(offset);

      // Get total count
      let countQuery = db.select({ count: count() }).from(comments);

      if (conditions.length > 0) {
        countQuery = (countQuery as any).where(and(...conditions));
      }

      const [{ count: totalCount }] = await countQuery;

      // Format comments with relations
      const formattedComments: CommentWithRelations[] = commentsData.map(
        (comment) => {
          const obj: any = {
            id: comment.id,
            articleId: comment.articleId,
            authorName: comment.authorName,
            authorEmail: comment.authorEmail,
            authorAvatar: comment.authorAvatar,
            likeCount: comment.likeCount,
            ipAddress: comment.ipAddress,
            userAgent: comment.userAgent,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            article: comment.articleId
              ? {
                  id: comment.articleId,
                  title: comment.articleTitle || '',
                  slug: comment.articleSlug || ''
                }
              : null
          };

          return obj as CommentWithRelations;
        }
      );

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        message: 'Comments retrieved successfully',
        data: {
          comments: formattedComments,
          total: totalCount,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error getting comments:', error);
      return {
        success: false,
        message: 'Failed to retrieve comments',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get comments for an article with threading
  async getArticleComments(
    articleId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<
    ServiceResult<{
      comments: CommentWithRelations[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      const offset = (page - 1) * limit;

      // Get parent comments (no parentId)
      const parentComments = await db
        .select({
          id: comments.id,
          articleId: comments.articleId,
          authorName: comments.authorName,
          authorEmail: comments.authorEmail,
          authorAvatar: comments.authorAvatar,
          content: comments.content,
          likeCount: comments.likeCount,
          ipAddress: comments.ipAddress,
          userAgent: comments.userAgent,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt
        })
        .from(comments)
        .where(and(eq(comments.articleId, articleId)))
        .orderBy(desc(comments.createdAt))
        .limit(limit)
        .offset(offset);

      // Get replies for parent comments
      const parentIds = parentComments.map((c) => c.id);
      const replies =
        parentIds.length > 0
          ? await db
              .select()
              .from(comments)
              .where(and(eq(comments.articleId, articleId)))
              .orderBy(asc(comments.createdAt))
          : [];

      // Build comment tree
      const commentMap = new Map<number, CommentWithRelations>();

      // Add parent comments
      parentComments.forEach((comment) => {
        const obj: CommentWithRelations = {
          ...(comment as any),
          article: null,
          moderator: null
        };

        commentMap.set(comment.id, obj);
      });

      // Add replies

      const formattedComments = Array.from(commentMap.values());

      // Get total count of parent comments
      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(comments)
        .where(and(eq(comments.articleId, articleId)));

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        message: 'Article comments retrieved successfully',
        data: {
          comments: formattedComments,
          total: totalCount,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error getting article comments:', error);
      return {
        success: false,
        message: 'Failed to retrieve comments',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Create new comment
  async createComment(data: CreateComment): Promise<ServiceResult<Comment>> {
    try {
      const [newComment] = await db.insert(comments).values(data).returning();

      return {
        success: true,
        message: 'Comment created successfully',
        data: newComment
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      return {
        success: false,
        message: 'Failed to create comment',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Update comment
  async updateComment(
    id: number,
    data: Partial<CreateComment>
  ): Promise<ServiceResult<Comment>> {
    try {
      const [updatedComment] = await db
        .update(comments)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(comments.id, id))
        .returning();

      if (!updatedComment) {
        return {
          success: false,
          message: 'Comment not found',
          errors: ['Comment with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment
      };
    } catch (error) {
      console.error('Error updating comment:', error);
      return {
        success: false,
        message: 'Failed to update comment',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Delete comment
  async deleteComment(id: number): Promise<ServiceResult<void>> {
    try {
      const [deletedComment] = await db
        .delete(comments)
        .where(eq(comments.id, id))
        .returning();

      if (!deletedComment) {
        return {
          success: false,
          message: 'Comment not found',
          errors: ['Comment with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Comment deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return {
        success: false,
        message: 'Failed to delete comment',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
