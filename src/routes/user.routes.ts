import { Router } from 'express';
import { UserController } from '../controllers/users.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const middlewares = [AuthMiddleware.authenticateToken, AuthMiddleware.authenticateEmail];

router.get('/users', middlewares, UserController.getUsers);
router.get('/currentUser', middlewares, UserController.getCurrentUser);

export { router };
