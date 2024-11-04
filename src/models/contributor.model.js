import db from "../connections/database.js";
import { REPOSITORIES_CONTRIBUTORS } from "./queries.js";

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
        const { name, repo } = contributorData;
        const result = await db.query(
            "INSERT INTO contributors VALUES (DEFAULT,$1,$2) RETURNING *",
            [name, repo],
        );
        const contributorSaved = result.rows[0];
        return contributorSaved;
    }
    /**
     * @typedef {Object} Contributor
     * @property {string} name - Contributor name
     * @property {string} last_commit_title - Last commit of contributor
     * @property {string} commits_created - Commits created by contributor
     * */
    /**
     * Get all contributors from a repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @return {Promise<Contributor[]>} Contributors
     * @async
     * */
    static async getAll(repoName, userId) {
        const result = await db.query(REPOSITORIES_CONTRIBUTORS, [
            repoName,
            userId,
        ]);
        const contributors = result.rows;
        return contributors;
    }
}
