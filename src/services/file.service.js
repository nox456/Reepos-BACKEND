import File from "../models/file.model.js";
import { BAD_REQUEST, NOT_FOUND } from "../lib/constants/errors.js";

/**
 * Service to handle files proccesses
 * */
export default class FileService {
    /**
     * @typedef {Object} ErrorType
     * @property {string} message - Error message
     * @property {string} type - Error Type
     *
     * @typedef {Object} ServiceResult
     * @property {boolean} success
     * @property {?ErrorType} error - Error object
     * @property {*} data - Result Data
     * */
    /**
     * Get public URL of a file to download
     * @param {string} id - File ID
     * @param {string} repoName - Repository Name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async download(id, repoName) {
        const id_validation = await File.validateId(id);
        if (id_validation.error)
            return {
                success: false,
                error: {
                    message: id_validation.error,
                    type: BAD_REQUEST,
                },
                data: null,
            };

        const existsInDb = await File.checkIfExistsInDb(id);
        if (!existsInDb)
            return {
                success: false,
                error: {
                    message: "File doesn't exists in database!",
                    type: "not found",
                },
                data: null,
            };

        const existsInCloud = await File.checkIfExistsInCloud(repoName, id);
        if (!existsInCloud)
            return {
                success: false,
                error: {
                    message: "File doesn't exists in cloud storage",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const fileUrl = await File.download(id, repoName);
        return {
            success: true,
            error: null,
            data: fileUrl,
        };
    }
}
