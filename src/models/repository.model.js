import db from "../connections/database.js";
import supabase from "../connections/supabase.js";
import { SUPABASE_PROJECT_BUCKET } from "../config/env.js";
import getProjectsFiles from "../lib/getProjectsFiles.js";
import { z } from "zod";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { REPOSITORIES_FILES } from "./queries.js";

const projectsPath = join(dirname(fileURLToPath(import.meta.url)), "../temp");

export default class Repository {
    // Create a repository in database
    static async save(repoData) {
        const { name, description, user_owner } = repoData;
        let repoSaved;
        try {
            const result = await db.query(
                "INSERT INTO repositories VALUES (DEFAULT,$1,$2,$3,DEFAULT,DEFAULT) RETURNING *",
                [name, description, user_owner],
            );
            repoSaved = result.rows[0];
        } catch (e) {
            console.error(e);
        }
        return repoSaved;
    }
    // Upload a repository to supabase
    static async upload(projectName) {
        const path = join(projectsPath, projectName);
        const files = await getProjectsFiles(path);
        for (const file of files) {
            await supabase.storage
                .from(SUPABASE_PROJECT_BUCKET)
                .upload(`${projectName}/${file.path}`, file.buffer);
        }
    }
    // Validate project name
    static async validateProjectName(projectName) {
        const schema = z.string({
            invalid_type_error: "Project Name must be a string!",
            required_error: "Project Name required!",
        });
        const validation = await schema.safeParseAsync(projectName);
        if (!validation.success) {
            return {
                validationError: validation.error.issues[0].message,
                validationField: projectName,
            };
        }
    }
    // Check if project exists in 'temp' dir
    static async checkIfExistsInBackend(projectName) {
        const projects = await readdir(projectsPath);
        return projects.includes(projectName);
    }
    // Check if project exists in database
    static async checkIfExistsInDb(repoName) {
        let exists;
        try {
            const result = await db.query(
                "SELECT count(*) FROM repositories WHERE name = $1",
                [repoName],
            );
            exists = result.rows[0].count > 0;
        } catch (e) {
            console.error(e);
        }
        return exists;
    }
    // Get files from a repository stored in database
    static async getFiles(projectName) {
        let files;
        try {
            const result_id = await db.query(
                "SELECT id FROM repositories WHERE name = $1",
                [projectName],
            );
            const id = result_id.rows[0].id;
            const result_files = await db.query(REPOSITORIES_FILES, [id]);
            files = result_files.rows;
        } catch (e) {
            console.error(e);
        }
        return files;
    }
    // Get cloud public urls of files
    static async getFilesUrls(projectName, files) {
        const urls = [];
        try {
            for (const file of files) {
                const url = supabase.storage
                    .from(SUPABASE_PROJECT_BUCKET)
                    .getPublicUrl(`${projectName}/${file.path}`).data.publicUrl;
                urls.push(url);
            }
        } catch (e) {
            console.error(e);
        }
        return urls;
    }
    // Check if a repository is stored in cloud (supabase)
    static async checkIfExistsInCloud(projectName) {
        let projects
        try {
            const result = await supabase.storage.from(SUPABASE_PROJECT_BUCKET).list()
            projects = result.data.map((p) => p.name)
        } catch(e) {
            console.error(e)
        }
        return projects.includes(projectName)
    }
}
