import UserService from "../services/user.service.js"
import ErrorHandler from "../errors/errorHandler.js"

export default class UserController {
    static async deleteUser(req, res) {
        const { id, password } = req.body
        let result
        try {
            result = await UserService.deleteUser(id, password)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", id)
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).unauthorized("Password Incorrect!", password)
        } else {
            return res.status(200).json({ message: "User deleted!", id })
        }
    }
    static async changeUsername(req, res) {
        const { newUsername, id, password } = req.body
        let result
        try {
            result = await UserService.changeUsername(newUsername, id, password)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError), result.validationField
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", id)
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).unauthorized("Password Incorrect!", password)
        } else {
            return res.status(200).json({ message: "Username Modified!", data: newUsername })
        }
    }
    static async changePassword(req, res) {
        const { newPassword, id, password } = req.body
        let result
        try {
            result = await UserService.changePassword(newPassword, id, password)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", id)
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).unauthorized("Password Incorrect!", password)
        } else {
            return res.status(200).json({ message: "Password Modified!", data: newPassword })
        }
    }
    static async changeDescription(req, res) {
        const { newDescription, id } = req.body
        let result
        try {
            result = await UserService.changeDescription(newDescription, id)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists", id)
        } else {
            return res.status(200).json({ message: "Description Modified!", data: newDescription })
        }
    }
    static async storeImage(req, res) {
        const { file } = req
        const { user_id } = req.body
        let result
        try {
            result = await UserService.changeImage(file, user_id)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists", user_id)
        } else {
            return res.status(200).json({ message: "Image Modified!", data: result.imageUrl })
        }
    }
    static async followUser(req, res) {
        const { userFollowerId, userFollowedId } = req.body
        let result
        try {
            result = await UserService.followUser(userFollowedId, userFollowerId)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", userFollowedId)
        } else {
            return res.status(200).json({ message: "User Followed!", data: userFollowedId })
        }
    }
    static async search(req, res) {
        const { username } = req.query
        let result
        try {
            result = await UserService.search(username)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound("Users not founded!", username)
        } else {
            return res.status(200).json({ message: "Users founded!", data: result })
        }
    }
    static async getFollowers(req, res) {
        const { id } = req.query
        let result
        try {
            result = await UserService.getFollowers(id)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't exists!", id)
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound("User doesn't have followers!", id)
        } else {
            return res.status(200).json({ message: "Followers Founded!", data: result })
        }
    }
}
