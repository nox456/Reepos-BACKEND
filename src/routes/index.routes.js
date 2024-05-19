import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"

const router = Router()

// Base URL of auth service
router.use("/auth", authRoutes)
// Base URL of users service
router.use("/users", userRoutes)

export default router 
