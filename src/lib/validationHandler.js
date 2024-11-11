import * as Types from "./types.js";

/**
 * Validate a group of validations and return error
 * @param {Types.Validation[]} validations
 * @return {Types.Validation} Error message
 * @async
 * */
export default function validationHandler(validations) {
    for (const validation of validations) {
        if (validation.error) return validation;
    }
    for (const validation of validations) {
        if (validation.data) return validation;
    }
    return { error: null };
}
