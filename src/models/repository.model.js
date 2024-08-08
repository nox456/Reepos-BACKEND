import db from "../connections/database.js";
import supabase from "../connections/supabase.js";
import { SUPABASE_REPOSITORY_BUCKET } from "../config/env.js";
import getReposFiles from "../lib/getReposFiles.js";
import { z } from "zod";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
    REPOSITORIES_FILES,
    REPOSITORY_INFO,
    SEARCH_REPOSITORIES,
    USER_REPOSITORIES,
} from "./queries.js";

const reposPath = join(dirname(fileURLToPath(import.meta.url)), "../temp");

/**
 * Repository class
 * */
export default class Repository {
    /**
     * @typedef {Object} RepoData
     * @property {string} name - Repository Name
     * @property {string} description - Repository Description
     * @property {string} user_owner - User owner ID
     *
     * @typedef {Object} RepoType
     * @property {string} id - Repository ID
     * @property {string} name - Repository name
     * @property {string} description - Repository Description
     * @property {string} user_owner - User owner ID
     * @property {string} created_at - Date of creation
     * @property {int} likes - Count of likes
     * */
    /**
     * Save a repository in database
     * @param {RepoData} repoData - Repository Data
     * @return {Promise<RepoType>} Repository saved
     * @async
     * */
    static async save(repoData) {
        const { name, description, user_owner } = repoData;
        let repoSaved;
        try {
            const result = await db.query(
                "INSERT INTO repositories VALUES (DEFAULT,$1,$2,$3,DEFAULT,DEFAULT) RETURNING *",
                [name, description, user_owner],
            );
            repoSaved = result.rows[0];
        } catch (e) {
            console.error(e);
        }
        return repoSaved;
    }
    /**
     * Upload a repository to cloud storage
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async upload(repoName, userId) {
        const path = join(reposPath, repoName);
        const files = await getReposFiles(path);
        for (const file of files) {
            await supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .upload(`${userId}/${repoName}/${file.path}`, file.buffer);
        }
    }
    /**
     * @typedef {Object} Result
     * @property {?string} error - Error message
     * */
    /**
     * Validate Repository name
     * @param {string} repoName - Repository name
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateRepoName(repoName) {
        const schema = z.string({
            invalid_type_error: "Repository Name must be a string!",
            required_error: "Repository Name required!",
        });
        const validation = await schema.safeParseAsync(repoName);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Check if the repository exists in backend
     * @param {string} repoName - Repository name
     * @return {Promise<boolean>} True if the repository exists or False if not
     * @async
     * */
    static async checkIfExistsInBackend(repoName) {
        const repos = await readdir(reposPath);
        return repos.includes(repoName);
    }
    /**
     * Check if the repository exists in database
     * @param {string} repoName - Repository name
     * @return {Promise<boolean>} True if the repository exists or False if not
     * @async
     * */
    static async checkIfExistsInDb(repoName) {
        let exists;
        try {
            const result = await db.query(
                "SELECT count(*) FROM repositories WHERE name = $1",
                [repoName],
            );
            exists = result.rows[0].count > 0;
        } catch (e) {
            console.error(e);
        }
        return exists;
    }
    /**
     * @typedef {Object} File
     * @property {string} id - File ID
     * @property {string} name - File name
     * @property {string} size - File size
     * @property {string} path - File path
     * @property {string} last_commit_title - Title of the last commit
     * @property {string} last_commit_created_at - Date of creation of the last commit
     * @property {string} url - Public url of the file
     * */
    /**
     * Get files from a repository
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @return {Promise<File[]>} Files
     * @async
     * */
    static async getFiles(repoName, userId) {
        let files;
        try {
            const result_files = await db.query(REPOSITORIES_FILES, [userId, repoName]);
            files = result_files.rows;
            for (const file of files) {
                const url = supabase.storage
                    .from(SUPABASE_REPOSITORY_BUCKET)
                    .getPublicUrl(`${userId}/${repoName}/${file.path}`)
                    .data.publicUrl;
                file.url = url
            }
        } catch (e) {
            console.error(e);
        }
        return files;
    }
    /**
     * Check if the repository exists in cloud storage
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @return {Promise<boolean>} True if the repository exists or False if not
     * @async
     * */
    static async checkIfExistsInCloud(repoName, userId) {
        let repos;
        try {
            const result = await supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .list(userId);
            repos = result.data.map((p) => p.name);
        } catch (e) {
            console.error(e);
        }
        return repos.includes(repoName);
    }
    /**
     * Validate Repository description
     * @param {string} description - Repository description
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateDescription(description) {
        const schema = z.string({
            required_error: "Description required!",
            invalid_type_error: "Description must be a string!",
        });
        const validation = await schema.safeParseAsync(description);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Validate languages
     * @param {string[]} languages - Repository languages
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateLanguages(languages) {
        const schema = z
            .string({
                invalid_type_error: "Languages must be an array of strings!",
                required_error: "Languages required!",
            })
            .array();
        const validation = await schema.safeParseAsync(languages);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Check if the user already has a repository by name
     * @param {string} name - Repository name
     * @param {string} userId - User ID
     * @return {Promise<boolean>} True if the user has the repo and false if not
     * @async
     * */
    static async checkIfUserHasRepo(name, userId) {
        let hasRepo;
        try {
            const result = await db.query(
                "SELECT count(*) FROM repositories WHERE name = $1 AND user_owner = $2",
                [name, userId],
            );
            hasRepo = result.rows[0].count == 1;
        } catch (e) {
            console.error(e);
        }
        return hasRepo;
    }
    /**
     * Delete a repository by name and user ID from database
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @async
     * */
    static async deleteDb(repoName, userId) {
        try {
            await db.query(
                "DELETE FROM repositories WHERE name = $1 AND user_owner = $2",
                [repoName, userId],
            );
        } catch (e) {
            console.error(e);
        }
    }
    /**
     * Delete a repository by name and user ID from cloud storage
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @aync
     * */
    static async deleteCloud(repoName, userId) {
        const path = join(reposPath, repoName);
        const files = await getReposFiles(path);
        await supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .remove(files.map((f) => `${userId}/${repoName}/${f.path}`));
    }
    /**
     * Like the repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async like(repoName, userId) {
        try {
            const result = await db.query(
                "SELECT likes FROM repositories WHERE name = $1 AND user_owner = $2",
                [repoName, userId],
            );
            const users_liked = result.rows[0].likes;
            users_liked.push(userId);
            await db.query(
                "UPDATE repositories SET likes = $1 WHERE name = $2 AND user_owner = $3",
                [users_liked, repoName, userId],
            );
        } catch (e) {
            console.error(e);
        }
    }
    /**
     * @typedef {Object} Repository
     * @property {string} name - Repository name
     * @property {string} description- Repository description
     * @property {int} likes - Repository likes
     * @property {string[]} languages - Repository languages
     * */
    /**
     * Get repositories from an user by ID
     * @param {string} username - User owner name
     * @return {Promise<Repository[]>} User's repositories
     * @async
     * */
    static async getFromUser(username) {
        let repos;
        try {
            const userId_result = await db.query("SELECT id FROM users WHERE username = $1", [username])
            const userId = userId_result.rows[0].id
            const repos_result = await db.query(USER_REPOSITORIES, [userId]);
            repos = repos_result.rows;
        } catch (e) {
            console.error(e);
        }
        return repos;
    }
    /**
     * @typedef {Object} RepositoryFounded
     * @property {string} user - User owner name
     * @property {string} name - Repository name
     * @property {string} description - Repository description
     * @property {int} likes - Repository likes
     * @property {string[]} languages - Repository languages
     * */
    /**
     * Search repositories by name
     * @param {string} repoName - Repository name
     * @return {Promise<RepositoryFounded[]>} Repositories founded
     * @async
     * */
    static async search(repoName) {
        let repos;
        try {
            const repos_result = await db.query(SEARCH_REPOSITORIES, [
                `%${repoName}%`,
            ]);
            repos = repos_result.rows;
        } catch (e) {
            console.error(e);
        }
        return repos;
    }
    /**
     * Change name of repository
     * @param {string} newRepoName - New repository name
     * @param {string} repoName - Repository name
     * @async
     * */
    static async changeName(newRepoName, repoName, userId) {
        try {
            await db.query(
                "UPDATE repositories SET name = $1 WHERE name = $2 AND user_owner = $3",
                [newRepoName, repoName, userId],
            );
        } catch (e) {
            console.error(e);
        }
    }
    /**
     * Change description of repository
     * @param {string} newDescription - New repository description
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async changeDescription(newDescription, repoName, userId) {
        try {
            await db.query(
                "UPDATE repositories SET description = $1 WHERE name = $2 AND user_owner = $3",
                [newDescription, repoName, userId],
            );
        } catch (e) {
            console.error(e);
        }
    }
    /**
     * @typedef {Object} Branch
     * @property {string} name - Branch name
     * @property {string} type - Branch type
     *
     * @typedef {Object} LastCommit
     * @property {string} title - Last commit title
     * @property {string} created_at - Date of creation
     * @property {string} author - Author name
     *
     * @typedef {Object} Info
     * @property {string} name - Repository name
     * @property {string} description - Repository description
     * @property {int} likes - Repository likes
     * @property {string[]} languages - Repository languages
     * @property {int} commits_count - Repository commits
     * @property {int} contributors_count - Repository contributors
     * @property {Branch[]} branches - Repository branches
     * @property {LastCommit} last_commit - Last commit of repository
     * */
    /**
     * Get full information of repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @return {Promise<Info>} Info object of repository
     * @async
     * */
    static async getFullInfo(repoName, userId) {
        let info;
        try {
            const info_result = await db.query(REPOSITORY_INFO, [
                userId,
                repoName,
            ]);
            info = info_result.rows[0];
        } catch (e) {
            console.error(e);
        }
        return info;
    }
}
