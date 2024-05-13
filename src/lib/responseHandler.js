export default class ResponseHandler {
    static ok({ message, data }, res) {
        return res.status(200).json({ message, data })
    }
    static userRegistered(data, res) {
        return res.status(200).json({ message: "User Registered!", data })
    }
    static userAuthenticated(data, res) {
        return res.status(200).json({ message: "User Authenticated!", data })
    }
}
