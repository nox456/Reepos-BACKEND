import {Router} from "express"
import AuthController from "../controllers/auth.controller.js"

const router = Router()

router.post("/signup",AuthController.signup)
router.post("/signin", AuthController.signin)
router.post("/signupSession", AuthController.signupSession)

export default router
