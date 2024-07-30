import db from "../connections/database.js";

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
    static async save(repository, language) {
        try {
            const language_result = await db.query("SELECT id FROM languages WHERE name = $1", [language])
            const languageId = language_result.rows[0].id
            await db.query("INSERT INTO repositories_languages VALUES (DEFAULT,$1,$2)", [repository, languageId])
        } catch (e) {
            console.error(e)
        }
    }
}
