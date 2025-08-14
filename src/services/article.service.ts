import {
  eq,
  desc,
  asc,
  like,
  and,
  or,
  count,
  sql,
  isNull,
  isNotNull
} from 'drizzle-orm';
import { db } from '../db/index';
import {
  articles,
  categories,
  users,
  tags,
  articleTags,
  comments,
  pageViews
} from '../db/schemas';
import {
  ServiceResult,
  ArticleWithRelations,
  ArticleListItem,
  CreateArticle,
  SearchParams,
  ArticleFilters
} from '../types';

export class ArticleService {
  // Get all articles with filters
  async getArticles(params: SearchParams & ArticleFilters): Promise<
    ServiceResult<{
      articles: ArticleListItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      const {
        page = 1,
        limit = 10,
        query,
        categoryId,
        authorId,
        status,
        isPublished,
        isFeatured,
        isBreaking,
        sortBy = 'publishedAt',
        sortOrder = 'desc',
        dateFrom,
        dateTo,
        tags: tagIds
      } = params;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];

      if (query) {
        conditions.push(
          or(
            like(articles.title, `%${query}%`),
            like(articles.content, `%${query}%`)
          )
        );
      }

      if (categoryId) {
        conditions.push(
          eq(articles.categoryId, parseInt(categoryId.toString()))
        );
      }

      if (authorId) {
        conditions.push(eq(articles.authorId, parseInt(authorId.toString())));
      }

      if (status) {
        conditions.push(eq(articles.status, status));
      }

      if (typeof isPublished === 'boolean') {
        conditions.push(eq(articles.isPublished, isPublished));
      }

      if (typeof isFeatured === 'boolean') {
        conditions.push(eq(articles.isFeatured, isFeatured));
      }

      if (typeof isBreaking === 'boolean') {
        conditions.push(eq(articles.isBreaking, isBreaking));
      }

      if (dateFrom) {
        conditions.push(sql`${articles.publishedAt} >= ${new Date(dateFrom)}`);
      }

      if (dateTo) {
        conditions.push(sql`${articles.publishedAt} <= ${new Date(dateTo)}`);
      }

      // If tags filter is provided, we need to join with articleTags
      let baseQuery = db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          excerpt: articles.excerpt,
          featuredImage: articles.featuredImage,
          imageCaption: articles.imageCaption,
          isPublished: articles.isPublished,
          publishedAt: articles.publishedAt,
          isFeatured: articles.isFeatured,
          isBreaking: articles.isBreaking,
          isUrgent: articles.isUrgent,
          priority: articles.priority,
          viewCount: articles.viewCount,
          likeCount: articles.likeCount,
          shareCount: articles.shareCount,
          commentCount: articles.commentCount,
          location: articles.location,
          locationBn: articles.locationBn,
          createdAt: articles.createdAt,
          updatedAt: articles.updatedAt,
          // Category
          categoryId: categories.id,
          categoryName: categories.name,
          categorySlug: categories.slug,
          // Author
          authorId: users.id,
          authorName: users.name,
          authorAvatar: users.avatar
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .leftJoin(users, eq(articles.authorId, users.id));

      if (tagIds && tagIds.length > 0) {
        baseQuery = (baseQuery as any)
          .leftJoin(articleTags, eq(articles.id, articleTags.articleId))
          .leftJoin(tags, eq(articleTags.tagId, tags.id))
          .where(
            and(
              conditions.length > 0 ? and(...conditions) : undefined,
              sql`${tags.id} IN ${tagIds}`
            )
          )
          .groupBy(articles.id, categories.id, users.id);
      } else if (conditions.length > 0) {
        baseQuery = (baseQuery as any).where(and(...conditions));
      }

      // Apply sorting
      const orderColumn =
        sortBy === 'publishedAt'
          ? articles.publishedAt
          : sortBy === 'viewCount'
          ? articles.viewCount
          : sortBy === 'createdAt'
          ? articles.createdAt
          : sortBy === 'priority'
          ? articles.priority
          : articles.publishedAt;

      const orderDirection =
        sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

