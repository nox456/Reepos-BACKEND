import AuthService from "../services/auth.service.js";
import ErrorHandler from "../lib/errorHandler.js";
import ResponseHandler from "../lib/responseHandler.js";
import { COOKIES_SAMESITE, COOKIES_SECURE } from "../config/env.js";

// Class used in 'auth.routes.js' that contains request handlers
export default class AuthController {
    // Register (create) a new user
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
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (!result.success) {
            return new ErrorHandler(res).badRequest(result.error.message, null);
        } else {
            res.cookie("token", result.data, {
                httpOnly: true,
                secure: COOKIES_SECURE === "true",
                sameSite: COOKIES_SAMESITE,
            });
            return ResponseHandler.ok("User Registered!", null, res);
        }
    }
    // Loggin (authenticate) a existing user with credentials (username and password)
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
            return new ErrorHandler(res).internalServer();
        }
        // Send response depending on validations
        if (!result.success) {
            if (result.error.type == "validation")
                return new ErrorHandler(res).badRequest(result.error.message, null);

            if (result.error.type == "not found")
                return new ErrorHandler(res).notFound(result.error.message, null);

            if (result.error.type == "forbidden")
                return new ErrorHandler(res).forbidden(result.error.message, null);
        } else {
            res.cookie("token", result.data, {
                httpOnly: true,
                secure: COOKIES_SECURE === "true",
                sameSite: COOKIES_SAMESITE,
            });
            return ResponseHandler.ok("User Authenticated!", null, res);
        }
    }
    // Check if a user is authenticated by token
    static async isAuthenticated(req, res) {
        const { token } = req.cookies;
        let result;
        try {
            result = await AuthService.verifyToken(token);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        if (!result.success) {
            return new ErrorHandler(res).badRequest(
                result.error.message,
                null
            );
        } else {
            return ResponseHandler.ok("User Authenticated!", null, res);
        }
    }
}
