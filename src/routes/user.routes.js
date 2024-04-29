import UserController from "../controllers/user.controller.js"
import { Router } from "express"

const router = Router()

router.delete("/delete", UserController.deleteUser)
router.put("/change-username", UserController.changeUsername)

export default router
