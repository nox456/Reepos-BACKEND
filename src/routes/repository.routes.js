import { Router } from "express";
import RepositoryController from "../controllers/repository.controller.js";

const router = Router()



// Create a repository in database
router.post("/create", RepositoryController.create)
// Upload a repository to supabase
router.post("/upload-cloud", RepositoryController.uploadCloud)
// Get files of repository from cloud
router.get("/get-files", RepositoryController.getFiles)
// Get download link of a repository
router.get("/download", RepositoryController.download)
// Deleted a repository
router.delete("/", RepositoryController.delete)

export default router
