import AuthService from "../services/auth.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import { COOKIES_SAMESITE, COOKIES_SECURE } from "../config/env.js";
import errorCodes from "../lib/constants/errorCodes.js"
import {INTERNAL_SERVER_ERROR} from "../lib/constants/errors.js"

/**
 * Controller to handle auth requests
 * */
export default class AuthController {
    /**
     * Signup a user, save him in database and set cookie with token
     * */
    static async signup(req, res) {
        const { username, password } = req.body;
        let result;
        try {
            result = await AuthService.signupUser({
                username,
                password,
            });
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Error del servidor!", res);
        }
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res);
        } else {
            res.cookie("token", result.data, {
                httpOnly: true,
                secure: COOKIES_SECURE === "true",
                sameSite: COOKIES_SAMESITE,
            });
            return ResponseHandler.ok("Usuario registrado!", null, res);
        }
    }
    /**
     * Signin a user validating username and password and set cookie with token 
     * */
    static async signin(req, res) {
        const { username, password } = req.body;
        let result;
        try {
            result = await AuthService.signinUser({
                username,
                password,
            });
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Error del servidor!", res);
        }
        // Send response depending on validations
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res);
        } else {
            res.cookie("token", result.data, {
                httpOnly: true,
                secure: COOKIES_SECURE === "true",
                sameSite: COOKIES_SAMESITE,
            });
            return ResponseHandler.ok("Usuario autorizado!", null, res);
        }
    }
    /**
     * Check if a user is authenticated validating token
     * */
    static async isAuthenticated(req, res) {
        const { token } = req.cookies;
        let result;
        try {
            result = await AuthService.isAuthenticated(token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Error del servidor!", res);
        }
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res);
        } else {
            return ResponseHandler.ok("Usuario autorizado!", result.data, res);
        }
    }
}
