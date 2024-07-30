import db from "../connections/database.js";
import { SUPABASE_IMAGE_BUCKET } from "../config/env.js"
import supabase from "../connections/supabase.js"
import { extname } from "path"
import { z } from "zod"
import { PROFILE_INFO, SEARCH_USERS, USER_FOLLOWERS } from "./queries.js"

/**
 * User class
 * */
export default class User {
    /**
     * @typedef {Object} UserData
     * @property {string} username - User name
     * @property {string} password - User password
     * */
    /**
     * Save a user in database
     * @param {UserData} data - User data 
     * @return {string} User saved ID
     * */
    static async save(data) {
        const { username, password } = data;
        let user;
        try {
            const user_response = await db.query(
                "INSERT INTO users VALUES (DEFAULT,$1,$2,DEFAULT,DEFAULT,DEFAULT,DEFAULT,DEFAULT) RETURNING id",
                [username, password]
            );
            user = user_response.rows[0];
        } catch (e) {
            console.error(e);
        }
        return user;
    }
    /**
     * @typedef {Object} UserType
     * @property {string} id - User ID
     * @property {string} username - User name
     * @property {string} password - User password
     * @property {string} description - User description
     * @property {string} created_at - Date of creation
     * @property {string} img - URL of user image
     * */
    /**
     * Get a user by username
     * @param {string} username - User name 
     * @return {Promise<UserType>} User
     * @async
     * */
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
    /**
     * Get a user by ID
     * @param {string} id - User ID
     * @return {Promise<UserType>} User
     * @async
     * */
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
    /**
     * Delete a user by ID
     * @param {string} id - User ID
     * @async
     * */
    static async delete(id) {
        try {
            await db.query("DELETE FROM users WHERE id = $1", [id])
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * Check if the user exists by username
     * @param {string} id - User ID
     * @return {Promise<boolean>} True if the file exists or False is not
     * @async
     * */
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
    /**
     * Check if the user exists by ID
     * @param {string} username - User name
     * @return {Promise<boolean>} True if the file exists or False is not
     * @async
     * */
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
    /**
     * Change username of user
     * @param {string} newUsername - New username
     * @param {string} id - User ID
     * @async
     * */
    static async changeUsername(newUsername, id) {
        try {
            await db.query("UPDATE users SET username = $1 WHERE id = $2", [newUsername, id])
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * Change password of user
     * @param {string} newPassword - New password 
     * @param {string} id - User ID
     * @async
     * */
    static async changePassword(newPassword, id) {
        try {
            await db.query("UPDATE users SET password = $1 WHERE id = $2", [newPassword, id])
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * Change description of user
     * @param {string} newDescription - New description 
     * @param {string} id - User ID
     * @async
     * */
    static async changeDescription(newDescription, id) {
        try {
            await db.query("UPDATE users SET description = $1 WHERE id = $2", [newDescription, id])
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * Change image of user
     * @param {string} image - Image URL
     * @param {string} id - User ID
     * @return {string} Image public URL
     * */
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
    /**
     * Add a user as followed
     * @param {string} userFollowedId - User followed ID
     * @param {string} userFollowerId - User follower ID
     * @return {Promise<UserType>} User Followed
     * @async
     * */
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
    /**
     * Add a user as follower
     * @param {string} userFollowerId - User follower ID
     * @param {string} userFollowedId - User followed ID
     * @async
     * */
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
    /**
     * @typedef {Object} Result
     * @property {?string} error - Error message 
     * */
    /**
     * Validate ID
     * @param {string} id - User ID
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateId(id) {
        const schema = z
            .string({ invalid_type_error: "ID must be a string!", required_error: "ID required!" })
            .uuid({ message: "ID must be a UUID" })
        const validation = await schema.safeParseAsync(id)
        let error = null
        if (!validation.success) {
            error = validation.error.issues[0].message
        }
        return {
            error
        }
    }
    /**
     * Validate username
     * @param {string} username - User name
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateUsername(username) {
        const schema = z
            .string({ invalid_type_error: "Username must be a string!", required_error: "Username required!" })
            .min(3, { message: "Username must be 3 or more characters" })
            .max(15, { message: "Username must be less than 15 characters" })
        const validation = await schema.safeParseAsync(username)
        let error = null
        if (!validation.success) {
            error = validation.error.issues[0].message
        }
        return {
            error
        }
    }
    /**
     * Validate password
     * @param {string} password - User password
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validatePassword(password) {
        const schema = z
            .string({ invalid_type_error: "Password must be a string!", required_error: "Password required!" })
            .min(1, { message: "Password required!" })
        const validation = await schema.safeParseAsync(password)
        let error = null
        if (!validation.success) {
            error = validation.error.issues[0].message
        }
        return {
            error
        }
    }
    /**
     * Validate description
     * @param {string} description - User description
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateDescription(description) {
        const schema = z
            .string({ invalid_type_error: "Description must be a string!", required_error: "Description required!" })
            .max(150, { message: "Description must be less than 150 characters" })
        const validation = await schema.safeParseAsync(description)
        let error = null
        if (!validation.success) {
            error = validation.error.issues[0].message
        }
        return {
            error
        }
    }
    /**
     * @typedef {Object} UserSearched
     * @property {string} usename - User name
     * @property {string} img - User image URL
     * @property {int} followers_count - Followers count
     * @property {int} repos_count - Repositories count
     * */
    /**
     * Search user by username
     * @param {string} username - User name
     * @return {Promise<UserSearched>} User founded
     * @async
     * */
    static async search(username) {
        let usersFounded
        try {
            const users_response = await db.query(SEARCH_USERS, [`%${username}%`])
            usersFounded = users_response.rows
        } catch (e) {
            console.error(e)
        }
        return usersFounded
    }
    /**
     * @typedef {Object} Follower
     * @property {string} username - Follower name
     * @property {string} img - Follower image URL
     * @property {int} followers_count - Followers count of the follower
     * @property {int} repos_count - Repositories count of the follower
     *
     * @typedef {Object} FollowerType
     * @property {string} user_name - User name
     * @property {Follower[]} followers - Followers
     * */
    /**
     * Get followers
     * @param {string} user_id - User ID
     * @param {string} username - User name to search followers
     * @return {Promise<FollowerType>} Followers founded
     * @async
     * */
    static async getFollowers(user_id, username) {
        let followers
        try {
            const users_response = await db.query(USER_FOLLOWERS, [user_id])
            if (username) {
                followers = users_response.rows[0].followers.filter((follower) => {
                    return follower.username.toLowerCase().includes(username.toLowerCase())
                }
                )
            } else {
                followers = users_response.rows[0].followers
            }
        } catch (e) {
            console.error(e)
        }
        if (!followers[0].username) return []

        return followers
    }
    /**
     * @typedef {Object} ProfileInfo
     * @property {string} user_name - User name
     * @property {string} user_description - User description
     * @property {string} user_img - User image URL
     * @property {int} repos_count - Repositories count
     * @property {int} followers_count - Followers count
     * @property {int} followed_count - Followed count
     * */
    /**
     * Get user's profile info
     * @param {string} user_id - User ID
     * @return {Promise<ProfileInfo>} Profile info
     * */
    static async getProfileInfo(user_id) {
        let profileInfo
        try {
            const profile_response = await db.query(PROFILE_INFO,[user_id])
            profileInfo = profile_response.rows[0]
        } catch(e) {
            console.error(e)
        }
        return profileInfo
    }
}
