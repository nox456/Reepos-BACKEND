import User from "../models/user.model.js"
import Auth from "../models/auth.model.js"

// Class used in 'user.controller.js' that contains validations and user model queries
export default class UserService {
    // Delete a user by id and password
    static async deleteUser(token, password) {
        const token_result = await Auth.validateToken(token)
        if (token_result?.validationError) return token_result

        const id_validation_error = await User.validateId(token_result)
        if (id_validation_error) return id_validation_error

        const password_validation_error = await User.validatePassword(password)
        if (password_validation_error) return password_validation_error

        const userExists = await User.checkIfExistsById(token_result)

        if (!userExists) return { userNotExists: true }

        const storedUser = await User.getById(token_result)

        const storedPassword = storedUser.password

        const matchPassword = await Auth.comparePassword(password, storedPassword)

        if (!matchPassword) return { passwordNotMatch: true }

        await User.delete(token_result)
    }
    // Change username field of a user by id and password
    static async changeUsername(newUsername, token, password) {
        const token_result = await Auth.validateToken(token)
        if (token_result?.validationError) return token_result

        const username_validation_error = await User.validateUsername(newUsername)
        if (username_validation_error) return username_validation_error

        const id_validation_error = await User.validateId(token_result)
        if (id_validation_error) return id_validation_error

        const password_validation_error = await User.validatePassword(password)
        if (password_validation_error) return password_validation_error

        const userExists = await User.checkIfExistsById(token_result)

        if (!userExists) return { userNotExists: true }

        const user = await User.getById(token_result)

        const matchPassword = await Auth.comparePassword(password, user.password)

        if (!matchPassword) return { passwordNotMatch: true }

        await User.changeUsername(newUsername, token_result)
    }
    // Change password field of a user by id and password
    static async changePassword(newPassword, token, password) {
        const token_result = await Auth.validateToken(token)
        if (token_result?.validationError) return token_result

        const newPassword_validation_error = await User.validatePassword(newPassword)
        if (newPassword_validation_error) return newPassword_validation_error

        const id_validation_error = await User.validateId(token_result)
        if (id_validation_error) return id_validation_error

        const password_validation_error = await User.validatePassword(password)
        if (password_validation_error) return password_validation_error

        const userExists = await User.checkIfExistsById(token_result)

        if (!userExists) return { userNotExists: true }

        const user = await User.getById(token_result)

        const matchPassword = await Auth.comparePassword(password, user.password)

        if (!matchPassword) return { passwordNotMatch: true }

        const encryptedPassword = await Auth.encryptPassword(newPassword)

        await User.changePassword(encryptedPassword, token_result)
    }
    // Change description field of a user by id
    static async changeDescription(newDescription, token) {
        const token_result = await Auth.validateToken(token)
        if (token_result?.validationError) return token_result

        const id_validation_error = await User.validateId(token_result)
        if (id_validation_error) return id_validation_error

        const description_validation_error = await User.validateDescription(newDescription)
        if (description_validation_error) return description_validation_error

        const userExists = await User.checkIfExistsById(token_result)

        if (!userExists) return { userNotExists: true }

        await User.changeDescription(newDescription, token_result)
    }
    // Change image field of a user by id
    static async changeImage(image, token) {
        const token_result = await Auth.validateToken(token)
        if (token_result?.validationError) return token_result

        const id_validation_error = await User.validateId(token_result)
        if (id_validation_error) return id_validation_error

        const userExists = await User.checkIfExistsById(token_result)

        if (!userExists) return { userNotExists: true }

        const imageUrl = await User.changeImage(image, token_result)
        return { imageUrl }
    }
    // Follow a user by id field
    static async followUser(userFollowedId, token) {
        const token_result = await Auth.validateToken(token)
        if (token_result.validationError) return token_result

        const userFollowerId_validation_error = await User.validateId(token_result)
        if (userFollowerId_validation_error) return userFollowerId_validation_error

        const userFollowedId_validation_error = await User.validateId(userFollowedId)
        if (userFollowedId_validation_error) return userFollowedId_validation_error

        const userExists = await User.checkIfExistsById(token_result)

        if (!userExists) return { userNotExists: true }

        const userFollowed = await User.addFollowedUser(userFollowedId, token_result)
        await User.addFollowerUser(token_result, userFollowedId)

        return { userFollowed }
    }
    // Get users by username field
    static async search(username) {
        const username_validation_error = await User.validateUsername(username)
        if (username_validation_error) return username_validation_error

        const users = await User.search(username)
        return users
    }
    // Get followers of a user by username
    static async getFollowers(token,username) {
        const token_result = await Auth.validateToken(token)
        if (token_result.validationError) return token_result

        const id_validation_error = await User.validateId(token_result)
        if (id_validation_error) return id_validation_error

        if (username) {
            const username_validation_error = await User.validateUsername(username)
            if (username_validation_error) return username_validation_error
        }

        const userExists = await User.checkIfExistsById(token_result)
        if (!userExists) return { userNotExists: true }

        const followers = await User.getFollowers(token_result,username)
        return followers
    }
    // Get profile info a user by id
    static async getProfileInfo(token) {
        const token_result = await Auth.validateToken(token)
        if (token_result.validationError) return token_result

        const id_validation_error = await User.validateId(token_result)
        if (id_validation_error) return id_validation_error

        const userExists = await User.checkIfExistsById(token_result)
        if (!userExists) return { userNotExists: true }
        
        const profileInfo = await User.getProfileInfo(token_result)
        return profileInfo
    }
}
