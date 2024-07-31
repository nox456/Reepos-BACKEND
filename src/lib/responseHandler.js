/**
 * Handle requests responses
 * */
export default class ResponseHandler {
    /**
     * Send OK (200) responses with message and data
     * @param {string} message - Response message
     * @param {Object} data - Response data
     * @param {Function} res - Response function
     * */
    static ok(message, data, res) {
        return res.status(200).json({ message, data })
    }
    /**
     * Send ERROR (404, 400, 500, etc) responses with message and status code
     * @param {int} code - Response status code
     * @param {string} message - Response message
     * @param {Function} res - Response function
     * */
    static error(code, message, res) {
        return res.status(code).json({ message })
    }
}
