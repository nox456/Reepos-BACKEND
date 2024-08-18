import User from "../models/user.model.js";
import Auth from "../models/auth.model.js";
import validationHandler from "../lib/validationHandler.js"
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "../lib/constants/errors.js";

/**
 * Service to handle auth proccesses
 * */
export default class AuthService {
    /**
     * @typedef {Object} UserData
     * @property {string} username - User name
     * @property {string} password - User password
     *
     * @typedef {Object} ErrorType
     * @property {string} message - Error message
     * @property {string} type - Error Type
     *
     * @typedef {Object} ServiceResult
     * @property {boolean} success
     * @property {?ErrorType} error - Error object
     * @property {*} data - Result Data
     * */
    /**
     * Signup process to register a user in database and authenticate it
     * @param {UserData} userData - User Data
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async signupUser(userData) {
        const { username, password } = userData;

        const validation = validationHandler([
            await User.validateUsername(username),
            await User.validatePassword(password)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const userExists = await User.checkIfExistsByUsername(username);

        if (userExists)
            return {
                success: false,
                error: {
                    message: "Usuario ya existe!",
                    type: BAD_REQUEST,
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
    /**
     * Signin a user validating username and password
     * @param {UserData} userData 
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async signinUser(userData) {
        const { username, password } = userData;

        const validation = validationHandler([
            await User.validateUsername(username),
            await User.validatePassword(password)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const userExists = await User.checkIfExistsByUsername(username);

        if (!userExists)
            return {
                success: false,
                error: {
                    message: "Usuario no existe!",
                    type: NOT_FOUND,
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
                    message: "Contraseña invalida!",
                    type: FORBIDDEN,
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
    /**
     * Validate a JWT token and get user info
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async isAuthenticated(token) {
        const token_validation = Auth.validateToken(token);
        if (token_validation.error) {
            return {
                success: false,
                error: {
                    message: token_validation.error,
                    type: BAD_REQUEST,
                },
                data: null,
            };
        }
        
        const user = await User.getById(token_validation.data)

        return {
            success: true,
            error: null,
            data: user
        }
    }
}
