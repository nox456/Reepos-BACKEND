import UserService from "../services/user.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js"
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";
import errorMap from "zod/lib/locales/en.js";

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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
        } else {
            return ResponseHandler.ok("Username Modified!", null, res);
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
        } else {
            return ResponseHandler.ok("User Followed!", null, res);
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
        } else {
            return ResponseHandler.ok("Users Founded!", null, res);
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
        } else {
            return ResponseHandler.ok("Followers Founded!", null, res);
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
        } else {
            return ResponseHandler.ok("Profile Info", null, res);
        }
    }
}
