import db from "../connections/database.js";
import * as Types from "../lib/types.js";

/**
 * Commit modification class
 * */
export default class Modification {
    /**
     * Save a modification in database
     * @param {Types.ModificationData} modificationData - Modification Data
     * @return {Promise<Types.ModificationType>} Modification saved
     * @async
     * */
    static async save(modificationData) {
        const { type, commit, file } = modificationData;
        const result = await db.query(
            "INSERT INTO modifications VALUES (DEFAULT,$1,$2,$3) RETURNING *",
            [type, commit, file],
        );
        const modificationSaved = result.rows[0];
        return modificationSaved;
    }
}
