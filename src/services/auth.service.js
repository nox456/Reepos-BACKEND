import User from "../models/user.model.js";
import Auth from "../models/auth.model.js";

export default class AuthService {
    static async signupUser(userData) {
        const { username, password } = userData;

        const username_validation = await User.validation.username.safeParseAsync(username)

        if (!username_validation.success) return { validationError: username_validation.error.issues[0].message, validationField: username }

        const password_validation = await User.validation.password.safeParseAsync(password)

        if (!password_validation.success) return { validationError: password_validation.error.issues[0].message, validationField: password }

        const userExists = await User.checkIfExistsByUsername(username)

        if (userExists) return { userExists }

        const passwordEncrypted = await Auth.encryptPassword(password);

        const user = await User.save({ username, password: passwordEncrypted });

        const token = Auth.generateToken(user.id);

        return { user, token };
    }
    static async signinUser(userData) {
        const { username, password } = userData;

        const userExists = await User.checkIfExistsByUsername(username)

        if (!userExists) return { userNotExists: true }

        const user = await User.getByUsername(username);

        const matchPassword = await Auth.comparePassword(
            password,
            user.password
        );

        if (!matchPassword) return { passwordNotMatch: true }

        const token = Auth.generateToken(user.id)

        return {
            userData,
            user,
            token
        };
    }
    static async signinUserWithToken(token) {
        const user_id = await Auth.validateToken(token)

        if (!user_id) return { isUnauthorized: true }

        const user = await User.getById(user_id)

        return user
    }
}
