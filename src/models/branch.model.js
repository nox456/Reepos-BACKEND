import db from "../connections/database.js";

export default class Branch {
    static async save(branchData) {
        const { name, repo, type } = branchData
        let branchSaved
        try {
            const result = await db.query("INSERT INTO branches VALUES (DEFAULT,$1,$2,$3) RETURNING *", [name, repo, type])
            branchSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return branchSaved
    }
}
