/**
 * @typedef {Object} Validation
 * @property {string} error - Error message
 * @property {*} data - Data
 * */
/**
 * Validate a group of validations and return error
 * @param {Validation[]} validations
 * @return {{error: string, data: *}} Error message
 * @async
 * */
export default function validationHandler(validations) {
    for (const validation of validations) {
        if (validation.error) return validation;
    }
    for (const validation of validations) {
        if (validation.data) return validation;
    }
    return { error: null }
}
