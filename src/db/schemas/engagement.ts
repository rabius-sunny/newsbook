import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  index
} from 'drizzle-orm/pg-core';
import { articles } from './content';

// Comments table - for article comments
export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    articleId: integer('article_id').references(() => articles.id, {
      onDelete: 'cascade'
    }),

    // Author info (can be anonymous)
    authorName: text('author_name').notNull(),
    authorEmail: text('author_email'),
    authorAvatar: text('author_avatar'),

    // Content
    content: text('content').notNull(),

    // Engagement
    likeCount: integer('like_count').default(0),

    // Metadata
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => [
    index('comments_article_idx').on(table.articleId),
    index('comments_created_idx').on(table.createdAt)
  ]
);

// Page views analytics
export const pageViews = pgTable(
  'page_views',
  {
    id: serial('id').primaryKey(),
    articleId: integer('article_id').references(() => articles.id, {
      onDelete: 'cascade'
    }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    referrer: text('referrer'),
    sessionId: text('session_id'),
    viewedAt: timestamp('viewed_at').defaultNow()
  },
  (table) => [
    index('page_views_article_idx').on(table.articleId),
    index('page_views_date_idx').on(table.viewedAt),
    index('page_views_session_idx').on(table.sessionId)
  ]
);
