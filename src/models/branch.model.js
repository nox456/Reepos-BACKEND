import db from "../connections/database.js";
import * as Types from "../lib/types.js";
import format from "pg-format"

/**
 * Git Branch class
 * */
export default class Branch {
    /**
     * Save a branch in database
     * @param {Types.BranchData[]} branchData - Branch data
     * @return {Promise<Types.BranchType>} Branch saved
     * @async
     * */
    static async save(branches) {
        const q = format("INSERT INTO branches (name, type, repo) VALUES %L RETURNING *", branches)
        const result = await db.query(q);
        return result.rows;
    }
}
