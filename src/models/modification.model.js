import db from "../connections/database.js";

export default class Modification {
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
