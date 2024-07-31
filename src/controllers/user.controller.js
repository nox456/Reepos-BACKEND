import UserService from "../services/user.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js"
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

/**
 * Controller to handler user requests
 * */
export default class UserController {
    /**
     * Delete a user validating token and password
     * */
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
    /**
     * Change username validating token and password
     * */
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
    /**
     * Change password validating token and password
     * */
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
    /**
     * Change description validating token
     * */
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
    /**
     * Change image validating token
     * */
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
    /**
     * Add a user as follower
     * */
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
    /**
     * Search a user by username
     * */
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
    /**
     * Get followers of a user by username
     * */
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
    /**
     * Get profile info of user validating token
     * */
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
