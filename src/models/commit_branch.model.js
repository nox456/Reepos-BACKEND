import db from "../connections/database.js";
import format from "pg-format"

/**
 * Relationship Commit and Branch class
 * */
export default class Commit_Branch {
    /**
     * Save a 'commit_branch' relationship in database
     * @param {string} commit - Commit ID
     * @param {string} branch - Branch ID
     * @async
     * */
    static async save(commits_branches) {
        const q = format("INSERT INTO commits_branches (commit,branch) VALUES %L RETURNING *", commits_branches)
        await db.query(q);
    }
}
