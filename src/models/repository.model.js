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
    SEARCH_REPOSITORIES
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
        const result = await db.query(
            "INSERT INTO repositories VALUES (DEFAULT,$1,$2,$3,DEFAULT,DEFAULT) RETURNING *",
            [name, description, user_owner],
        );
        const repoSaved = result.rows[0];
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
            const { error } = await supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .upload(`${userId}/${repoName}/${file.path}`, file.buffer);
            if (error) throw error
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
        const result = await db.query(
            "SELECT count(*) FROM repositories WHERE name = $1",
            [repoName],
        );
        const exists = result.rows[0].count > 0;
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
        const result_files = await db.query(REPOSITORIES_FILES, [
            userId,
            repoName,
        ]);
        const files = result_files.rows;
        for (const file of files) {
            const url = supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .getPublicUrl(`${userId}/${repoName}/${file.path}`)
                .data.publicUrl;
            file.url = url;
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
        const {data,error} = await supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .list(userId);
        if (error) throw error
        const repos = data.map((p) => p.name);
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
        const result = await db.query(
            "SELECT count(*) FROM repositories WHERE name = $1 AND user_owner = $2",
            [name, userId],
        );
        const hasRepo = result.rows[0].count == 1;
        return hasRepo;
    }
    /**
     * Delete a repository by name and user ID from database
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @async
     * */
    static async deleteDb(repoName, userId) {
        await db.query(
            "DELETE FROM repositories WHERE name = $1 AND user_owner = $2",
            [repoName, userId],
        );
    }
    /**
     * Delete a repository by name and user ID from cloud storage
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @aync
     * */
    static async deleteCloud(repoName, userId) {
        const files_result = await db.query(REPOSITORIES_FILES, [
            userId,
            repoName,
        ]);
        const files = files_result.rows.map(
            (f) => `${userId}/${repoName}/${f.path}`,
        );
        const { error } = await supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .remove(files);
        if (error) throw error;
    }
    /**
     * Like the repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async like(repoName, userId) {
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
        const repos_result = await db.query(SEARCH_REPOSITORIES, [
            `%${repoName}%`,
        ]);
        const repos = repos_result.rows;
        return repos;
    }
    /**
     * Change name of repository
     * @param {string} newRepoName - New repository name
     * @param {string} repoName - Repository name
     * @async
     * */
    static async changeName(newRepoName, repoName, userId) {
        await db.query(
            "UPDATE repositories SET name = $1 WHERE name = $2 AND user_owner = $3",
            [newRepoName, repoName, userId],
        );
    }
    /**
     * Change description of repository
     * @param {string} newDescription - New repository description
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async changeDescription(newDescription, repoName, userId) {
        await db.query(
            "UPDATE repositories SET description = $1 WHERE name = $2 AND user_owner = $3",
            [newDescription, repoName, userId],
        );
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
        const info_result = await db.query(REPOSITORY_INFO, [
            userId,
            repoName,
        ]);
        const info = info_result.rows[0];
        return info;
    }
}
