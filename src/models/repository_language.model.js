import db from "../connections/database.js";
import format from "pg-format"

/**
 * Relationship Repository and Language class
 * */
export default class Repository_Language {
    /**
     * Save a 'repository_language' relationship in database
     * @param {string} repository - Repository ID
     * @param {string} language - Language ID
     * @async
     * */
    static async save(repository, languages) {
        const q1 = format("SELECT array_agg(id) as id FROM languages WHERE name in (%L)", languages)
        const languages_result = await db.query(q1);
        const q2 = format("INSERT INTO repositories_languages (repo_id, language_id) VALUES %L", languages_result.rows[0].id.map(l => [repository, l]))
        await db.query(q2);
    }
}
