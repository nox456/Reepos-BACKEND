import db from "../connections/database.js";

export default class Contributor {
    static async save(contributorData) {
        const { name, repo } = contributorData
        let contributorSaved
        try {
            const result = await db.query("INSERT INTO contributors VALUES (DEFAULT,$1,$2) RETURNING *", [name, repo])
            contributorSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return contributorSaved
    }
}
