import db from "../connections/database.js";

/**
 * Commit modification class
 * */
export default class Modification {
    /**
     * @typedef {Object} ModificationData
     * @property {string} type - Modification type ("A", "M", "D")
     * @property {string} commit - Commit ID
     * @property {string} file - File ID
     * 
     * @typedef {Object} ModificationType
     * @property {string} id - Modification ID
     * @property {string} type - Modification type ("A", "M", "D")
     * @property {string} commit - Commit ID
     * @property {string} file - File ID
     * */
    /**
     * Save a modification in database
     * @param {ModificationData} modificationData - Modification Data
     * @return {Promise<ModificationType>} Modification saved
     * @async
     * */
    static async save(modificationData) {
        const { type, commit, file } = modificationData
        let modificationSaved
        try {
            const result = await db.query("INSERT INTO modifications VALUES (DEFAULT,$1,$2,$3) RETURNING *", [type, commit, file])
            modificationSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return modificationSaved
    }
}
