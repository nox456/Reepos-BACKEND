import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import repositoryRoutes from "./repository.routes.js"
import fileRoutes from "./file.routes.js"

const router = Router()

// Base URL of auth service
router.use("/auth", authRoutes)
// Base URL of users service
router.use("/users", userRoutes)
// Base URL of repositories routes
router.use("/repositories", repositoryRoutes)
// Base URL of files routes
router.use("/files", fileRoutes)

export default router 
