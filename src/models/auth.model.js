import bcryptjs from "bcryptjs";
import { SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

export default class Auth {
    static async encryptPassword(password) {
        const salt = await bcryptjs.genSalt();
        const passwordEncrypted = await bcryptjs.hash(password, salt);
        return passwordEncrypted
    }
    static generateToken(userId) {
        return jwt.sign(userId, SECRET);
    }
    static async comparePassword(requestPassword, storedPassword) {
        return await bcryptjs.compare(requestPassword, storedPassword)
    }
    static async validateToken(token) {
        return jwt.verify(token,SECRET)
    }
}
