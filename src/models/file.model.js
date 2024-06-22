import db from "../connections/database.js";
import supabase from "../connections/supabase.js"
import {SUPABASE_PROJECT_BUCKET} from "../config/env.js"
import {z} from "zod"

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
    static async download(id,projectName) {
        let fileUrl
        try {
            const path_result = await db.query("SELECT path FROM files WHERE id = $1", [id])
            const path = path_result.rows[0].path
            fileUrl = supabase.storage.from(SUPABASE_PROJECT_BUCKET).getPublicUrl(`${projectName}/${path}`)
        } catch(e) {
            console.error(e)
        }
        return fileUrl
    }
    static async validateId(id) {
        const schema = z
            .string({ invalid_type_error: "ID must be a string!", required_error: "ID required!" })
            .uuid({ message: "ID must be a UUID" })
        const validation = await schema.safeParseAsync(id)
        if (!validation.success) {
            return {
                validationError: validation.error.issues[0].message,
                validationField: id
            }
        }
    }
    static async checkIfExistsById(id) {
        let file
        try {
            const result = await db.query("SELECT count(*) FROM files WHERE id = $1", [id])
            file = result.rows
        } catch(e) {
            console.error(e)
        }
        return file.length > 0
    }
}
