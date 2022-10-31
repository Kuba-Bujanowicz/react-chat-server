import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router()

router.post('/signup', UserController.signup)
router.post('/signin', UserController.signin)
router.post('/logout', UserController.logout)

export { router }