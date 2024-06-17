import UserService from "../services/user.service.js"
import ErrorHandler from "../lib/errorHandler.js"
import ResponseHandler from "../lib/responseHandler.js"

// Class used in 'user.routes.js' that contains request handlers
export default class UserController {
    // Delete a existing user with password
    static async deleteUser(req, res) {
        const { id, password } = req.body
        let result
        try {
            result = await UserService.deleteUser(id, password)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", id)
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).forbidden("Password Incorrect!", password)
        } else {
            return ResponseHandler.ok("User Deleted!", id, res)
        }
    }
    // Change username of a existing user
    static async changeUsername(req, res) {
        const { newUsername, id, password } = req.body
        let result
        try {
            result = await UserService.changeUsername(newUsername, id, password)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError), result.validationField
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", id)
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).forbidden("Password Incorrect!", password)
        } else {
            return ResponseHandler.ok("Username Modified!", newUsername, res)
        }
    }
    // Change password of a existing user
    static async changePassword(req, res) {
        const { newPassword, id, password } = req.body
        let result
        try {
            result = await UserService.changePassword(newPassword, id, password)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", id)
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).forbidden("Password Incorrect!", password)
        } else {
            return ResponseHandler.ok("Password Modified!", newPassword, res)
        }
    }
    // Change description of a existing user
    static async changeDescription(req, res) {
        const { newDescription, id } = req.body
        let result
        try {
            result = await UserService.changeDescription(newDescription, id)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists", id)
        } else {
            return ResponseHandler.ok("Description Modified!", newDescription, res)
        }
    }
    // Change image url of a existing user
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
        // Send response depending on validations
        if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists", user_id)
        } else {
            return ResponseHandler.ok("Image Modified!", result.imageUrl, res)
        }
    }
    // Add the id of a user follower in followers field of a user followed
    static async followUser(req, res) {
        const { userFollowerId, userFollowedId } = req.body
        let result
        try {
            result = await UserService.followUser(userFollowedId, userFollowerId)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", userFollowedId)
        } else {
            return ResponseHandler.ok("User Followed!", userFollowedId, res)
        }
    }
    // Get users by username
    static async search(req, res) {
        const { username } = req.query
        let result
        try {
            result = await UserService.search(username)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound("Users not founded!", username)
        } else {
            return ResponseHandler.ok("Users Founded!", result, res)
        }
    }
    // Get user's followers by ID
    static async getFollowers(req, res) {
        const { id, username } = req.query
        let result
        try {
            result = await UserService.getFollowers(id, username)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't exists!", id)
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound("User doesn't have followers!", id)
        } else {
            return ResponseHandler.ok("Followers Founded!", result, res)
        }
    }
    // Get profile info of a existing user by ID
    static async getProfileInfo(req,res) {
        const { id } = req.query
        let result
        try {
            result = await UserService.getProfileInfo(id)
        } catch(e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        // Send response depending on validations
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError, result.validationField)
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't exists!", id)
        } else {
            return ResponseHandler.ok("Profile Info", result, res)
        }
    }
}
