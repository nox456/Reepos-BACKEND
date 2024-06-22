import { Router } from "express";
import FileController from "../controllers/file.controller.js";

const router = Router()

// Download a file
router.get("/download", FileController.download)

export default router
