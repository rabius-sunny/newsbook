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
} from '../db/schema';

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
  id: string;
  email: string;
  name: string;
  nameBn?: string | null;
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
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  excerpt?: string | null;
  excerptBn?: string | null;
  featuredImage?: string | null;
  imageCaption?: string | null;
  imageCaptionBn?: string | null;
  isPublished: boolean | null;
  publishedAt: Date | null;
  isFeatured: boolean | null;
  isBreaking: boolean | null;
  isUrgent: boolean | null;
  priority: number | null;
  viewCount: number | null;
  likeCount: number | null;
  shareCount: number | null;
  commentCount: number | null;
  location?: string | null;
  locationBn?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: {
    id: string;
    name: string;
    nameBn: string;
    slug: string;
  } | null;
  author?: {
    id: string;
    name: string;
    nameBn?: string | null;
    avatar?: string | null;
  } | null;
  tags?: {
    id: string;
    name: string;
    nameBn: string;
    slug: string;
    color: string | null;
  }[];
}

export interface CommentWithReplies extends Comment {
  replies?: Comment[];
  moderator?: UserPublic | null;
}

export interface CommentWithRelations extends Comment {
  article?: {
    id: string;
    title: string;
    titleBn: string;
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
  id: string;
  name: string;
  nameBn: string;
  articleCount: number;
  totalViews: number;
  avgViewsPerArticle: number;
}

// Search and filter types
export interface ArticleFilters {
  categoryId?: string;
  authorId?: string;
  editorId?: string;
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
  articleId?: string;
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
  articleIds: string[];
  updates: Partial<Article>;
}

export interface BulkUpdateComments {
  commentIds: string[];
  updates: Partial<Comment>;
}
