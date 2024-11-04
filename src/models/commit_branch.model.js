import db from "../connections/database.js";

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
    static async save(commit, branch) {
        await db.query("INSERT INTO commits_branches VALUES (DEFAULT,$1,$2)", [
            commit,
            branch,
        ]);
    }
}
