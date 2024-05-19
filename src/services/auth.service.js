import User from "../models/user.model.js";
import Auth from "../models/auth.model.js";

// Class used in 'auth.controller.js' that contains validations and queries of models
export default class AuthService {
    // Signup a user by username and password
    static async signupUser(userData) {
        const { username, password } = userData;

        const username_validation_error = await User.validateUsername(username)
        if (username_validation_error) return username_validation_error

        const password_validation_error = await User.validatePassword(password)
        if (password_validation_error) return password_validation_error

        const userExists = await User.checkIfExistsByUsername(username)

        if (userExists) return { userExists }

        const passwordEncrypted = await Auth.encryptPassword(password);

        const user = await User.save({ username, password: passwordEncrypted });

        const token = Auth.generateToken(user.id);

        return { user, token };
    }
    // Signin a user by username and password
    static async signinUser(userData) {
        const { username, password } = userData;

        const username_validation_error = await User.validateUsername(username)
        if (username_validation_error) return username_validation_error

        const password_validation_error = await User.validatePassword(password)
        if (password_validation_error) return password_validation_error

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
    // Signin a user by JWT token
    static async signinUserWithToken(token) {
        const token_validation_error = await User.validateToken(token)
        if (token_validation_error) return token_validation_error

        const user_id = await Auth.validateToken(token)

        if (!user_id) return { isUnauthorized: true }

        const user = await User.getById(user_id)

        return user
    }
}
