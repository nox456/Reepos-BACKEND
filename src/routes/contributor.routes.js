import ContributorController from "../controllers/contributor.controller.js";
import { Router } from "express";

const router = Router();

// Get all contributors from a repository
router.get("/", ContributorController.getAll);

export default router;
