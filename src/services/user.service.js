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
        return { id }
    }
}
