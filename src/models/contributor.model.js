import db from "../connections/database.js";
import { REPOSITORIES_CONTRIBUTORS } from "./queries.js";
import * as Types from "../lib/types.js"

/**
 * Git Contributor class
 * */
export default class Contributor {
    /**
     * Save a contributor in database
     * @param {Types.ContributorData} contributorData - Contributor Data
     * @return {Promise<Types.ContributorType>} Contributor saved
     * @async
     * */
    static async save(contributorData) {
        const { name, repo } = contributorData;
        const result = await db.query(
            "INSERT INTO contributors VALUES (DEFAULT,$1,$2) RETURNING *",
            [name, repo],
        );
        const contributorSaved = result.rows[0];
        return contributorSaved;
    }
    /**
     * Get all contributors from a repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @return {Promise<Types.ContributorInfo[]>} Contributors
     * @async
     * */
    static async getAll(repoName, userId) {
        const result = await db.query(REPOSITORIES_CONTRIBUTORS, [
            repoName,
            userId,
        ]);
        const contributors = result.rows;
        return contributors[0];
    }
}
