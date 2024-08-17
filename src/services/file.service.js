import File from "../models/file.model.js";
import Auth from "../models/auth.model.js";
import Repository from "../models/repository.model.js";
import User from "../models/user.model.js";
import validationHandler from "../lib/validationHandler.js";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "../lib/constants/errors.js";
import { nullable } from "zod";

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
        const validation = validationHandler([
            await File.validateId(id),
            Auth.validateToken(token),
            await Repository.validateRepoName(repoName)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

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

        const existsInCloud = await File.checkIfExistsInCloud(repoName, id,validation.data);
        if (!existsInCloud)
            return {
                success: false,
                error: {
                    message: "File doesn't exists in cloud storage",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const user_exists = await User.checkIfExistsById(validation.data);
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
            validation.data,
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
            validation.data,
        );
        return {
            success: true,
            error: null,
            data: fileUrl,
        };
    }
    /**
     * Get info
     * @param {string} id - File ID
     * @param {string} repoName - Repository name
     * @param {string} username - User name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async getInfo(id,repoName,username) {
        const validation = validationHandler([
            await File.validateId(id),
            await User.validateUsername(username),
            await Repository.validateRepoName(repoName)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const exists = await File.checkIfExistsInDb(id)
        if (!exists) return {
            success: false,
            error: {
                message: "File doesn't exists!",
                type: NOT_FOUND
            },
            data: null
        }
        
        const repo_existsDb = await Repository.checkIfExistsInDb(repoName)
        if (!repo_existsDb) return {
            success: false,
            error: {
                message: "Repository doesn't exists in database!",
                type: NOT_FOUND
            },
            data: null
        }

        const user_exists = await User.checkIfExistsByUsername(username)
        if (!user_exists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: NOT_FOUND
            },
            data: null
        }

        const user = await User.getByUsername(username)

        const userHasRepo = await Repository.checkIfUserHasRepo(repoName,user.id)
        if (!userHasRepo) return {
            success: false,
            error: {
                message: "User doesn't have the repository!",
                type: FORBIDDEN
            },
            data: null
        }

        const repo_existsCloud = await Repository.checkIfExistsInCloud(repoName,user.id)
        if (!repo_existsCloud) return {
            success: false,
            error: {
                message: "Repository doesn't exists in cloud storage!",
                type: NOT_FOUND
            },
            data: null
        }

        const info = await File.getInfo(id,repoName,user.id)
        return {
            success: true,
            error: null,
            data: info
        }
    }
}
