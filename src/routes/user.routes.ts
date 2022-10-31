import { Router } from "express";
import { User } from "../controllers/user.controller";

const router = Router()

router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.post('/logout', User.logout)

export { router }