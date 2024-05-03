import User from "../models/user.model.js"
import Auth from "../models/auth.model.js"

export default class UserService {
    static async deleteUser(id, password) {
        const userExists = await User.checkIfExistsById(id)

        if (!userExists) return { userNotExists: true }

        const storedUser = await User.getById(id)

        const storedPassword = storedUser.password

        const matchPassword = await Auth.comparePassword(password, storedPassword)

        if (!matchPassword) return { passwordNotMatch: true }

        await User.delete(id)
    }
    static async changeUsername(newUsername, userData) {
        const { id, password } = userData

        const userExists = await User.checkIfExistsById(id)

        if (!userExists) return { userNotExists: true }

        const user = await User.getById(id)

        const matchPassword = await Auth.comparePassword(password, user.password)

        if (!matchPassword) return { passwordNotMatch: true }

        await User.changeUsername(newUsername, id)
    }
    static async changePassword(newPassword, userData) {
        const { id, password } = userData

        const userExists = await User.checkIfExistsById(id)

        if (!userExists) return { userNotExists: true }

        const user = await User.getById(id)

        const matchPassword = await Auth.comparePassword(password, user.password)

        if (!matchPassword) return { passwordNotMatch: true }

        const encryptedPassword = await Auth.encryptPassword(newPassword)

        await User.changePassword(encryptedPassword, id)
    }
    static async changeDescription(newDescription, id) {
        const userExists = await User.checkIfExistsById(id)

        if (!userExists) return { userNotExists: true }

        await User.changeDescription(newDescription, id)
    }
    static async changeImage(image, id) {
        const userExists = await User.checkIfExistsById(id)

        if (!userExists) return { userNotExists: true }

        const imageUrl = await User.changeImage(image, id)
        return { imageUrl }
    }
    static async followUser(userFollowedId, userFollowerId) {
        const userExists = await User.checkIfExistsById(userFollowerId)

        if (!userExists) return { userNotExists: true }

        const userFollowed = await User.addFollowedUser(userFollowedId, userFollowerId)
        await User.addFollowerUser(userFollowerId, userFollowedId)

        return { userFollowed }
    }
}
