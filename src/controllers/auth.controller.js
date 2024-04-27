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
        return res
            .status(200)
            .json({ message: "User Registered!", data: userRegistered });
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
        if (userAuthenticated.matchPassword) {
            return res.status(200).json({
                message: "User Authenticated!",
                data: {
                    user: userAuthenticated.user,
                    token: userAuthenticated.token,
                },
            });
        } else {
            return new ErrorHandler(res).unauthorized("Password Incorrect!", userAuthenticated.userData)
        }
    }
    static async signupSession(req, res) {
        const { token } = req.body

        let userAuthenticated
        try {
            const session = await AuthService.signupUserWithSession(token)
            if (session) {
                const { username, password } = session

                userAuthenticated = await AuthService.signinUser({ username, password })

                return res.status(200).json({
                    message: "User Authenticated!",
                    data: {
                        user: userAuthenticated.user,
                        token: userAuthenticated.token,
                    },
                });
            } else {
                return new ErrorHandler(res).unauthorized("User Unauthorized!",token)
            }
        } catch(e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
    }
}
