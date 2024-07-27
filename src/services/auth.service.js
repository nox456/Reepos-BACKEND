import User from "../models/user.model.js";
import Auth from "../models/auth.model.js";

// Class used in 'auth.controller.js' that contains validations and queries of models
export default class AuthService {
    // Signup a user by username and password
    static async signupUser(userData) {
        const { username, password } = userData;

        const username_validation_error = await User.validateUsername(username);
        if (username_validation_error)
            return {
                success: false,
                error: {
                    message: username_validation_error.validationError,
                    type: "validation",
                },
                data: null,
            };

        const password_validation_error = await User.validatePassword(password);
        if (password_validation_error)
            return {
                success: false,
                error: {
                    message: password_validation_error.validationError,
                    type: "validation",
                },
                data: null,
            };

        const userExists = await User.checkIfExistsByUsername(username);

        if (userExists)
            return {
                success: false,
                error: {
                    message: "User already exists!",
                    type: "exists",
                },
                data: null,
            };

        const passwordEncrypted = await Auth.encryptPassword(password);

        const user = await User.save({ username, password: passwordEncrypted });

        const token = Auth.generateToken(user.id);

        return {
            success: true,
            error: null,
            data: token,
        };
    }
    // Signin a user by username and password
    static async signinUser(userData) {
        const { username, password } = userData;

        const username_validation_error = await User.validateUsername(username);
        if (username_validation_error)
            return {
                success: false,
                error: {
                    message: username_validation_error.validationError,
                    type: "validation",
                },
                data: null,
            };

        const password_validation_error = await User.validatePassword(password);
        if (password_validation_error)
            return {
                success: false,
                error: {
                    message: password_validation_error.validationError,
                    type: "validation",
                },
                data: null,
            };

        const userExists = await User.checkIfExistsByUsername(username);

        if (!userExists)
            return {
                success: false,
                error: {
                    message: "User doesn't exists!",
                    type: "not found",
                },
                data: null,
            };

        const user = await User.getByUsername(username);

        const matchPassword = await Auth.comparePassword(
            password,
            user.password,
        );

        if (!matchPassword)
            return {
                success: false,
                error: {
                    message: "Invalid Password!",
                    type: "forbidden",
                },
                data: null,
            };

        const token = Auth.generateToken(user.id);

        return {
            success: true,
            error: null,
            data: token,
        };
    }
    // Verify token's user
    static async verifyToken(token) {
        const token_validation = await Auth.validateToken(token);
        if (token_validation.error) {
            return {
                success: false,
                error: {
                    message: token_validation.error,
                    type: "validation",
                },
                data: null,
            };
        } else {
            return {
                success: true,
                error: null,
                data: token_validation.data,
            };
        }
    }
}
