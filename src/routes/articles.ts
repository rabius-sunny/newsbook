import { Hono } from 'hono';
import { ArticleController } from '../controllers/article.controller';

const articleController = new ArticleController();
const app = new Hono();

// Article routes
app.get('/', articleController.getArticles.bind(articleController));
app.get(
  '/featured',
  articleController.getFeaturedArticles.bind(articleController)
);
app.get('/breaking', articleController.getBreakingNews.bind(articleController));
app.get('/:slug', articleController.getArticleBySlug.bind(articleController));
app.post('/', articleController.createArticle.bind(articleController));
app.put('/:id', articleController.updateArticle.bind(articleController));
app.delete('/:id', articleController.deleteArticle.bind(articleController));

export { app as articleRoutes };
