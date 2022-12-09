import { EmailController } from '../controllers/email.controller';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/send-email', AuthMiddleware.authenticateToken, EmailController.sentLink);
router.get('/verify-email/:id/:token', AuthMiddleware.authenticateToken, EmailController.verifyEmail);

export { router };
