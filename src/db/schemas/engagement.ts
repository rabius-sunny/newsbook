import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  serial,
  index
} from 'drizzle-orm/pg-core';
import { articles } from './content';
import { users } from './core';

// Comments table - for article comments
export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    articleId: integer('article_id').references(() => articles.id, {
      onDelete: 'cascade'
    }),
    parentId: integer('parent_id'), // For reply threading

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
    moderatedBy: integer('moderated_by').references(() => users.id),
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
