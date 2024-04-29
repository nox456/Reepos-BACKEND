import db from "../database/connection.js";

export default class User {
    static async save(data) {
        const { username, password } = data;
        let user;
        try {
            const user_response = await db.query(
                "INSERT INTO users VALUES (DEFAULT,$1,$2,DEFAULT,DEFAULT,DEFAULT,DEFAULT,DEFAULT) RETURNING *",
                [username, password]
            );
            user = user_response.rows[0];
        } catch (e) {
            console.error(e);
        }
        return user;
    }
    static async getByUsername(username) {
        let user
        try {
            const user_response = await db.query("SELECT * FROM users WHERE username = $1", [username])
            user = user_response.rows[0]
        } catch (e) {
            console.error(e)
        }
        return user
    }
    static async getById(id) {
        let user
        try {
            const user_response = await db.query("SELECT * FROM users WHERE id = $1", [id])
            user = user_response.rows[0]
        } catch (e) {
            console.error(e)
        }
        return user
    }
    static async delete(id) {
        try {
            await db.query("DELETE FROM users WHERE id = $1", [id])
        } catch (e) {
            console.error(e)
        }
    }
    static async checkIfExistsById(id) {
        let usersExists
        try {
            const user_response = await db.query("SELECT id FROM users WHERE id = $1", [id])
            usersExists = user_response.rows.length > 0
        } catch (e) {
            console.error(e)
        }
        return usersExists
    }
    static async checkIfExistsByUsername(username) {
        let usersExists
        try {
            const user_response = await db.query("SELECT username FROM users WHERE username = $1", [username])
            usersExists = user_response.rows.length > 0
        } catch (e) {
            console.error(e)
        }
        return usersExists
    }
    static async changeUsername(newUsername, id) {
        try {
            await db.query("UPDATE users SET username = $1 WHERE id = $2", [newUsername, id])
        } catch(e) {
            console.error(e)
        }
    }
}
