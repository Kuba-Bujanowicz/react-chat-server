import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router()

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.post('/logout', AuthController.logout)
router.post('/deleteProfile', AuthController.deleteAccount)

export { router }