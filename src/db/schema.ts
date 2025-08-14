import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  jsonb,
  index,
  unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Categories table - for organizing news by sections
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(), // e.g., "রাজনীতি", "অর্থনীতি", "খেলা"
    nameEn: text('name_en').notNull(), // English name for URL
    slug: text('slug').notNull().unique(),
    description: text('description'),
    parentId: uuid('parent_id'), // For subcategories
    displayOrder: integer('display_order').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => [
    index('categories_slug_idx').on(table.slug),
    index('categories_name_idx').on(table.name)
  ]
);

// Users table - for authors, editors, admins
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    nameBn: text('name_bn'), // Bengali name
    bio: text('bio'),
    bioBn: text('bio_bn'), // Bengali bio
    avatar: text('avatar'),
    role: text('role').notNull().default('reporter'), // admin, editor, reporter, contributor
    isActive: boolean('is_active').default(true),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => [
    index('users_email_idx').on(table.email),
    index('users_role_idx').on(table.role)
  ]
);

// Tags table - for tagging articles
export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    nameBn: text('name_bn').notNull().unique(), // Bengali tag name
    slug: text('slug').notNull().unique(),
    description: text('description'),
    color: text('color').default('#3B82F6'), // For UI display
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => [
    index('tags_name_idx').on(table.name),
    index('tags_slug_idx').on(table.slug)
  ]
);

// Articles table - main news articles
export const articles = pgTable(
  'articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Content fields
    title: text('title').notNull(),
    titleBn: text('title_bn').notNull(), // Bengali title
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    excerptBn: text('excerpt_bn'), // Bengali excerpt
    content: text('content').notNull(),
    contentBn: text('content_bn').notNull(), // Bengali content

    // Media
    featuredImage: text('featured_image'),
    imageCaption: text('image_caption'),
    imageCaptionBn: text('image_caption_bn'),
    gallery: jsonb('gallery'), // Array of image objects

    // Metadata
    categoryId: uuid('category_id').references(() => categories.id),
    authorId: uuid('author_id').references(() => users.id),
    editorId: uuid('editor_id').references(() => users.id), // Who edited/approved

    // Publication status
    status: text('status').notNull().default('draft'), // draft, review, published, archived
    isPublished: boolean('is_published').default(false),
    publishedAt: timestamp('published_at'),
    scheduledAt: timestamp('scheduled_at'), // For scheduled publishing

    // SEO and engagement
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    keywords: text('keywords'), // Comma separated
    viewCount: integer('view_count').default(0),
    likeCount: integer('like_count').default(0),
    shareCount: integer('share_count').default(0),
    commentCount: integer('comment_count').default(0),

    // Priority and placement
    isFeatured: boolean('is_featured').default(false), // For homepage highlight
    isBreaking: boolean('is_breaking').default(false), // Breaking news
    isUrgent: boolean('is_urgent').default(false), // Urgent news ticker
    priority: integer('priority').default(5), // 1-10, higher = more important

    // Location and source
    location: text('location'), // Where the news happened
    locationBn: text('location_bn'),
    source: text('source'), // News source/agency

    // Timestamps
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => [
    index('articles_slug_idx').on(table.slug),
    index('articles_status_idx').on(table.status),
    index('articles_published_idx').on(table.isPublished, table.publishedAt),
    index('articles_category_idx').on(table.categoryId),
    index('articles_author_idx').on(table.authorId),
    index('articles_featured_idx').on(table.isFeatured),
    index('articles_breaking_idx').on(table.isBreaking),
    index('articles_created_idx').on(table.createdAt)
  ]
);

// Article tags junction table
export const articleTags = pgTable(
  'article_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    articleId: uuid('article_id').references(() => articles.id, {
      onDelete: 'cascade'
    }),
    tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => [
    unique().on(table.articleId, table.tagId),
    index('article_tags_article_idx').on(table.articleId),
    index('article_tags_tag_idx').on(table.tagId)
  ]
);

// Comments table - for article comments
export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    articleId: uuid('article_id').references(() => articles.id, {
      onDelete: 'cascade'
    }),
    parentId: uuid('parent_id'), // For reply threading

    // Author info (can be anonymous)
    authorName: text('author_name').notNull(),
    authorEmail: text('author_email'),
    authorAvatar: text('author_avatar'),

    // Content
    content: text('content').notNull(),
    contentBn: text('content_bn'), // Bengali comment

    // Moderation
    isApproved: boolean('is_approved').default(false),
    isReported: boolean('is_reported').default(false),
    moderatedBy: uuid('moderated_by').references(() => users.id),
    moderatedAt: timestamp('moderated_at'),

    // Engagement
    likeCount: integer('like_count').default(0),
    replyCount: integer('reply_count').default(0),

    // Metadata
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => [
    index('comments_article_idx').on(table.articleId),
    index('comments_parent_idx').on(table.parentId),
    index('comments_approved_idx').on(table.isApproved),
    index('comments_created_idx').on(table.createdAt)
  ]
);

// Newsletter subscriptions
export const newsletters = pgTable(
  'newsletters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    name: text('name'),
    preferences: jsonb('preferences'), // Which categories to receive
    isActive: boolean('is_active').default(true),
    verifiedAt: timestamp('verified_at'),
    unsubscribedAt: timestamp('unsubscribed_at'),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => [
    index('newsletters_email_idx').on(table.email),
    index('newsletters_active_idx').on(table.isActive)
  ]
);

// Page views analytics
export const pageViews = pgTable(
  'page_views',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    articleId: uuid('article_id').references(() => articles.id, {
      onDelete: 'cascade'
    }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    referrer: text('referrer'),
    country: text('country'),
    city: text('city'),
    device: text('device'), // mobile, desktop, tablet
    sessionId: text('session_id'),
    viewedAt: timestamp('viewed_at').defaultNow()
  },
  (table) => [
    index('page_views_article_idx').on(table.articleId),
    index('page_views_date_idx').on(table.viewedAt),
    index('page_views_session_idx').on(table.sessionId)
  ]
);

// Advertisement placements
export const advertisements = pgTable(
  'advertisements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    clickUrl: text('click_url').notNull(),
    position: text('position').notNull(), // header, sidebar, content, footer
    isActive: boolean('is_active').default(true),
    impressions: integer('impressions').default(0),
    clicks: integer('clicks').default(0),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => [
    index('ads_position_idx').on(table.position),
    index('ads_active_idx').on(table.isActive),
    index('ads_date_idx').on(table.startDate, table.endDate)
  ]
);

// Define relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'CategoryParent'
  }),
  children: many(categories, {
    relationName: 'CategoryParent'
  }),
  articles: many(articles)
}));

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  editedArticles: many(articles),
  moderatedComments: many(comments)
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  articleTags: many(articleTags)
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id]
  }),
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
    relationName: 'ArticleAuthor'
  }),
  editor: one(users, {
    fields: [articles.editorId],
    references: [users.id],
    relationName: 'ArticleEditor'
  }),
  tags: many(articleTags),
  comments: many(comments),
  views: many(pageViews)
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id]
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id]
  })
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id]
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'CommentReplies'
  }),
  replies: many(comments, {
    relationName: 'CommentReplies'
  }),
  moderator: one(users, {
    fields: [comments.moderatedBy],
    references: [users.id]
  })
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  article: one(articles, {
    fields: [pageViews.articleId],
    references: [articles.id]
  })
}));
