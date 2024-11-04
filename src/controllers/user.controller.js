import UserService from "../services/user.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js";
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
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Usuario eliminado!", null, res);
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
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Nombre de usuario cambiado!", null, res);
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
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Contraseña cambiada!", newPassword, res);
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
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok(
                "Descripción cambiada!",
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
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Imagen cambiada!", result.imageUrl, res);
        }
    }
    /**
     * Follow an user
     * */
    static async followUser(req, res) {
        const { token } = req.cookies;
        const { username } = req.body;
        let result;
        try {
            result = await UserService.followUser(username, token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Usuario seguido!", null, res);
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
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok(
                "Usuarios encontrados!",
                result.data,
                res,
            );
        }
    }
    /**
     * Get followers of a user by username
     * */
    static async getFollowers(req, res) {
        const { username } = req.query;
        let result;
        try {
            result = await UserService.getFollowers(username);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok(
                "Seguidores encontrados!",
                result.data,
                res,
            );
        }
    }
    /**
     * Get profile info of user validating token
     * */
    static async getProfileInfo(req, res) {
        const { username } = req.query;
        let result;
        try {
            result = await UserService.getProfileInfo(username);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok(
                "Información del perfil!",
                result.data,
                res,
            );
        }
    }
    /**
     * Unfollow an user
     * */
    static async unfollow(req, res) {
        const { username } = req.body;
        const { token } = req.cookies;
        let result;
        try {
            result = await UserService.unfollow(username, token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Usuario dejado de seguir", null, res);
        }
    }
}
