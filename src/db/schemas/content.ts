import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  serial,
  index,
  unique
} from 'drizzle-orm/pg-core';
import { categories, users, tags } from './core';

// Articles table - main news articles
export const articles = pgTable(
  'articles',
  {
    id: serial('id').primaryKey(),

    // Content fields
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),

    // Media
    featuredImage: text('featured_image'),
    imageCaption: text('image_caption'),
    gallery: text('gallery').array(), // Array of image string

    // Metadata
    categoryId: integer('category_id').references(() => categories.id),
    authorId: integer('author_id').references(() => users.id),

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
    commentCount: integer('comment_count').default(0),

    // Priority and placement
    isFeatured: boolean('is_featured').default(false), // For homepage highlight
    isBreaking: boolean('is_breaking').default(false), // Breaking news
    priority: integer('priority').default(5), // 1-10, higher = more important

    // Location and source
    location: text('location'), // Where the news happened
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
    id: serial('id').primaryKey(),
    articleId: integer('article_id').references(() => articles.id, {
      onDelete: 'cascade'
    }),
    tagId: integer('tag_id').references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => [
    unique().on(table.articleId, table.tagId),
    index('article_tags_article_idx').on(table.articleId),
    index('article_tags_tag_idx').on(table.tagId)
  ]
);
