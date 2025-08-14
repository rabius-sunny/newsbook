import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  serial,
  index
} from 'drizzle-orm/pg-core';

// Categories table - for organizing news by sections
export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(), // e.g., "রাজনীতি", "অর্থনীতি", "খেলা"
    slug: text('slug').notNull().unique(),
    description: text('description'),
    parentId: integer('parent_id'), // For subcategories
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
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    bio: text('bio'),
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
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => [
    index('tags_name_idx').on(table.name),
    index('tags_slug_idx').on(table.slug)
  ]
);
