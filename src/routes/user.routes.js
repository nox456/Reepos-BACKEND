import UserController from "../controllers/user.controller.js"
import MulterController from "../controllers/multer.controller.js"
import { Router } from "express"

const router = Router()

router.delete("/delete", UserController.deleteUser)
router.put("/change-username", UserController.changeUsername)
router.put("/change-password", UserController.changePassword)
router.put("/change-description", UserController.changeDescription)
router.post("/upload-image", MulterController.uploadImage, (req, res) => res.status(200).json({ message: "Image Uploaded!", image: req.file }))

export default router
