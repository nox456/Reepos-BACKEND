import { Router } from "express";
import RepositoryController from "../controllers/repository.controller.js";

const router = Router()

// Create a repository in database
router.post("/create", RepositoryController.create)
// Upload a repository to supabase
router.post("/upload", RepositoryController.upload)

export default router
