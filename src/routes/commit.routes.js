import CommitController from "../controllers/commit.controller.js";
import { Router } from "express";

const router = Router();

// Get all commits from a repository
router.get("/", CommitController.getAll);
// Get information of commit
router.get("/info", CommitController.getInfo);

export default router;
