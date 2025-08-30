import { Hono } from 'hono';
import * as categoryHandlers from '../controllers/category.controller';
import * as articleHandlers from '../controllers/article.controller';

const app = new Hono();

// Category routes
app.get('/', categoryHandlers.getCategories);
app.get('/with-count', categoryHandlers.getCategoriesWithCount);
app.get('/popular', categoryHandlers.getPopularCategories);
app.get('/:slug', categoryHandlers.getCategoryBySlug);
app.get('/:slug/articles', articleHandlers.getArticlesByCategory);
app.post('/', categoryHandlers.createCategory);
app.put('/:id', categoryHandlers.updateCategory);
app.delete('/:id', categoryHandlers.deleteCategory);

export { app as categoryRoutes };