      // Get articles with pagination
      const articlesData = await baseQuery
        .orderBy(orderDirection)
        .limit(limit)
        .offset(offset);

      // Get total count
      const countQuery = db
        .select({ count: count() })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .leftJoin(users, eq(articles.authorId, users.id));

      if (tagIds && tagIds.length > 0) {
        (countQuery as any)
          .leftJoin(articleTags, eq(articles.id, articleTags.articleId))
          .leftJoin(tags, eq(articleTags.tagId, tags.id))
          .where(
            and(
              conditions.length > 0 ? and(...conditions) : undefined,
              sql`${tags.id} IN ${tagIds}`
            )
          )
          .groupBy(articles.id);
      } else if (conditions.length > 0) {
        (countQuery as any).where(and(...conditions));
      }

      const [{ count: totalCount }] = await countQuery;

      // Get tags for each article
      const articleIds = articlesData.map((a) => a.id);
      const articleTagsData =
        articleIds.length > 0
          ? await db
              .select({
                articleId: articleTags.articleId,
                tagId: tags.id,
                tagName: tags.name,
                tagSlug: tags.slug
              })
              .from(articleTags)
              .leftJoin(tags, eq(articleTags.tagId, tags.id))
              .where(sql`${articleTags.articleId} IN ${articleIds}`)
          : [];

