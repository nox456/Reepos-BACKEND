import User from "../models/user.model.js";
import Auth from "../models/auth.model.js";

export default class AuthService {
    static async signupUser(userData) {
        const { username, password } = userData;

        const passwordEncrypted = await Auth.encryptPassword(password);

        const user = await User.save({ username, password: passwordEncrypted });

        const token = Auth.generateToken(user.id);

        return { user, token };
    }
    static async signinUser(userData) {
        const { username, password } = userData;

        const user = await User.getByUsername(username);

        const matchPassword = await Auth.comparePassword(
            password,
            user.password
        );

        const token = Auth.generateToken(user.id)

        return {
            userData,
            matchPassword,
            user
        };
    }
}
