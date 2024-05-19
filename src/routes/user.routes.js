import UserController from "../controllers/user.controller.js"
import MulterController from "../controllers/multer.controller.js"
import { Router } from "express"

const router = Router()

// Delete user by id and password
router.delete("/delete", UserController.deleteUser)
// Update username field of a user by id and password
router.put("/change-username", UserController.changeUsername)
// Update password field of a user by id and password
router.put("/change-password", UserController.changePassword)
// Update description field of a user by id
router.put("/change-description", UserController.changeDescription)
// Update image field of a user by id
router.post("/upload-image", MulterController.uploadImage, UserController.storeImage)
// Follow a user by id
router.post("/follow-user", UserController.followUser)
// Search users by username field
router.get("/search", UserController.search)
// Search followers of a user by id field
router.get("/followers", UserController.getFollowers)
// Get profile info of a user by id field
router.get("/profile", UserController.getProfileInfo)

export default router
