import AuthService from "../services/auth.service.js";
import ErrorHandler from "../errors/errorHandler.js"

export default class AuthController {
    static async signup(req, res) {
        const { username, password } = req.body;
        let userRegistered;
        try {
            userRegistered = await AuthService.signupUser({
                username,
                password,
            });
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer()
        }
        if (userRegistered.userExists) {
            return new ErrorHandler(res).badRequest("User already Exists!", username)
        } else {
            return res
                .status(200)
                .json({ message: "User Registered!", data: userRegistered });
        }
    }
    static async signin(req, res) {
        const { username, password } = req.body;
        let userAuthenticated;
        try {
            userAuthenticated = await AuthService.signinUser({
                username,
                password,
            });
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer()
        }
        if (userAuthenticated.userNotExists) {
            return new ErrorHandler(res).badRequest("User doesn't Exists!", username)
        } else if (userAuthenticated.passwordNotMatch) {
            return new ErrorHandler(res).unauthorized("Password Incorrect!", password)
        } else {
            return res.status(200).json({
                message: "User Authenticated!",
                data: {
                    user: userAuthenticated.user,
                    token: userAuthenticated.token,
                },
            });
        }
    }
    static async signinWithToken(req, res) {
        const { token } = req.body

        let user
        try {
            user = await AuthService.signinUserWithToken(token)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (user.isUnauthorized) {
            return new ErrorHandler(res).unauthorized("User Unauthorized!", token)
        } else {
            return res.status(200).json({
                message: "User Authenticated!",
                data: {
                    user,
                    token
                },
            });
        }
    }
}
