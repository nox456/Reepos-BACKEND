import UserService from "../services/user.service.js";
import ErrorHandler from "../lib/errorHandler.js";
import ResponseHandler from "../lib/responseHandler.js";

// Class used in 'user.routes.js' that contains request handlers
export default class UserController {
    // Delete a existing user with password
    static async deleteUser(req, res) {
        const { token } = req.cookies;
        const { password } = req.body;
        let result;
        try {
            result = await UserService.deleteUser(token, password);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", null);
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).forbidden(
                "Password Incorrect!",
                password,
            );
        } else {
            return ResponseHandler.ok("User Deleted!", null, res);
        }
    }
    // Change username of a existing user
    static async changeUsername(req, res) {
        const { token } = req.cookies;
        const { newUsername, password } = req.body;
        let result;
        try {
            result = await UserService.changeUsername(
                newUsername,
                token,
                password,
            );
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result?.validationError) {
            return (
                new ErrorHandler(res).badRequest(result.validationError),
                result.validationField
            );
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", null);
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).forbidden(
                "Password Incorrect!",
                password,
            );
        } else {
            return ResponseHandler.ok("Username Modified!", newUsername, res);
        }
    }
    // Change password of a existing user
    static async changePassword(req, res) {
        const { token } = req.cookies;
        const { newPassword, password } = req.body;
        let result;
        try {
            result = await UserService.changePassword(
                newPassword,
                token,
                password,
            );
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists!", null);
        } else if (result?.passwordNotMatch) {
            return new ErrorHandler(res).forbidden(
                "Password Incorrect!",
                password,
            );
        } else {
            return ResponseHandler.ok("Password Modified!", newPassword, res);
        }
    }
    // Change description of a existing user
    static async changeDescription(req, res) {
        const { token } = req.cookies;
        const { newDescription } = req.body;
        let result;
        try {
            result = await UserService.changeDescription(newDescription, token);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists", null);
        } else {
            return ResponseHandler.ok(
                "Description Modified!",
                newDescription,
                res,
            );
        }
    }
    // Change image url of a existing user
    static async storeImage(req, res) {
        const { token } = req.cookies;
        const { file } = req;
        let result;
        try {
            result = await UserService.changeImage(file, token);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        }else if (result?.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't Exists", null);
        } else {
            return ResponseHandler.ok("Image Modified!", result.imageUrl, res);
        }
    }
    // Add the id of a user follower in followers field of a user followed
    static async followUser(req, res) {
        const { token } = req.cookies;
        const { userFollowedId } = req.body;
        let result;
        try {
            result = await UserService.followUser(userFollowedId, token);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound(
                "User doesn't Exists!",
                userFollowedId,
            );
        } else {
            return ResponseHandler.ok("User Followed!", userFollowedId, res);
        }
    }
    // Get users by username
    static async search(req, res) {
        const { username } = req.query;
        let result;
        try {
            result = await UserService.search(username);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound(
                "Users not founded!",
                username,
            );
        } else {
            return ResponseHandler.ok("Users Founded!", result, res);
        }
    }
    // Get user's followers by ID
    static async getFollowers(req, res) {
        const { token } = req.cookies;
        const { username } = req.query;
        let result;
        try {
            result = await UserService.getFollowers(token, username);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't exists!", null);
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound(
                "User doesn't have followers!",
                null,
            );
        } else {
            return ResponseHandler.ok("Followers Founded!", result, res);
        }
    }
    // Get profile info of a existing user by ID
    static async getProfileInfo(req, res) {
        const { token } = req.cookies;
        let result;
        try {
            result = await UserService.getProfileInfo(token);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound("User doesn't exists!", null);
        } else {
            return ResponseHandler.ok("Profile Info", result, res);
        }
    }
}
