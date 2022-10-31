import { Router } from "express";
import { User } from "../controllers/user.controller";

const router = Router()

router.post('/signup', User.signup)
router.post('/signing', User.signin)
router.post('/logout', User.logout)

export default router