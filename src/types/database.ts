import {
  categories,
  users,
  tags,
  articles,
  articleTags,
  comments,
  newsletters,
  pageViews,
  advertisements
} from '../db/schemas';

// Database table types
export type Category = typeof categories.$inferSelect;
export type User = typeof users.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type ArticleTag = typeof articleTags.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Newsletter = typeof newsletters.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
export type Advertisement = typeof advertisements.$inferSelect;

// Insert types
export type CreateCategory = typeof categories.$inferInsert;
export type CreateUser = typeof users.$inferInsert;
export type CreateTag = typeof tags.$inferInsert;
export type CreateArticle = typeof articles.$inferInsert;
export type CreateArticleTag = typeof articleTags.$inferInsert;
export type CreateComment = typeof comments.$inferInsert;
export type CreateNewsletter = typeof newsletters.$inferInsert;
export type CreatePageView = typeof pageViews.$inferInsert;
export type CreateAdvertisement = typeof advertisements.$inferInsert;

// Relations types
export interface CategoryWithParent extends Category {
  parent?: Category | null;
  children?: Category[];
}

export interface CategoryWithArticleCount extends Category {
  articleCount: number;
}

export interface UserPublic {
  id: number;
  email: string;
  name: string;
  bio?: string | null;
  bioBn?: string | null;
  avatar?: string | null;
  role: string;
  createdAt: Date | null;
}

export interface ArticleWithRelations extends Article {
  category?: Category | null;
  author?: UserPublic | null;
  editor?: UserPublic | null;
  tags?: Tag[];
  comments?: Comment[];
  _count?: {
    comments: number;
    views: number;
  };
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  imageCaption?: string | null;
  isPublished: boolean | null;
  publishedAt: Date | null;
  isFeatured: boolean | null;
  isBreaking: boolean | null;
  priority: number | null;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  location?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  author?: {
    id: number;
    name: string;
    avatar?: string | null;
  } | null;
  tags?: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export interface CommentWithReplies extends Comment {
  replies?: Comment[];
  moderator?: UserPublic | null;
}

export interface CommentWithRelations extends Comment {
  article?: {
    id: number;
    title: string;
    slug: string;
  } | null;
  parent?: Comment | null;
  replies?: Comment[];
  moderator?: UserPublic | null;
}

export interface TagWithArticleCount extends Tag {
  articleCount: number;
}

export interface NewsletterWithPreferences extends Newsletter {
  preferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  } | null;
}

// Statistics types
export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalUsers: number;
  totalComments: number;
  pendingComments: number;
  totalViews: number;
  todayViews: number;
  totalCategories: number;
  totalTags: number;
  newsletterSubscribers: number;
}

export interface ArticleStats {
  totalViews: number;
  uniqueViews: number;
  totalComments: number;
  totalShares: number;
  totalLikes: number;
  avgReadTime?: number;
  bounceRate?: number;
}

export interface CategoryStats {
  id: number;
  name: string;
  articleCount: number;
  totalViews: number;
  avgViewsPerArticle: number;
}

// Search and filter types
export interface ArticleFilters {
  categoryId?: number;
  authorId?: number;
  editorId?: number;
  status?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isUrgent?: boolean;
  tags?: string[];
  location?: string;
  publishedAfter?: Date;
  publishedBefore?: Date;
  minViewCount?: number;
  minPriority?: number;
}

export interface CommentFilters {
  articleId?: number;
  isApproved?: boolean;
  isReported?: boolean;
  authorEmail?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Bulk operations
export interface BulkUpdateArticles {
  articleIds: number[];
  updates: Partial<Article>;
}

export interface BulkUpdateComments {
  commentIds: number[];
  updates: Partial<Comment>;
}
