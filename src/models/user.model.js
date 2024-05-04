import db from "../connections/database.js";
import { SUPABASE_IMAGE_BUCKET } from "../config/env.js"
import supabase from "../connections/supabase.js"
import { extname } from "path"
import { z } from "zod"

export default class User {
    static validation = {
        username: z
            .string({ invalid_type_error: "Username must be a string!", required_error: "Username required!" })
            .min(3, { message: "Username must be 3 or more characters" })
            .max(15, { message: "Username must be less than 15 characters" }),
        password: z
            .string({ invalid_type_error: "Password must be a string!", required_error: "Password required!" })
            .min(1, { message: "Password required!" }),
        description: z.string().max(150),
        img: z.string()
    }
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
        } catch (e) {
            console.error(e)
        }
    }
    static async changePassword(newPassword, id) {
        try {
            await db.query("UPDATE users SET password = $1 WHERE id = $2", [newPassword, id])
        } catch (e) {
            console.error(e)
        }
    }
    static async changeDescription(newDescription, id) {
        try {
            await db.query("UPDATE users SET description = $1 WHERE id = $2", [newDescription, id])
        } catch (e) {
            console.error(e)
        }
    }
    static async changeImage(image, id) {
        const ext = extname(image.originalname)
        let imageUrl
        try {
            const imageUploaded = await supabase.storage.from(SUPABASE_IMAGE_BUCKET).upload(`users-images/${id}${ext}`, image.buffer)
            imageUrl = supabase.storage.from(SUPABASE_IMAGE_BUCKET).getPublicUrl(imageUploaded.data.path)
            await db.query("UPDATE users SET img = $1 WHERE id = $2", [imageUrl.data.publicUrl, id])
        } catch (e) {
            console.error(e)
        }
        return imageUrl.data.publicUrl
    }
    static async addFollowedUser(userFollowedId, userFollowerId) {
        let userFollowed
        try {
            const users_followed_response = await db.query("SELECT followed FROM users WHERE id = $1", [userFollowerId])
            const users_followed = users_followed_response.rows[0].followed
            users_followed.push(userFollowedId)
            userFollowed = await db.query("UPDATE users SET followed = $1 WHERE id = $2 RETURNING *", [users_followed, userFollowerId])
        } catch (e) {
            console.error(e)
        }
        return userFollowed.rows[0]
    }
    static async addFollowerUser(userFollowerId, userFollowedId) {
        try {
            const user_followers_response = await db.query("SELECT followers FROM users WHERE id = $1", [userFollowedId])
            const user_followers = user_followers_response.rows[0].followers
            user_followers.push(userFollowerId)
            await db.query("UPDATE users SET followers = $1 WHERE id = $2 RETURNING *", [user_followers, userFollowedId])
        } catch (e) {
            console.error(e)
        }
    }
}
