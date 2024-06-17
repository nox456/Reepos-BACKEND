// Send response with error status code, data and message
export default class ErrorHandler {
    constructor(response) {
        this.response = response
    }
    badRequest(message, data) {
        return this.response.status(400).json({ status: 400, message, data })
    }
    notFound(message, data) {
        return this.response.status(404).json({ status: 404, message, data })
    }
    unauthorized(message, data) {
        return this.response.status(401).json({ status: 401, message, data })
    }
    internalServer() {
        return this.response.status(500).json({ message: "Internal Server Error", status: 500 })
    }
    forbidden(message,data) {
        return this.response.status(403).json({ status: 403, message, data  })
    }
}
