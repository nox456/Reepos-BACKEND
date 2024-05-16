import UserController from "../controllers/user.controller.js"
import MulterController from "../controllers/multer.controller.js"
import { Router } from "express"

const router = Router()

router.delete("/delete", UserController.deleteUser)
router.put("/change-username", UserController.changeUsername)
router.put("/change-password", UserController.changePassword)
router.put("/change-description", UserController.changeDescription)
router.post("/upload-image", MulterController.uploadImage, UserController.storeImage)
router.post("/follow-user", UserController.followUser)
router.get("/search", UserController.search)
router.get("/followers", UserController.getFollowers)
router.get("/profile", UserController.getProfileInfo)

export default router
