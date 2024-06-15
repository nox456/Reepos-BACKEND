import bcryptjs from "bcryptjs";
import { SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import { z } from "zod"

// Class used in 'auth.service.js' that contains functions related with auth services
export default class Auth {
    // Encrypt a user password
    static async encryptPassword(password) {
        const salt = await bcryptjs.genSalt();
        const passwordEncrypted = await bcryptjs.hash(password, salt);
        return passwordEncrypted
    }
    // Create a JWT token with the user ID
    static generateToken(userId) {
        return jwt.sign(userId, SECRET);
    }
    // Compare a password sended by requests with a password storeed in database
    static async comparePassword(requestPassword, storedPassword) {
        return await bcryptjs.compare(requestPassword, storedPassword)
    } 
    // Validate input of token field
    static async validateToken(token) {
        const schema = z.string({ required_error: "Token required!" })
        const validation = await schema.safeParseAsync(token)
        if (!validation.success) {
            return {
                validationError: validation.error.issues[0].message,
                validationField: token
            }
        }
        return jwt.verify(token,SECRET, (err,encoded) => {
            if (err) {
                return false
            } else {
                return encoded
            }
        })
    }
}
