import bcryptjs from "bcryptjs";
import { SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

/**
 * Authentication class
 * */
export default class Auth {
    /**
     * Encrypt a password
     * @param {string} password - The user's password to be encrypted
     * @return {Promise<string>} The user's password encrypted
     * @async
     * */
    static async encryptPassword(password) {
        const salt = await bcryptjs.genSalt();
        const passwordEncrypted = await bcryptjs.hash(password, salt);
        return passwordEncrypted;
    }
    /**
     * Generate Token by user's ID
     * @param {string} userId - The user's ID
     * @return {string} JWT Token
     * */
    static generateToken(userId) {
        return jwt.sign(userId, SECRET);
    }
    /**
     * Compare a raw password with a encrypted password
     * @param {string} rawPassword - The raw password
     * @param {string} encryptedPassword - The encrypted password
     * @return {Promise<boolean>} If both passwords are equals returns true, if not false
     * @async
     * */
    static async comparePassword(rawPassword, encryptedPassword) {
        return await bcryptjs.compare(rawPassword, encryptedPassword);
    }
    /**
     * @typedef {Object} Result
     * @property {?string} error
     * @property {?string} data
     * */
    /**
     * Verify a JWT Token
     * @param {string} token - JWT Token
     * @return {Result} Result data
     * */
    static validateToken(token) {
        let error = null;
        let data = null;
        jwt.verify(token, SECRET, (err, encoded) => {
            if (err) {
                error = err.message;
            } else {
                data = encoded;
            }
        });
        return {
            error,
            data,
        };
    }
}
