import db from "../connections/database.js";

export default class Repository_Language {
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
