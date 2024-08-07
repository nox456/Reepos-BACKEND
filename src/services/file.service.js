import File from "../models/file.model.js";
import Auth from "../models/auth.model.js";
import Repository from "../models/repository.model.js";
import User from "../models/user.model.js";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "../lib/constants/errors.js";

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
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async download(id, repoName, token) {
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

        const token_validation = Auth.validateToken(token);
        if (token_validation.error)
            return {
                success: false,
                error: {
                    message: token_validation.error,
                    type: BAD_REQUEST,
                },
                data: null,
            };

        const existsInCloud = await File.checkIfExistsInCloud(repoName, id,token_validation.data);
        if (!existsInCloud)
            return {
                success: false,
                error: {
                    message: "File doesn't exists in cloud storage",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const user_exists = await User.checkIfExistsById(token_validation.data);
        if (!user_exists)
            return {
                success: false,
                error: {
                    message: "User doesn't exists!",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const userHasRepo = await Repository.checkIfUserHasRepo(
            repoName,
            token_validation.data,
        );
        if (!userHasRepo)
            return {
                success: false,
                error: {
                    message: "User doesn't have the repository!",
                    type: FORBIDDEN,
                },
                data: null,
            };

        const fileUrl = await File.download(
            id,
            repoName,
            token_validation.data,
        );
        return {
            success: true,
            error: null,
            data: fileUrl,
        };
    }
}