      // Format articles with relations
      const formattedArticles: ArticleListItem[] = articlesData.map(
        (article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          featuredImage: article.featuredImage,
          imageCaption: article.imageCaption,
          isPublished: article.isPublished,
          publishedAt: article.publishedAt,
          isFeatured: article.isFeatured,
          isBreaking: article.isBreaking,
          isUrgent: article.isUrgent,
          priority: article.priority,
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          shareCount: article.shareCount,
          commentCount: article.commentCount,
          location: article.location,
          locationBn: article.locationBn,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          category: article.categoryId
            ? {
                id: article.categoryId,
                name: article.categoryName || '',
                slug: article.categorySlug || ''
              }
            : null,
          author: article.authorId
            ? {
                id: article.authorId,
                name: article.authorName || '',
                avatar: article.authorAvatar || null
              }
            : null,
          tags: articleTagsData
            .filter((tag) => tag.articleId === article.id)
            .map((tag) => ({
              id: tag.tagId || 0,
              name: tag.tagName || '',
              slug: tag.tagSlug || ''
            }))
        })
      );

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        message: 'Articles retrieved successfully',
        data: {
          articles: formattedArticles,
          total: totalCount,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error getting articles:', error);
      return {
        success: false,
        message: 'Failed to retrieve articles',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get single article by slug
  async getArticleBySlug(
    slug: string
  ): Promise<ServiceResult<ArticleWithRelations>> {
    try {
      const [article] = await db
        .select()
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

      if (!article) {
        return {
          success: false,
          message: 'Article not found',
          errors: ['Article with this slug does not exist']
        };
      }

      // Get related data
      const [category] = article.categoryId
        ? await db
            .select()
            .from(categories)
            .where(eq(categories.id, article.categoryId))
            .limit(1)
        : [null];

      const [author] = article.authorId
        ? await db
            .select({
              id: users.id,
              email: users.email,
              name: users.name,
              bio: users.bio,
              avatar: users.avatar,
              role: users.role,
              createdAt: users.createdAt
            })
            .from(users)
            .where(eq(users.id, article.authorId))
            .limit(1)
        : [null];

      const [editor] = article.editorId
        ? await db
            .select({
              id: users.id,
              email: users.email,
              name: users.name,
              bio: users.bio,
              avatar: users.avatar,
              role: users.role,
              createdAt: users.createdAt
            })
            .from(users)
            .where(eq(users.id, article.editorId))
            .limit(1)
        : [null];

      // Get tags
      const articleTagsData = await db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
          isActive: tags.isActive,
          createdAt: tags.createdAt
        })
        .from(articleTags)
        .leftJoin(tags, eq(articleTags.tagId, tags.id))
        .where(eq(articleTags.articleId, article.id));

      // Get approved comments count
      const [{ count: commentsCount }] = await db
        .select({ count: count() })
        .from(comments)
        .where(
          and(eq(comments.articleId, article.id), eq(comments.isApproved, true))
        );

      const articleWithRelations: ArticleWithRelations = {
        ...article,
        category: category || null,
        author: author || null,
        editor: editor || null,
        tags: articleTagsData
          .filter((tag) => tag.id)
          .map((tag) => ({
            id: tag.id!,
            name: tag.name!,
            slug: tag.slug!,
            isActive: tag.isActive || true,
            createdAt: tag.createdAt || null
          })),
        _count: {
          comments: commentsCount,
          views: article.viewCount || 0
        }
      };

      return {
        success: true,
        message: 'Article retrieved successfully',
        data: articleWithRelations
      };
    } catch (error) {
      console.error('Error getting article by slug:', error);
      return {
        success: false,
        message: 'Failed to retrieve article',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Create new article
  async createArticle(
    data: CreateArticle
  ): Promise<ServiceResult<ArticleWithRelations>> {
    try {
      const [newArticle] = await db.insert(articles).values(data).returning();

      // Get the full article with relations
      const result = await this.getArticleBySlug(newArticle.slug);

      return {
        success: true,
        message: 'Article created successfully',
        data: result.data
      };
    } catch (error) {
      console.error('Error creating article:', error);
      return {
        success: false,
        message: 'Failed to create article',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Update article
  async updateArticle(
    id: number,
    data: Partial<CreateArticle>
  ): Promise<ServiceResult<ArticleWithRelations>> {
    try {
      const [updatedArticle] = await db
        .update(articles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(articles.id, id))
        .returning();

      if (!updatedArticle) {
        return {
          success: false,
          message: 'Article not found',
          errors: ['Article with this ID does not exist']
        };
      }

      // Get the full article with relations
      const result = await this.getArticleBySlug(updatedArticle.slug);

      return {
        success: true,
        message: 'Article updated successfully',
        data: result.data
      };
    } catch (error) {
      console.error('Error updating article:', error);
      return {
        success: false,
        message: 'Failed to update article',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Delete article
  async deleteArticle(id: number): Promise<ServiceResult<void>> {
    try {
      const [deletedArticle] = await db
        .delete(articles)
        .where(eq(articles.id, id))
        .returning();

      if (!deletedArticle) {
        return {
          success: false,
          message: 'Article not found',
          errors: ['Article with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'Article deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting article:', error);
      return {
        success: false,
        message: 'Failed to delete article',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Increment view count
  async incrementViewCount(id: number): Promise<ServiceResult<void>> {
    try {
      await db
        .update(articles)
        .set({
          viewCount: sql`${articles.viewCount} + 1`
        })
        .where(eq(articles.id, id));

      return {
        success: true,
        message: 'View count updated'
      };
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return {
        success: false,
        message: 'Failed to update view count',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get featured articles
  async getFeaturedArticles(
    limit: number = 5
  ): Promise<ServiceResult<ArticleListItem[]>> {
    return this.getArticles({
      isFeatured: true,
      isPublished: true,
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    }).then((result) => ({
      ...result,
      data: result.data?.articles || []
    }));
  }

  // Get breaking news
  async getBreakingNews(
    limit: number = 3
  ): Promise<ServiceResult<ArticleListItem[]>> {
    return this.getArticles({
      isBreaking: true,
      isPublished: true,
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    }).then((result) => ({
      ...result,
      data: result.data?.articles || []
    }));
  }

  // Get articles by category
  async getArticlesByCategory(
    categorySlug: string,
    params: SearchParams
  ): Promise<
    ServiceResult<{
      articles: ArticleListItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      // First get the category
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);

      if (!category) {
        return {
          success: false,
          message: 'Category not found',
          errors: ['Category with this slug does not exist']
        };
      }

      return this.getArticles({
        ...params,
        categoryId: category.id,
        isPublished: true
      });
    } catch (error) {
      console.error('Error getting articles by category:', error);
      return {
        success: false,
        message: 'Failed to retrieve articles',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
