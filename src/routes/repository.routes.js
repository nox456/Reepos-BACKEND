import { Router } from "express";
import RepositoryController from "../controllers/repository.controller.js";

const router = Router()

// Create a repository in database
router.post("/create", RepositoryController.create)

export default router
