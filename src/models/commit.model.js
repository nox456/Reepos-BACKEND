import db from "../connections/database.js";

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
}
