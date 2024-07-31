import db from "../connections/database.js";
import supabase from "../connections/supabase.js";
import { SUPABASE_REPOSITORY_BUCKET } from "../config/env.js";
import getReposFiles from "../lib/getReposFiles.js";
import { z } from "zod";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { REPOSITORIES_FILES } from "./queries.js";

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
     * @async
     * */
    static async upload(repoName) {
        const path = join(reposPath, repoName);
        const files = await getReposFiles(path);
        for (const file of files) {
            await supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .upload(`${repoName}/${file.path}`, file.buffer);
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
     * @return {Promise<boolean>} True if the file exists or False is not
     * @async
     * */
    static async checkIfExistsInBackend(repoName) {
        const repos = await readdir(reposPath);
        return repos.includes(repoName);
    }
    /**
     * Check if the repository exists in database
     * @param {string} repoName - Repository name
     * @return {Promise<boolean>} True if the file exists or False is not
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
     * */
    /**
     * Get files from a repository
     * @param {string} repoName - Repository name
     * @return {Promise<File[]>} Files
     * @async
     * */
    static async getFiles(repoName) {
        let files;
        try {
            const result_id = await db.query(
                "SELECT id FROM repositories WHERE name = $1",
                [repoName],
            );
            const id = result_id.rows[0].id;
            const result_files = await db.query(REPOSITORIES_FILES, [id]);
            files = result_files.rows;
        } catch (e) {
            console.error(e);
        }
        return files;
    }
    /**
     * Get public URLs of repository files
     * @param {string} repoName - Repository name
     * @param {File[]} files - Files
     * @return {Promise<string[]>} Files URLs
     * @async
     * */
    static async getFilesUrls(repoName, files) {
        const urls = [];
        try {
            for (const file of files) {
                const url = supabase.storage
                    .from(SUPABASE_REPOSITORY_BUCKET)
                    .getPublicUrl(`${repoName}/${file.path}`).data.publicUrl;
                urls.push(url);
            }
        } catch (e) {
            console.error(e);
        }
        return urls;
    }
    /**
     * Check if the repository exists in cloud storage
     * @param {string} repoName - Repository name
     * @return {Promise<boolean>} True if the file exists or False is not
     * @async
     * */
    static async checkIfExistsInCloud(repoName) {
        let repos;
        try {
            const result = await supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .list();
            repos = result.data.map((p) => p.name);
        } catch (e) {
            console.error(e);
        }
        return repos.includes(repoName);
    }
}
