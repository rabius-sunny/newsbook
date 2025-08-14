import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  serial,
  jsonb,
  index
} from 'drizzle-orm/pg-core';

// Newsletter subscriptions
export const newsletters = pgTable(
  'newsletters',
  {
    id: serial('id').primaryKey(),
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

// Advertisement placements
export const advertisements = pgTable(
  'advertisements',
  {
    id: serial('id').primaryKey(),
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
