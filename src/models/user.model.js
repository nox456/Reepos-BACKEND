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
            const user_response = await db.query("SELECT * FROM users WHERE username = $1",[username])
            user = user_response.rows[0]
        } catch(e) {
            console.error(e)
        }
        return user
    }
}
