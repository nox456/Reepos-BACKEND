import db from "../connections/database.js";
import supabase from "../connections/supabase.js"
import { SUPABASE_PROJECT_BUCKET } from "../config/env.js"
import getProjectsFiles from "../lib/getProjectsFiles.js"
import { z } from "zod"
import { readdir } from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const projectsPath = join(dirname(fileURLToPath(import.meta.url)), "../temp")


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
    // Upload a repository to supabase
    static async upload(projectName) {
        const path = join(projectsPath, projectName)
        const files = await getProjectsFiles(path)
        for (const file of files) {
            await supabase.storage.from(SUPABASE_PROJECT_BUCKET).upload(`${projectName}/${file.path}`, file.buffer)
        }
    }
    // Validate project name
    static async validateProjectName(projectName) {
        const schema = z
            .string({ invalid_type_error: "Project Name must be a string!", required_error: "Project Name required!" })
        const validation = await schema.safeParseAsync(projectName)
        if (!validation.success) {
            return {
                validationError: validation.error.issues[0].message,
                validationField: projectName
            }
        }
    }
    // Check if project exists in 'temp' dir
    static async checkIfExists(projectName) {
        const projects = await readdir(projectsPath)
        return projects.includes(projectName)
    }
}
