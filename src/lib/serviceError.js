export default class ServiceError {
    constructor(message,type) {
        this.success = false
        this.error.message = message
        this.error.type = type
        this.data = null
    }
}
