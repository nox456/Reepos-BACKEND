import express from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import repositoryRoutes from "./repository.routes.js"
import fileRoutes from "./file.routes.js"
import commitRoutes from "./commit.routes.js"
import contributorRoutes from "./contributor.routes.js"
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
router.use("/repositories", repositoryRoutes)
// Base URL of files routes
router.use("/files", fileRoutes)
// Base URL of commits routes
router.use("/commits", commitRoutes)
// Base URL of contributors routes
router.use("/contributors", contributorRoutes)
// Serve downloads directory
router.use(express.static(downloadsDir));

export default router;
