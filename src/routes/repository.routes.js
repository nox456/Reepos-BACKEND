import { Router } from "express";
import RepositoryController from "../controllers/repository.controller.js";

const router = Router()

// Create a repository in database
router.post("/create", RepositoryController.create)
// Upload a repository to supabase
router.post("/upload-cloud", RepositoryController.uploadCloud)
// Get download link of a repository
router.get("/download", RepositoryController.download)
// Like a repository
router.put("/like", RepositoryController.like)
// Deleted a repository
router.delete("/", RepositoryController.delete)
// Search repositories by name
router.get("/search", RepositoryController.search)
// Change name of repository
router.put("/change-name", RepositoryController.changeName)
// Change description of repository
router.put("/change-description", RepositoryController.changeDescription)
// Get full information of repository
router.get("/info", RepositoryController.getInfo)
// Get from an user
router.get("/", RepositoryController.getFromUser)
// Delete temp zip
router.delete("/zip", RepositoryController.deleteZip)
// Remove like from a repository
router.put("/remove-like", RepositoryController.removeLike)
// Remove repository from temp directory
router.delete("/temp",RepositoryController.removeTemp)
// Remove repository from cloud without password
router.delete("/db", RepositoryController.deleteDb)
// Get README images
router.get("/readme", RepositoryController.readme)
// Check if an user already like a repository
router.get("/like", RepositoryController.checkIfLike)

export default router
