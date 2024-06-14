import db from "../connections/database.js";
import supabase from "../connections/supabase.js"
import { SUPABASE_PROJECT_BUCKET } from "../config/env.js"
import getProjectsFiles from "../lib/getProjectsFiles.js"

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
    static async upload(projectName) {
        const files = await getProjectsFiles(projectName)
        for (const file of files) {
            await supabase.storage.from(SUPABASE_PROJECT_BUCKET).upload(`${projectName}/${file.path}`, file.buffer)
        }
    }
}
