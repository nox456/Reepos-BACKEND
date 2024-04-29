import UserService from "../services/user.service.js"
import ErrorHandler from "../errors/errorHandler.js"

export default class UserController {
    static async deleteUser(req, res) {
        const { id, password } = req.body
        let userDeleted
        try {
            userDeleted = await UserService.deleteUser(id, password)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (userDeleted.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", id)
        } else if (userDeleted.passwordNotMatch) {
            return new ErrorHandler(res).unauthorized("Password Incorrect!", password)
        } else {
            return res.status(200).json({ message: "User deleted!", id: userDeleted.id })
        }
    }
}
