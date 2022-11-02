import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.post('/signup', UserController.signup)
router.post('/signin', UserController.signin)
router.get('/users', AuthMiddleware.authenticateToken, UserController.getUsers)
router.post('/logout', UserController.logout)

export { router }