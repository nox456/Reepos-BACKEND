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
        const result = await db.query(
            "SELECT count(*) FROM languages WHERE name = $1",
            [language],
        );
        const exists = result.rows[0].count > 0;
        return exists;
    }
    /**
     * Get id by extension
     * @param {string} ext - File extension
     * @return {Promise<string>} Language ID
     * @async
     * */
    static async getByExt(ext) {
        const result = await db.query("SELECT id FROM languages WHERE ext = $1", [ext])
        return result.rows[0]?.id
    }
}
