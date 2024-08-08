import db from "../connections/database.js";
import {z} from "zod"
import { COMMIT_INFO, REPOSITORIES_COMMITS } from "./queries.js";

/**
 * Git Commit class
 * */
export default class Commit {
    /**
     * @typedef {Object} CommitData
     * @property {string} title - Commit title
     * @property {string} content - Commit content
     * @property {string} hash - Commit hash
     * @property {string} author - Author ID
     * @property {string} created_at - Date of creation
     * @property {string} repo - Repository ID
     *
     * @typedef {Object} CommitType
     * @property {string} id - Commit ID
     * @property {string} title - Commit title
     * @property {string} content - Commit content
     * @property {string} hash - Commit hash
     * @property {string} author - Author ID
     * @property {string} created_at - Date of creation
     * @property {string} repo - Repository ID
     * */
    /**
     * Save a commit in database
     * @param {CommitData} commitData - Commit data
     * @return {Promise<CommitType>} Commit saved
     * @async
     * */
    static async save(commitData) {
        const { title, content, hash, author, created_at, repo } = commitData
        let commitSaved
        try {
            const result = await db.query("INSERT INTO commits VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING *", [title, content, hash, author, created_at, repo])
            commitSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return commitSaved
    }
    /**
     * @typedef {Object} Commit
     * @property {string} title - Commit title
     * @property {string} author - Commit author
     * @property {string} created_at - Date of creation
     * @property {string} hash - Commit hash
     * */
    /**
     * Get all commits from a repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @return {Promise<Commit[]>} Commits
     * @async
     * */
    static async getAll(repoName, userId) {
        let commits        
        try {
            const result = await db.query(REPOSITORIES_COMMITS, [repoName, userId])
            commits = result.rows
        } catch(e) {
            console.error(e)
        }
        return commits
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
     * @return {Promise<CommitInfo>} Commit information object
     * @async
     * */
    static async getFullInfo(hash) {
        let info
        try {
            const info_result = await db.query(COMMIT_INFO,[hash])
            info = info_result.rows[0]
            if (!info.files[0].name) {
                info.files = []
            }
        } catch(e) {
            console.error(e)
        }
        return info
    }
    /**
     * @typedef {Object} Result
     * @property {?string} error - Error message 
     * */
    /**
     * Validate hash
     * @param {string} hash 
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateHash(hash) {
        const schema = z.string({required_error: "Hash required!", invalid_type_error: "Hash must be a string!"})
        const validation = await schema.safeParseAsync(hash)
        let error = null
        if (!validation.success) {
            error = validation.error.issues[0].message
        }
        return {error}
    }
    /**
     * Check if commit exists by hash
     * @param {string} hash - Commit hash
     * @return {Promise<boolean>} True if the commit exists and False if not
     * @async
     * */
    static async checkIfExists(hash) {
        let exists
        try {
            const result = await db.query("SELECT count(*) FROM commits WHERE hash = $1",[hash])
            exists = result.rows[0].count > 0
        } catch(e) {
            console.error(e)
        }
        return exists
    }
}
