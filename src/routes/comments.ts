import { Hono } from 'hono';
import { CommentController } from '../controllers/comment.controller';

const commentController = new CommentController();
const app = new Hono();

// Comment routes
app.get('/', commentController.getComments.bind(commentController));

app.post('/', commentController.createComment.bind(commentController));
app.put('/:id', commentController.updateComment.bind(commentController));
app.delete('/:id', commentController.deleteComment.bind(commentController));

export { app as commentRoutes };
