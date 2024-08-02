import db from "../connections/database.js";

/**
 * Language class
 * */
export default class Language {
    /**
     * Check if a language exists in database
     * @param {string} language - Language name
     * @return {Promise<boolean>} True if the language exists or False if not
     * @async
     * */
    static async checkIfExists(language) {
        let exists;
        try {
            const result = await db.query(
                "SELECT count(*) FROM languages WHERE name = $1",
                [language],
            );
            exists = result.rows[0].count > 0;
        } catch (e) {
            console.error(e);
        }
        return exists;
    }
}
