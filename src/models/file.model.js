import db from "../connections/database.js";

export default class File {
    static async save(fileData) {
        const { name, size, path, repo } = fileData
        let fileSaved
        try {
            const result = await db.query("INSERT INTO files VALUES (DEFAULT,$1,$2,$3,$4) RETURNING *", [name, size, path, repo])
            fileSaved = result.rows[0]
        } catch (e) {
            console.error(e)
        }
        return fileSaved
    }
}
