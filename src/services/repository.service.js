import Repository from "../models/repository.model.js";
import Commit from "../models/commit.model.js";
import Branch from "../models/branch.model.js";
import File from "../models/file.model.js";
import Contributor from "../models/contributor.model.js";
import Modification from "../models/modification.model.js";
import Commit_Branch from "../models/commit_branch.model.js";
import Repository_Language from "../models/repository_language.model.js";
import Auth from "../models/auth.model.js";
import Language from "../models/language.model.js";
import User from "../models/user.model.js";
import repoInfo from "../lib/getReposInfo.js";
import downloadFiles from "../lib/downloadFiles.js";
import validationHandler from "../lib/validationHandler.js"
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "../lib/constants/errors.js";

/**
 * Service to handle repositories proccesses
 * */
export default class RepositoryService {
    /**
     * @typedef {Object} RepoData
     * @property {string} name - Repository name
     * @property {string} description - Repository description
     * @property {string[]} languages - Repository languages
     *
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
     * Save a repository in database
     * @param {RepoData} repoData - Repository data
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async createRepository(repoData, token) {
        const { name, description, languages } = repoData;


        const validation = validationHandler([
            await Repository.validateRepoName(name),
            Auth.validateToken(token),
            await Repository.validateDescription(description),
            await Repository.validateLanguages(languages)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const existsBackend = await Repository.checkIfExistsInBackend(name);
        if (!existsBackend)
            return {
                success: false,
                error: {
                    message: "Repository doesn't exists in backend!",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const userHasRepo = await Repository.checkIfUserHasRepo(
            name,
            validation.data,
        );
        if (userHasRepo)
            return {
                success: false,
                error: {
                    message: "User has repository!",
                    type: BAD_REQUEST,
                },
                data: null,
            };

        for (const lang of languages) {
            const lang_exists = await Language.checkIfExists(lang);
            if (!lang_exists)
                return {
                    success: false,
                    error: {
                        message: `Language ${lang} doesn't exists in database!`,
                        type: NOT_FOUND,
                    },
                    data: null,
                };
        }

        const { commits, files, branches, contributors, modifications } =
            await repoInfo(name);

        // Create repository in database
        const repoSaved = await Repository.save({
            name,
            description,
            user_owner: token_validation.data,
        });

        // Relate languages with repository
        for (const language of languages) {
            await Repository_Language.save(repoSaved.id, language);
        }

        // Save the contributors of the repository in database
        const contributorsSaved = [];
        for (const contributor of contributors) {
            contributorsSaved.push(
                await Contributor.save({
                    name: contributor,
                    repo: repoSaved.id,
                }),
            );
        }

        // Save branches of the repository in database
        const branchesSaved = [];
        for (const branch of branches) {
            branchesSaved.push(
                await Branch.save({
                    name: branch.name,
                    type: branch.type,
                    repo: repoSaved.id,
                }),
            );
        }

        // Save commits of the repository in database
        const commitsSaved = [];
        for (const commit of commits) {
            const contributor = contributorsSaved.find(
                (c) => c.name == commit.author,
            ).id;
            const commitSaved = await Commit.save({
                title: commit.title,
                content: commit.content,
                hash: commit.hash,
                author: contributor,
                created_at: commit.created_at,
                repo: repoSaved.id,
            });

            commitsSaved.push(commitSaved);

            const commitBranchesSaved = branchesSaved.filter((b) =>
                commit.branches.includes(b.name),
            );

            // Relate commits with branches
            for (const branchSaved of commitBranchesSaved) {
                await Commit_Branch.save(commitSaved.id, branchSaved.id);
            }
        }

        // Save files of the repository in database
        const filesSaved = [];
        const modificationsSaved = [];
        for (const file of files) {
            const fileSaved = await File.save({
                name: file.name,
                size: file.size,
                path: file.path,
                repo: repoSaved.id,
            });
            filesSaved.push(fileSaved);

            // Save modifications in database
            const fileModifications = modifications.filter(
                (m) => m.file == file.path,
            );

            for (const fileModification of fileModifications) {
                const commit = commitsSaved.find(
                    (c) => c.hash == fileModification.commit,
                ).id;
                modificationsSaved.push(
                    await Modification.save({
                        type: fileModification.type,
                        commit,
                        file: fileSaved.id,
                    }),
                );
            }
        }
        // Save files deleted previously in database
        const deletedFilesModifications = modifications.filter(
            (m) => !filesSaved.some((f) => f.path == m.file),
        );
        for (const modification of deletedFilesModifications) {
            const commit = commitsSaved.find(
                (c) => c.hash == modification.commit,
            ).id;

            const file_name = modification.file.slice(
                modification.file.lastIndexOf("/") + 1,
            );

            const fileSaved = await File.save({
                name: file_name,
                size: "N/A",
                path: modification.file,
                repo: repoSaved.id,
            });

            modificationsSaved.push(
                await Modification.save({
                    type: modification.type,
                    commit,
                    file: fileSaved.id,
                }),
            );
        }
        return {
            success: true,
            error: null,
            data: null,
        };
    }
    /**
     * Upload a repository stored in backend to cloud storage
     * @param {string} repoName - Repository name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async uploadRepository(repoName, token) {
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

        const repoExists = await Repository.checkIfExistsInBackend(repoName);
        if (!repoExists)
            return {
                success: false,
                error: {
                    message: "Repository doesn't exists in server!",
                    type: NOT_FOUND,
                },
                data: null,
            };

        await Repository.upload(repoName, validation.data);
        return {
            success: true,
            error: null,
            data: null,
        };
    }
    /**
     * Generate a zip file with the repository content
     * @param {string} repoName - Repository name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async download(repoName, token) {
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

        const existsDb = await Repository.checkIfExistsInDb(repoName);

        if (!existsDb)
            return {
                success: false,
                error: {
                    message: "Repository doesn't exists in database!",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const userHasRepo = await Repository.checkIfUserHasRepo(repoName,validation.data)
        if (!userHasRepo) return {
            success: false,
            error: {
                message: "User doesn't have the repository",
                type: FORBIDDEN
            },
            data: null
        }

        const existsCloud = await Repository.checkIfExistsInCloud(repoName, validation.data);

        if (!existsCloud)
            return {
                success: false,
                error: {
                    message: "Repository doesn't exists in cloud storage!",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const files = await Repository.getFiles(repoName,validation.data);

        const zip_file = await downloadFiles(files, repoName);
        return {
            success: true,
            error: null,
            data: zip_file,
        };
    }
    /**
     * Delete a repository from database and clout storage
     * @param {string} repoName - Repository name
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async delete(repoName, token, password) {
        const validation = validationHandler([
            await Repository.validateRepoName(repoName),
            Auth.validateToken(token),
            await User.validatePassword(password)
        ])
        if (validation.error) return {
            success: false,
            error: {
                message: validation.error,
                type: BAD_REQUEST
            },
            data: null
        }

        const user = await User.getById(validation.data)

        const match_password = await Auth.comparePassword(password,user.password)
        if (!match_password) return {
            success: false,
            error: {
                message: "Invalid Password!",
                type: FORBIDDEN
            },
            data: null
        }

        await Repository.deleteDb(repoName, validation.data);
        await Repository.deleteCloud(repoName, validation.data);
        return {
            success: true,
            error: null,
            data: null,
        };
    }
    /**
     * Like a repository by name and user token
     * @param {string} repoName - Repository name
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async like(repoName, token) {
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

        const existsDb = await Repository.checkIfExistsInDb(repoName);
        if (!existsDb)
            return {
                success: false,
                error: {
                    message: "Repository doesn't exists!",
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

        await Repository.like(repoName, validation.data);
        return {
            success: true,
            error: null,
            data: null,
        };
    }
    /**
     * Get repositories from an user by ID
     * @param {string} username - User owner name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async getFromUser(username) {
        const validation = validationHandler([
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

        const user_exists = await User.checkIfExistsByUsername(username);
        if (!user_exists)
            return {
                success: false,
                error: {
                    message: "User doesn't exists!",
                    type: NOT_FOUND,
                },
                data: null,
            };

        const repos = await Repository.getFromUser(username);

        if (repos.length == 0)
            return {
                success: false,
                error: {
                    message: "User doesn't have repositories",
                    type: NOT_FOUND,
                },
                data: null,
            };

        return {
            success: true,
            error: null,
            data: repos,
        };
    }
    /**
     * Search repositories by name
     * @return {Promise<ServiceResult>} Service result object
     * */
    static async search(repoName) {
        const validation = validationHandler([
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

        const repos = await Repository.search(repoName);

        if (repos.length == 0)
            return {
                success: false,
                error: {
                    message: "Repositories not founded!",
                    type: NOT_FOUND,
                },
                data: null,
            };

        return {
            success: true,
            error: null,
            data: repos,
        };
    }
    /**
     * Change name of repository
     * @param {string} newRepoName - New repository name
     * @param {string} repoName - Repository name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async changeName(newRepoName, repoName, token) {
        const validation = validationHandler([
            await Repository.validateRepoName(newRepoName),
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

        const existsDb = await Repository.checkIfExistsInDb(repoName);
        if (!existsDb)
            return {
                success: false,
                error: {
                    message: "Repository doesn't exists!",
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

        await Repository.changeName(
            newRepoName,
            repoName,
            token_validation.data,
        );
        return {
            success: true,
            error: null,
            data: null,
        };
    }
    /**
     * Change description of repository
     * @param {string} newDescription - New repository description
     * @param {string} repoName - Repository name
     * @param {string} token - JWT Token
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async changeDescription(newDescription, repoName, token) {
        const validation = validationHandler([
            await Repository.validateDescription(newDescription),
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

        const user_exists = await User.checkIfExistsById(token_validation.data)
        if (!user_exists) return {
            success: false,
            error: {
                message: "User doesn't exists!",
                type: NOT_FOUND
            },
            data: null
        }

        const userHasRepo = await Repository.checkIfUserHasRepo(repoName,token_validation.data)
        if (!userHasRepo) return {
            success: false,
            error: {
                message: "User doesn't have the repository!",
                type: FORBIDDEN
            },
            data: null
        }

        await Repository.changeDescription(newDescription,repoName,token_validation.data)
        return {
            success: true,
            error: null,
            data: null
        }
    }
    /**
     * Get full information of repository
     * @param {string} repoName - Repository name
     * @param {string} username - User owner name
     * @return {Promise<ServiceResult>} Service result object
     * @async
     * */
    static async getInfo(repoName, username) {
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
                message: "Repository doesn't exists!",
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
                message: "User doesn't have the repository",
                type: FORBIDDEN
            },
            data: null
        }

        const info = await Repository.getFullInfo(repoName,user.id)
        const files = await Repository.getFiles(repoName, user.id)
        return {
            success: true,
            error: null,
            data: {
                ...info,
                files
            }
        }
    }
}
