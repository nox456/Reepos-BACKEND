import { Router } from "express";
import RepositoryController from "../controllers/repository.controller.js";
import MulterController from "../controllers/multer.controller.js";

const router = Router()

// Create a repository in database
router.post("/create", RepositoryController.create)
// Upload a repository to supabase
router.post("/upload-cloud", RepositoryController.upload)
// Upload a repository to backend
router.post("/upload-backend", MulterController.uploadRepository, (req, res) => {
    return res.status(200).json({ message: "Repository Uploaded to Backend!" })
})

export default router
