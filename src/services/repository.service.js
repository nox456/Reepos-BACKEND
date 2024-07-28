import Repository from "../models/repository.model.js";
import Commit from "../models/commit.model.js";
import Branch from "../models/branch.model.js";
import File from "../models/file.model.js";
import Contributor from "../models/contributor.model.js";
import Modification from "../models/modification.model.js";
import Commit_Branch from "../models/commit_branch.model.js";
import Repository_Language from "../models/repository_language.model.js";
import Auth from "../models/auth.model.js"
import repoInfo from "../lib/getReposInfo.js";
import downloadFiles from "../lib/downloadFiles.js";

export default class RepositoryService {
    // Create a repository with their commits, contributors, files, branches, languages and modifications
    static async createRepository(repoData, token) {
        const { name, description, languages } = repoData;

        const repoName_validation = await Repository.validateRepoName(name)
        if (repoName_validation) return {
            success: false,
            error: {
                message: repoName_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const { commits, files, branches, contributors, modifications } =
            await repoInfo(name);

        const token_validation = await Auth.validateToken(token)
        if (token_validation.error) return {
            success: false,
            error: {
                message: token_validation.error,
                type: "validation"
            },
            data: null
        }

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
            data: null
        };
    }
    // Upload a repository to cloud storage (supabase)
    static async uploadRepository(repoName) {
        const repoName_validation =
            await Repository.validateRepoName(repoName);
        if (repoName_validation) return {
            success: false,
            error: {
                message: repoName_validation.validationError,
                type: "validation"
            },
            data: null
        };

        const repoExists =
            await Repository.checkIfExistsInBackend(repoName);
        if (!repoExists) return {
            success: false,
            error: {
                message: "Repository doesn't exists in server!",
                type: "not found"
            },
            data: null
        };

        await Repository.upload(repoName);
        return {
            success: true,
            error: null,
            data: null
        }
    }
    // Get files from a repository stored in database
    static async getFiles(repoName) {
        const repoName_validation =
            await Repository.validateRepoName(repoName);
        if (repoName_validation) return {
            success: false,
            error: {
                message: repoName_validation.validationError,
                type: "validation"
            },
            data: null
        };

        const exists = await Repository.checkIfExistsInDb(repoName);

        if (!exists) return {
            success: false,
            error: {
                message: "Repository doesn't exists in database!",
                type: "not found"
            },
            data: null
        };

        const files = await Repository.getFiles(repoName);
        return {
            success: true,
            error: null,
            data: files
        };
    }
    // Generate a zip file of a repository
    static async download(repoName) {
        const repoName_validation =
            await Repository.validateRepoName(repoName);
        if (repoName_validation) return {
            success: false,
            error: {
                message: repoName_validation.validationError,
                type: "validation"
            },
            data: null
        };

        const existsDb = await Repository.checkIfExistsInDb(repoName);

        if (!existsDb) return {
            success: false,
            error: {
                message: "Repository doesn't exists in database!",
                type: "not found"
            },
            data: null
        };

        const existsCloud = await Repository.checkIfExistsInCloud(repoName);

        if (!existsCloud) return {
            success: false,
            error: {
                message: "Repository doesn't exists in cloud storage!",
                type: "not found"
            },
            data: null
        };

        const files = await Repository.getFiles(repoName);

        const urls = await Repository.getFilesUrls(repoName, files);

        const zip_file = await downloadFiles(urls, repoName);
        return {
            success: true,
            error: null,
            data: zip_file
        };
    }
}
