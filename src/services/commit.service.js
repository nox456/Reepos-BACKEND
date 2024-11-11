import Commit from "../models/commit.model.js";
import Repository from "../models/repository.model.js";
import User from "../models/user.model.js";
import validationHandler from "../lib/validationHandler.js";
import { BAD_REQUEST, NOT_FOUND } from "../lib/constants/errors.js";
import ServiceError from "../lib/serviceError.js";
import * as Types from "../lib/types.js";

/**
 * Service to handle commits proccesses
 * */
export default class CommitService {
    /**
     * Get all commits from a repository
     * @param {string} repoName - Repository name
     * @param {string} token - JWT Token
     * @return {Promise<Types.ServiceResult>} Service result object
     * @async
     * */
    static async getAll(repoName, username) {
        const validation = validationHandler([
            await Repository.validateRepoName(repoName),
            await User.validateUsername(username),
        ]);
        if (validation.error)
            return new ServiceError(validation.error, BAD_REQUEST);

        const existsDb = await Repository.checkIfExistsInDb(repoName);
        if (!existsDb)
            return new ServiceError("Repositorio no existe!", NOT_FOUND);

        const user_exists = await User.checkIfExistsByUsername(username);
        if (!user_exists)
            return new ServiceError("Usuario no existe!", NOT_FOUND);

        const user = await User.getByUsername(username);

        const userHasRepo = await Repository.checkIfUserHasRepo(
            repoName,
            user.id,
        );
        if (!userHasRepo)
            return new ServiceError(
                "Usuario no tiene el repositorio!",
                NOT_FOUND,
            );

        const commits = await Commit.getAll(repoName, user.id);
        return {
            success: true,
            error: null,
            data: commits,
        };
    }
    /**
     * Get full information of commit by hash
     * @param {string} hash - Commit hash
     * @return {Promise<Types.ServiceResult>} Service result object
     * @async
     * */
    static async getInfo(hash, repoName, username) {
        const validation = validationHandler([
            await Commit.validateHash(hash),
            await Repository.validateRepoName(repoName),
            await User.validateUsername(username),
        ]);
        if (validation.error)
            return new ServiceError(validation.error, BAD_REQUEST);

        const exists = await Commit.checkIfExists(hash);
        if (!exists) return new ServiceError("Commit no existe!", NOT_FOUND);

        const user_exists = await User.checkIfExistsByUsername(username);
        if (!user_exists)
            return new ServiceError("Usuario no existe!", NOT_FOUND);

        const repo_exists = await Repository.checkIfExistsInDb(repoName);
        if (!repo_exists)
            return new ServiceError("Repositorio no existe!", NOT_FOUND);

        const user = await User.getByUsername(username);

        const info = await Commit.getFullInfo(hash, repoName, user.id);
        return {
            success: true,
            error: null,
            data: info,
        };
    }
}
