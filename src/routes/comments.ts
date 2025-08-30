import { Hono } from 'hono';
import * as commentHandlers from '../controllers/comment.controller';

const app = new Hono();

// Comment routes
app.get('/', commentHandlers.getComments);
app.post('/', commentHandlers.createComment);
app.put('/:id', commentHandlers.updateComment);
app.delete('/:id', commentHandlers.deleteComment);

export { app as commentRoutes };
