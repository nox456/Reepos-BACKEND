import db from "../connections/database.js";
import format from "pg-format"
import { z } from "zod";
import { COMMIT_INFO, REPOSITORIES_COMMITS } from "./queries.js";
import * as Types from "../lib/types.js";

/**
 * Git Commit class
 * */
export default class Commit {
    /**
     * Save a commit in database
     * @param {Types.CommitData[]} commitData - Commit data
     * @return {Promise<Types.CommitType>} Commit saved
     * @async
     * */
    static async save(commits) {
        const q = format("INSERT INTO commits (title,content,hash,author,created_at,repo) VALUES %L RETURNING *", commits)
        const result = await db.query(q);
        const commitSaved = result.rows;
        return commitSaved;
    }
    /**
     * Get all commits from a repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @return {Promise<Types.Types.Commit[]>} Commits
     * @async
     * */
    static async getAll(repoName, userId) {
        const result = await db.query(REPOSITORIES_COMMITS, [repoName, userId]);
        const commits = result.rows;
        return commits;
    }
    /**
     * Get full information of commit by hash
     * @param {string} hash - Commit hash
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @return {Promise<Types.CommitInfo>} Commit information object
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
     * Validate hash
     * @param {string} hash
     * @return {Promise<Types.Validation>} Result Data
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
