import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.get('/users', AuthMiddleware.authenticateToken, AuthController.getUsers)
router.post('/logout', AuthController.logout)

export { router }