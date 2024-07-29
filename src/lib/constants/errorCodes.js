import * as errors from "./errors.js";

export default {
    [errors.INTERNAL_SERVER_ERROR]: 500,
    [errors.BAD_REQUEST]: 400,
    [errors.FORBIDDEN]: 403,
    [errors.NOT_FOUND]: 404,
};
