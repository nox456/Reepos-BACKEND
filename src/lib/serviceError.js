export default class ServiceError {
    constructor(message, type) {
        this.success = false;
        this.error = { message, type };
        this.data = null;
    }
}
