import { Hono } from 'hono';
import { CategoryController } from '../controllers/category.controller';
import { ArticleController } from '../controllers/article.controller';

const categoryController = new CategoryController();
const articleController = new ArticleController();
const app = new Hono();

// Category routes
app.get('/', categoryController.getCategories.bind(categoryController));
app.get(
  '/with-count',
  categoryController.getCategoriesWithCount.bind(categoryController)
);
app.get(
  '/popular',
  categoryController.getPopularCategories.bind(categoryController)
);
app.get(
  '/:slug',
  categoryController.getCategoryBySlug.bind(categoryController)
);
app.get(
  '/:slug/articles',
  articleController.getArticlesByCategory.bind(articleController)
);
app.post('/', categoryController.createCategory.bind(categoryController));
app.put('/:id', categoryController.updateCategory.bind(categoryController));
app.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export { app as categoryRoutes };
