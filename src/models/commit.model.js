import db from "../connections/database.js";
import { z } from "zod";
import { COMMIT_INFO, REPOSITORIES_COMMITS } from "./queries.js";
import { CommitData, CommitType, Commit, Validation } from "../lib/types.js";

/**
 * Git Commit class
 * */
export default class Commit {
    /**
     * Save a commit in database
     * @param {CommitData} commitData - Commit data
     * @return {Promise<CommitType>} Commit saved
     * @async
     * */
    static async save(commitData) {
        const { title, content, hash, author, created_at, repo } = commitData;
        const result = await db.query(
            "INSERT INTO commits VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING *",
            [title, content, hash, author, created_at, repo],
        );
        const commitSaved = result.rows[0];
        return commitSaved;
    }
    /**
     * Get all commits from a repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @return {Promise<Commit[]>} Commits
     * @async
     * */
    static async getAll(repoName, userId) {
        const result = await db.query(REPOSITORIES_COMMITS, [repoName, userId]);
        const commits = result.rows;
        return commits;
    }
    /**
     * @typedef {Object} CommitFile
     * @property {string} name - File name
     * @property {string} size - File size
     * @property {string} type - Modification type
     *
     * @typedef {Object} CommitInfo
     * @property {string} hash - Hash
     * @property {string} title - Title
     * @property {string} content - Content
     * @property {string} created_at - Date and Time of creation
     * @property {string} author - Author name
     * @property {string} branch - Branch name
     * @property {CommitFile[]} files - Commit files
     * @property {string} prev_commit_hash - Hash of the previous commit
     * @property {string} next_commit_hash - Hash of the next commit
     * */
    /**
     * Get full information of commit by hash
     * @param {string} hash - Commit hash
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @return {Promise<CommitInfo>} Commit information object
     * @async
     * */
    static async getFullInfo(hash, repoName, userId) {
        const info_result = await db.query(COMMIT_INFO, [
            hash,
            repoName,
            userId,
        ]);
        const info = info_result.rows[0];
        if (!info.files[0].name) {
            info.files = [];
        }
        return info;
    }
    /**
     * @typedef {Object} Result
     * @property {?string} error - Error message
     * */
    /**
     * Validate hash
     * @param {string} hash
     * @return {Promise<Validation>} Result Data
     * @async
     * */
    static async validateHash(hash) {
        const schema = z.string({
            required_error: "Hash requerido!",
            invalid_type_error: "Hash debe ser un string!",
        });
        const validation = await schema.safeParseAsync(hash);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Check if commit exists by hash
     * @param {string} hash - Commit hash
     * @return {Promise<boolean>} True if the commit exists and False if not
     * @async
     * */
    static async checkIfExists(hash) {
        const result = await db.query(
            "SELECT count(*) FROM commits WHERE hash = $1",
            [hash],
        );
        const exists = result.rows[0].count > 0;
        return exists;
    }
}
