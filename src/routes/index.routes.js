import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import repositoryRoutes from "./repository.routes.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const downloadsDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../temp/downloads",
);

const router = express.Router();

// Base URL of auth service
router.use("/auth", authRoutes);
// Base URL of users service
router.use("/users", userRoutes);
// Base URL of repositories routes
router.use("/repositories", repositoryRoutes);
// Serve downloads directory
router.use(express.static(downloadsDir));

export default router;
