import User from "../models/user.model.js";
import Auth from "../models/auth.model.js";
import validationHandler from "../lib/validationHandler.js";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "../lib/constants/errors.js";
import ServiceError from "../lib/serviceError.js";
import Types from "../lib/types.js"

/**
 * Service to handle auth proccesses
 * */
export default class AuthService {
    /**
     * Signup process to register a user in database and authenticate it
     * @param {Types.UserData} userData - User Data
     * @return {Promise<Types.ServiceResult>} Service result object
     * @async
     * */
    static async signupUser(userData) {
        const { username, password } = userData;

        const validation = validationHandler([
            await User.validateUsername(username),
            await User.validatePassword(password),
        ]);
        if (validation.error)
            return new ServiceError(validation.error, BAD_REQUEST);

        const userExists = await User.checkIfExistsByUsername(username);

        if (userExists)
            return new ServiceError("Usuario ya existe!", BAD_REQUEST);

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
     * @param {Types.UserData} userData
     * @return {Promise<Types.ServiceResult>} Service result object
     * @async
     * */
    static async signinUser(userData) {
        const { username, password } = userData;

        const validation = validationHandler([
            await User.validateUsername(username),
            await User.validatePassword(password),
        ]);
        if (validation.error)
            return new ServiceError(validation.error, BAD_REQUEST);

        const userExists = await User.checkIfExistsByUsername(username);

        if (!userExists)
            return new ServiceError("Usuario no existe!", NOT_FOUND);

        const user = await User.getByUsername(username);

        const matchPassword = await Auth.comparePassword(
            password,
            user.password,
        );

        if (!matchPassword)
            return new ServiceError("Contraseña invalida!", FORBIDDEN);

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
     * @return {Promise<Types.ServiceResult>} Service result object
     * @async
     * */
    static async isAuthenticated(token) {
        const token_validation = Auth.validateToken(token);
        if (token_validation.error)
            return new ServiceError(token_validation.error, BAD_REQUEST);

        const user = await User.getById(token_validation.data);

        return {
            success: true,
            error: null,
            data: user,
        };
    }
}
