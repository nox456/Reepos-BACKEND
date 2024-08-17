import { Router } from "express";
import FileController from "../controllers/file.controller.js";
import MulterController from "../controllers/multer.controller.js"

const router = Router()

// Download a file
router.get("/download", FileController.download)
// Upload file to backend
router.post("/upload", MulterController.uploadFile)
// Get file info
router.get("/", FileController.getInfo)

export default router
