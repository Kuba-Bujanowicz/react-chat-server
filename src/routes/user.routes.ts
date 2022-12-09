import { Router } from 'express';
import { UserController } from '../controllers/users.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/users', [AuthMiddleware.authenticateToken, AuthMiddleware.authenticateEmail], UserController.getUsers);
router.get('/current-user', AuthMiddleware.authenticateToken, UserController.getCurrentUser);

export { router };
