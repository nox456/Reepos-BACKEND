import { Router } from "express"
import AuthController from "../controllers/auth.controller.js"

const router = Router()

// Signup a user with username and password
router.post("/signup", AuthController.signup)
// Signin a user with username and password
router.post("/signin", AuthController.signin)
// Signin a user with JWT token
router.post("/signinToken", AuthController.signinWithToken)

export default router
