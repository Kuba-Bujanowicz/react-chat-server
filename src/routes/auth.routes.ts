import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/logout', AuthMiddleware.authenticateToken, AuthController.logout);
router.delete('/delete-account', AuthMiddleware.authenticateToken, AuthController.deleteAccount);

export { router };
