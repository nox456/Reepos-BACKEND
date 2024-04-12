import AuthService from "../services/auth.service.js";

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
            return res.status(500).json({ message: "Internal Server Error" });
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
            return res.status(500).json({ message: "Internal Server Error" });
        }
        if (userAuthenticated.matchPassword) {
            return res.status(200).json({
                message: "User Authenticated!",
                data: userAuthenticated.user,
            });
        } else {
            return res.status(401).json({
                message: "Password Incorrect!",
                data: userAuthenticated.userData,
            });
        }
    }
}
