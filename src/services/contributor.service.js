import Contributor from "../models/contributor.model.js";
import Repository from "../models/repository.model.js";
import User from "../models/user.model.js";
import validationHandler from "../lib/validationHandler.js";
import { BAD_REQUEST, NOT_FOUND } from "../lib/constants/errors.js";
import ServiceError from "../lib/serviceError.js";
import {ServiceResult,Contributor} from "../lib/types.js"

/**
 * Service to handle contributors proccesses
 * */
export default class ContributorService {
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

        const contributors = await Contributor.getAll(repoName, user.id);
        return {
            success: true,
            error: null,
            data: contributors,
        };
    }
}
