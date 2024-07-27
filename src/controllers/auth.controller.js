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
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(
                userRegistered.validationError,
                userRegistered.validationField,
            );
        } else if (result.userExists) {
            return new ErrorHandler(res).forbidden(
                "User already exists!",
                username,
            );
        } else {
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: COOKIES_SECURE === "true",
                sameSite: COOKIES_SAMESITE
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
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(
                userAuthenticated.validationError,
                userAuthenticated.validationField,
            );
        } else if (result.userNotExists) {
            return new ErrorHandler(res).notFound(
                "User doesn't Exists!",
                username,
            );
        } else if (result.passwordNotMatch) {
            return new ErrorHandler(res).forbidden(
                "Password Incorrect!",
                password,
            );
        } else {
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: COOKIES_SECURE === "true",
                sameSite: COOKIES_SAMESITE
            });
            return ResponseHandler.ok(
                "User Authenticated!",
                null,
                res,
            );
        }
    }
    // Check if a user is authenticated
    static async isAuthenticated(req, res) {
        const { token } = req.cookies;
        let result;
        try {
            result = await AuthService.verifyToken(token);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        if (result.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result == false) {
            return new ErrorHandler(res).unauthorized("Invalid Token!", token);
        }
        return ResponseHandler.ok("User Authenticated!", token, res);
    }
}
