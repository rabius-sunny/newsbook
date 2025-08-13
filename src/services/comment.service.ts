import { eq, desc, asc, and, count, isNull } from 'drizzle-orm';
import { db } from '../db/index';
import { comments, articles, users } from '../db/schema';
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
        isApproved,
        isReported,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];

      if (articleId) {
        conditions.push(eq(comments.articleId, articleId));
      }

      if (typeof isApproved === 'boolean') {
        conditions.push(eq(comments.isApproved, isApproved));
      }

      if (typeof isReported === 'boolean') {
        conditions.push(eq(comments.isReported, isReported));
      }

      // Apply sorting
      const orderColumn =
        sortBy === 'likeCount'
          ? comments.likeCount
          : sortBy === 'replyCount'
          ? comments.replyCount
          : comments.createdAt;

      const orderDirection =
        sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

      // Get comments with relations
      let baseQuery = db
        .select({
          // Comment fields
          id: comments.id,
          articleId: comments.articleId,
          parentId: comments.parentId,
          authorName: comments.authorName,
          authorEmail: comments.authorEmail,
          authorAvatar: comments.authorAvatar,
          content: comments.content,
          contentBn: comments.contentBn,
          isApproved: comments.isApproved,
          isReported: comments.isReported,
          moderatedBy: comments.moderatedBy,
          moderatedAt: comments.moderatedAt,
          likeCount: comments.likeCount,
          replyCount: comments.replyCount,
          ipAddress: comments.ipAddress,
          userAgent: comments.userAgent,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          // Article fields
          articleTitle: articles.title,
          articleTitleBn: articles.titleBn,
          articleSlug: articles.slug,
          // Moderator fields
          moderatorName: users.name,
          moderatorNameBn: users.nameBn
        })
        .from(comments)
        .leftJoin(articles, eq(comments.articleId, articles.id))
        .leftJoin(users, eq(comments.moderatedBy, users.id));

      if (conditions.length > 0) {
        baseQuery = baseQuery.where(and(...conditions));
      }

      const commentsData = await baseQuery
        .orderBy(orderDirection)
        .limit(limit)
        .offset(offset);

      // Get total count
      let countQuery = db.select({ count: count() }).from(comments);

      if (conditions.length > 0) {
        countQuery = countQuery.where(and(...conditions));
      }

      const [{ count: totalCount }] = await countQuery;

      // Format comments with relations
      const formattedComments: CommentWithRelations[] = commentsData.map(
        (comment) => ({
          id: comment.id,
          articleId: comment.articleId,
          parentId: comment.parentId,
          authorName: comment.authorName,
          authorEmail: comment.authorEmail,
          authorAvatar: comment.authorAvatar,
          content: comment.content,
          contentBn: comment.contentBn,
          isApproved: comment.isApproved,
          isReported: comment.isReported,
          moderatedBy: comment.moderatedBy,
          moderatedAt: comment.moderatedAt,
          likeCount: comment.likeCount,
          replyCount: comment.replyCount,
          ipAddress: comment.ipAddress,
          userAgent: comment.userAgent,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          article: comment.articleId
            ? {
                id: comment.articleId,
                title: comment.articleTitle || '',
                titleBn: comment.articleTitleBn || '',
                slug: comment.articleSlug || ''
              }
            : null,
          moderator: comment.moderatedBy
            ? {
                id: comment.moderatedBy,
                email: '', // Not selected for privacy
                name: comment.moderatorName || '',
                nameBn: comment.moderatorNameBn || null,
                bio: null,
                bioBn: null,
                avatar: null,
                role: '',
                createdAt: null
              }
            : null
        })
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
    articleId: string,
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
          parentId: comments.parentId,
          authorName: comments.authorName,
          authorEmail: comments.authorEmail,
          authorAvatar: comments.authorAvatar,
          content: comments.content,
          contentBn: comments.contentBn,
          isApproved: comments.isApproved,
          isReported: comments.isReported,
          moderatedBy: comments.moderatedBy,
          moderatedAt: comments.moderatedAt,
          likeCount: comments.likeCount,
          replyCount: comments.replyCount,
          ipAddress: comments.ipAddress,
          userAgent: comments.userAgent,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt
        })
        .from(comments)
        .where(
          and(
            eq(comments.articleId, articleId),
            eq(comments.isApproved, true),
            isNull(comments.parentId)
          )
        )
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
              .where(
                and(
                  eq(comments.isApproved, true),
                  eq(comments.articleId, articleId)
                )
              )
              .orderBy(asc(comments.createdAt))
          : [];

      // Build comment tree
      const commentMap = new Map<string, CommentWithRelations>();

      // Add parent comments
      parentComments.forEach((comment) => {
        commentMap.set(comment.id, {
          ...comment,
          article: null,
          moderator: null,
          replies: []
        });
      });

      // Add replies
      replies.forEach((reply) => {
        if (reply.parentId && commentMap.has(reply.parentId)) {
          const parent = commentMap.get(reply.parentId)!;
          if (!parent.replies) parent.replies = [];
          parent.replies.push({
            ...reply,
            article: null,
            moderator: null
          });
        }
      });

      const formattedComments = Array.from(commentMap.values());

      // Get total count of parent comments
      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(comments)
        .where(
          and(
            eq(comments.articleId, articleId),
            eq(comments.isApproved, true),
            isNull(comments.parentId)
          )
        );

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
    id: string,
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
  async deleteComment(id: string): Promise<ServiceResult<void>> {
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

  // Moderate comment (approve/reject)
  async moderateComment(
    id: string,
    action: 'approve' | 'reject',
    moderatorId: string
  ): Promise<ServiceResult<Comment>> {
    try {
      const [moderatedComment] = await db
        .update(comments)
        .set({
          isApproved: action === 'approve',
          moderatedBy: moderatorId,
          moderatedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(comments.id, id))
        .returning();

      if (!moderatedComment) {
        return {
          success: false,
          message: 'Comment not found',
          errors: ['Comment with this ID does not exist']
        };
      }

      return {
        success: true,
        message: `Comment ${action}d successfully`,
        data: moderatedComment
      };
    } catch (error) {
      console.error('Error moderating comment:', error);
      return {
        success: false,
        message: 'Failed to moderate comment',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Report comment
  async reportComment(id: string): Promise<ServiceResult<Comment>> {
    try {
      const [reportedComment] = await db
        .update(comments)
        .set({
          isReported: true,
          updatedAt: new Date()
        })
        .where(eq(comments.id, id))
        .returning();

      if (!reportedComment) {
        return {
          success: false,
          message: 'Comment not found',
          errors: ['Comment with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Comment reported successfully',
        data: reportedComment
      };
    } catch (error) {
      console.error('Error reporting comment:', error);
      return {
        success: false,
        message: 'Failed to report comment',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get pending comments for moderation
  async getPendingComments(
    limit: number = 50
  ): Promise<ServiceResult<CommentWithRelations[]>> {
    try {
      const result = await this.getComments({
        isApproved: false,
        isReported: false,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      });

      return {
        ...result,
        data: result.data?.comments || []
      };
    } catch (error) {
      console.error('Error getting pending comments:', error);
      return {
        success: false,
        message: 'Failed to retrieve pending comments',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
