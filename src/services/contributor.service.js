import Contributor from "../models/contributor.model.js";
import Repository from "../models/repository.model.js"
import User from "../models/user.model.js"
import validationHandler from "../lib/validationHandler.js"
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
     * @property {*} data - Result Data
     * */
    /**
     * Get all contributors from a repository
     * @param {string} repoName - Repository name
     * @param {string} username - User name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async getAll(repoName, username) {
        const validation = validationHandler([
            await Repository.validateRepoName(repoName),
            await User.validateUsername(username)
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
                message: "Repositorio no existe!",
                type: NOT_FOUND
            },
            data: null
        }

        const user_exists = await User.checkIfExistsByUsername(username)
        if (!user_exists) return {
            success: false,
            error: {
                message: "Usuario no existe!",
                type: NOT_FOUND
            },
            data: null
        }

        const user = await User.getByUsername(username)

        const userHasRepo = await Repository.checkIfUserHasRepo(repoName, user.id)
        if (!userHasRepo) return {
            success: false,
            error: {
                message: "Usuario no tiene el repositorio!",
                type: NOT_FOUND
            },
            data: null
        }

        const contributors = await Contributor.getAll(repoName,user.id)
        return {
            success: true,
            error: null,
            data: contributors
        }
    }
}
