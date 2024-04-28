import UserService from "../services/user.service.js"
import ErrorHandler from "../errors/errorHandler.js"

export default class UserController {
    static async deleteUser(req, res) {
        const { id, password } = req.body
        let userDeleted
        try {
            userDeleted = await UserService.deleteUser(id, password)
        } catch (e) {
            return new ErrorHandler(res).internalServer()
        }
        if (userDeleted.matchPassword) {
            return res.status(200).json({ message: "User deleted!", id: userDeleted.id })
        } else {
            return new ErrorHandler(res).unauthorized("Password Incorrect!", password)
        }
    }
}
