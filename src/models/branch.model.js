import db from "../connections/database.js";

/**
 * Git Branch class
 * */
export default class Branch {
    /**
     * @typedef {Object} BranchData
     * @property {string} name - Branch name
     * @property {string} repo - Repository ID
     * @property {string} type - Branch type
     *
     * The branch saved data
     * @typedef {Object} BranchType
     * @property {string} id - Branch ID
     * @property {string} name - Branch name
     * @property {string} repo - Repository ID
     * @property {string} type - Branch Type
     * */
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
