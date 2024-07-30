import db from "../connections/database.js";

/**
 * Git Contributor class
 * */
export default class Contributor {
    /**
     * @typedef {Object} ContributorData
     * @property {string} name - Contributor name
     * @property {string} repo - Repository ID
     *
     * @typedef {Object} ContributorType
     * @property {string} id - Contributor ID
     * @property {string} name - Contributor name
     * @property {string} repo - Repository ID
     * */
    /**
     * Save a contributor in database
     * @param {ContributorData} contributorData - Contributor Data 
     * @return {Promise<ContributorType>} Contributor saved
     * @async
     * */
    static async save(contributorData) {
        const { name, repo } = contributorData
        let contributorSaved
        try {
            const result = await db.query("INSERT INTO contributors VALUES (DEFAULT,$1,$2) RETURNING *", [name, repo])
            contributorSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return contributorSaved
    }
}
