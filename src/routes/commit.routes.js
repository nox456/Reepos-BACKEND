import CommitController from "../controllers/commit.controller.js";
import { Router } from "express";

const router = Router()

// Get all commits from a repository
router.get("/", CommitController.getAll)

export default router
