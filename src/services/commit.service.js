import Commit from "../models/commit.model.js";
import Auth from "../models/auth.model.js";
import Repository from "../models/repository.model.js"
import validationHandler from "../lib/validationHandler.js";
import {BAD_REQUEST, NOT_FOUND} from "../lib/constants/errors.js"

/**
 * Service to handle commits proccesses
 * */
export default class CommitService {
    /**
     * @typedef {Object} ErrorType
     * @property {string} message - Error message
     * @property {string} type - Error Type
     *
     * @typedef {Object} Commit
     * @property {string} title - Commit title
     * @property {string} author - Commit author
     * @property {string} created_at - Date of creation
     * @property {string} hash - Commit hash
     *
     * @typedef {Object} ServiceResult
     * @property {boolean} success
     * @property {?ErrorType} error - Error object
     * @property {*} data - Result Data
     * */
    /**
     * Get all commits from a repository
     * @param {string} repoName - Repository name
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async getAll(repoName, token) {
        const validation = validationHandler([
            await Repository.validateRepoName(repoName),
            Auth.validateToken(token)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const existsDb = await Repository.checkIfExistsInDb(repoName)
        if (!existsDb) return {
            success: false,
            error: {
                message: "Repository doesn't exists!",
                type: NOT_FOUND
            },
            data: null
        }

        const userHasRepo = await Repository.checkIfUserHasRepo(repoName,validation.data)
        if (!userHasRepo) return {
            success: false,
            error: {
                message: "User doesn't have the repository!",
                type: NOT_FOUND
            },
            data: null
        }

        const commits = await Commit.getAll(repoName,validation.data)
        return {
            success: true,
            error: null,
            data: commits
        }
    }
    /**
     * Get full information of commit by hash
     * @param {string} hash - Commit hash
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async getInfo(hash) {
        const validation = validationHandler([
            await Commit.validateHash(hash)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const exists = await Commit.checkIfExists(hash)
        if (!exists) return {
            success: false,
            error: {
                message: "Commit doesn't exists!",
                type: NOT_FOUND
            },
            data: null
        }

        const info = await Commit.getFullInfo(hash)
        return {
            success: true,
            error: null,
            data: info
        }
    }
}
