import { relations } from 'drizzle-orm';
import { categories, users, tags } from './core';
import { articles, articleTags } from './content';
import { comments, pageViews } from './engagement';

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
  editedArticles: many(articles)
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

export const commentsRelations = relations(comments, ({ one }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id]
  })
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  article: one(articles, {
    fields: [pageViews.articleId],
    references: [articles.id]
  })
}));
