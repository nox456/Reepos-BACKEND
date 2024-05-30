import db from "../connections/database.js";

export default class Commit {
    static async save(commitData) {
        const { title, content, hash, author, created_at, repo } = commitData
        let commitSaved
        try {
            const result = await db.query("INSERT INTO commits VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING *", [title, content, hash, author, created_at, repo])
            commitSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return commitSaved
    }
}
