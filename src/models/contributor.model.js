import db from "../connections/database.js";
import { REPOSITORIES_CONTRIBUTORS } from "./queries.js";
import * as Types from "../lib/types.js"
import format from "pg-format";

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
    static async save(contributors) {
        const q = format("INSERT INTO contributors (name, repo) VALUES %L RETURNING *", contributors)
        const result = await db.query(q);
        return result.rows
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
        return result.rows;
    }
}
