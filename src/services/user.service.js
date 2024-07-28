import User from "../models/user.model.js"
import Auth from "../models/auth.model.js"

// Class used in 'user.controller.js' that contains validations and user model queries
export default class UserService {
    // Delete a user by id and password
    static async deleteUser(token, password) {
        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const id_validation = await User.validateId(token_validation.data)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const password_validation = await User.validatePassword(password)
        if (password_validation) return {
            success: false,
            error: {
                message: password_validation.validationError,
                type: "forbidden"
            },
            data: null
        }

        const userExists = await User.checkIfExistsById(token_validation.data)

        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists",
                type: "not found"
            },
            data: null
        }

        const storedUser = await User.getById(token_validation.data)

        const storedPassword = storedUser.password

        const matchPassword = await Auth.comparePassword(password, storedPassword)

        if (!matchPassword) return {
            success: false,
            error: {
                message: "Invalid Password",
                type: "forbidden"
            },
            data: null
        }

        await User.delete(token_validation.data)
        return {
            success: true,
            error: null,
            data: null
        }
    }
    // Change username field of a user by id and password
    static async changeUsername(newUsername, token, password) {
        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const username_validation = await User.validateUsername(newUsername)
        if (username_validation) return {
            success: false,
            error: {
                message: username_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const id_validation = await User.validateId(token_validation.data)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const password_validation = await User.validatePassword(password)
        if (password_validation) return {
            success: false,
            error: {
                message: password_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const userExists = await User.checkIfExistsById(token_validation.data)

        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: "not found"
            },
            data: null
        }

        const user = await User.getById(token_validation.data)

        const matchPassword = await Auth.comparePassword(password, user.password)

        if (!matchPassword) return {
            success: false,
            error: {
                message: "Invalid Password!",
                type: "forbidden"
            },
            data: null
        }

        await User.changeUsername(newUsername, token_validation.data)
        return {
            success: true,
            error: null,
            data: null
        }
    }
    // Change password field of a user by id and password
    static async changePassword(newPassword, token, password) {
        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const newPassword_validation = await User.validatePassword(newPassword)
        if (newPassword_validation) return {
            success: false,
            error: {
                message: newPassword_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const id_validation = await User.validateId(token_validation.data)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const password_validation = await User.validatePassword(password)
        if (password_validation) return {
            success: false,
            error: {
                message: password_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const userExists = await User.checkIfExistsById(token_validation.data)

        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: "not found"
            },
            data: null
        }

        const user = await User.getById(token_validation.data)

        const matchPassword = await Auth.comparePassword(password, user.password)

        if (!matchPassword) return {
            success: false,
            error: {
                message: "Invalid Password!",
                type: "forbidden"
            },
            data: null
        }

        const encryptedPassword = await Auth.encryptPassword(newPassword)

        await User.changePassword(encryptedPassword, token_validation.data)
        return {
            success: true,
            error: null,
            data: null
        }
    }
    // Change description field of a user by id
    static async changeDescription(newDescription, token) {
        const token_validation =  await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const id_validation = await User.validateId(token_validation.data)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const description_validation = await User.validateDescription(newDescription)
        if (description_validation) return {
            success: false,
            error: {
                message: description_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const userExists = await User.checkIfExistsById(token_validation.data)

        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: "not found"
            },
            data: null
        }

        await User.changeDescription(newDescription, token_validation.data)
        return {
            success: true,
            error: null,
            data: null
        }
    }
    // Change image field of a user by id
    static async changeImage(image, token) {
        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const id_validation = await User.validateId(token_validation.data)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const userExists = await User.checkIfExistsById(token_validation.data)

        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: "not found"
            },
            data: null
        }

        const imageUrl = await User.changeImage(image, token_validation.data)
        return {
            success: true,
            error: null,
            data: imageUrl
        }
    }
    // Follow a user by id field
    static async followUser(userFollowedId, token) {
        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const userFollowerId_validation = await User.validateId(token_validation.data)
        if (userFollowerId_validation) return {
            success: false,
            error: {
                message: userFollowerId_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const userFollowedId_validation = await User.validateId(userFollowedId)
        if (userFollowedId_validation) return {
            success: false,
            error: {
                message: userFollowedId_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const userExists = await User.checkIfExistsById(token_validation.data)

        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: "not found"
            },
            data: null
        }

        await User.addFollowedUser(userFollowedId, token_validation.data)
        await User.addFollowerUser(token_validation.data, userFollowedId)
        return {
            success: true,
            error: null,
            data: null
        }
    }
    // Get users by username field
    static async search(username) {
        const username_validation = await User.validateUsername(username)
        if (username_validation) return {
            success: false,
            error: {
                message: username_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const users = await User.search(username)
        return {
            success: true,
            error: null,
            data: users
        }
    }
    // Get followers of a user by username
    static async getFollowers(token,username) {
        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const id_validation = await User.validateId(token_validation.data)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        if (username) {
            const username_validation = await User.validateUsername(username)
            if (username_validation) return {
                success: false,
                error: {
                    message: username_validation.validationError,
                    type: "validation"
                },
                data: null
            }
        }

        const userExists = await User.checkIfExistsById(token_validation.data)
        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: "not found"
            },
            data: null
        }

        const followers = await User.getFollowers(token_validation.data,username)
        return {
            success: true,
            error: null,
            data: followers
        }
    }
    // Get profile info a user by id
    static async getProfileInfo(token) {
        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

        const id_validation = await User.validateId(token_validation.data)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const userExists = await User.checkIfExistsById(token_validation.data)
        if (!userExists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: "not found"
            },
            data: null
        }
        
        const profileInfo = await User.getProfileInfo(token_validation.data)
        return {
            success: true,
            error: null,
            data: profileInfo
        }
    }
}
