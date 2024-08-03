import Contributor from "../models/contributor.model.js";
import Auth from "../models/auth.model.js"
import Repository from "../models/repository.model.js"
import {BAD_REQUEST, NOT_FOUND} from "../lib/constants/errors.js"

/**
 * Service to handle contributors proccesses
 * */
export default class ContributorService {
    /**
     * @typedef {Object} ErrorType
     * @property {string} message - Error message
     * @property {string} type - Error Type
     *
     * @typedef {Object} Contributor
     * @property {string} name - Contributor name
     * @property {string} last_commit_title - Last commit of contributor
     * @property {string} commits_created - Commits created by contributor
     *
     * @typedef {Object} ServiceResult
     * @property {boolean} success
     * @property {?ErrorType} error - Error object
     * @property {?Contributor[]} data - Result Data
     * */
    /**
     * Get all contributors from a repository
     * @param {string} repoName - Repository name
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async getAll(repoName, token) {
        const repoName_validation = await Repository.validateRepoName(repoName)
        if (repoName_validation.error) return {
            success: false,
            error: {
                message: repoName_validation.error,
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

        const token_validation = Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const userHasRepo = await Repository.checkIfUserHasRepo(repoName, token_validation.data)
        if (!userHasRepo) return {
            success: false,
            error: {
                message: "User doesn't have the repository!",
                type: NOT_FOUND
            },
            data: null
        }

        const contributors = await Contributor.getAll(repoName,token_validation.data)
        return {
            success: true,
            error: null,
            data: contributors
        }
    }
}
