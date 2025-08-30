import { Hono } from 'hono';
import * as articleHandlers from '../controllers/article.controller';
import * as commentHandlers from '../controllers/comment.controller';

const app = new Hono();

// Article routes
app.get('/', articleHandlers.getArticles);
app.get('/featured', articleHandlers.getFeaturedArticles);
app.get('/breaking', articleHandlers.getBreakingNews);
app.get('/:articleId/comments', commentHandlers.getArticleComments);
app.get('/:slug', articleHandlers.getArticleBySlug);
app.post('/', articleHandlers.createArticle);
app.put('/:id', articleHandlers.updateArticle);
app.delete('/:id', articleHandlers.deleteArticle);

export { app as articleRoutes };
