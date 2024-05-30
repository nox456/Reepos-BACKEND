import db from "../connections/database.js";

export default class Repository {
    // Create a repository in database
    static async save(repoData) {
        const { name, description, user_owner } = repoData
        let repoSaved
        try {
            const result = await db.query("INSERT INTO repositories VALUES (DEFAULT,$1,$2,$3,DEFAULT,DEFAULT) RETURNING *",
                [name, description, user_owner])
            repoSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return repoSaved
    }
}
