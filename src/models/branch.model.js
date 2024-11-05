import db from "../connections/database.js";
import { BranchData, BranchType } from "../lib/types.js";

/**
 * Git Branch class
 * */
export default class Branch {
    /**
     * Save a branch in database
     * @param {BranchData} branchData - Branch data
     * @return {Promise<BranchType>} Branch saved
     * @async
     * */
    static async save(branchData) {
        const { name, repo, type } = branchData;
        const result = await db.query(
            "INSERT INTO branches VALUES (DEFAULT,$1,$2,$3) RETURNING *",
            [name, repo, type],
        );
        const branchSaved = result.rows[0];
        return branchSaved;
    }
}
