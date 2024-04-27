import bcryptjs from "bcryptjs";
import { SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import db from "../database/connection.js"

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
    static async createSession(id) {
        try {
            await db.query("INSERT INTO sessions VALUES (DEFAULT,$1)", [id])
        } catch (e) {
            console.error(e)
        }
    }
    static async checkSession(token) {
        let session
        const user_id = jwt.verify(token,SECRET)
        try {
            const session_response = await db.query("SELECT user_id FROM sessions WHERE user_id = $1", [user_id])
            session = session_response.rows[0]
        } catch (e) {
            console.error(e)
        }
        return session;
    }
}
