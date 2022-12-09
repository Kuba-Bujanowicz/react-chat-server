import { AuthController } from '../controllers/auth.controller';
import { EmailController } from '../controllers/email.controller';
import { Router } from 'express';

const router = Router();

router.post('/send-email', AuthController.authenticateToken, EmailController.sentLink);
router.post('/verify-email/:id/:token', AuthController.authenticateToken, EmailController.verifyEmail);

export { router };
