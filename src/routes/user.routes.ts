import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get('/users', AuthMiddleware.authenticateToken, UserController.getUsers)
router.get('*', AuthMiddleware.authenticateToken, UserController.getCurrentUser)

export { router }
