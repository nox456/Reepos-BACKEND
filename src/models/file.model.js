import db from "../connections/database.js";
import supabase from "../connections/supabase.js";
import { SUPABASE_REPOSITORY_BUCKET } from "../config/env.js";
import { z } from "zod";

/**
 * Repository File class
 * */
export default class File {
    /**
     * @typedef {Object} FileData
     * @property {string} name - File name
     * @property {string} size - File size
     * @property {string} path - File path
     * @property {string} repo - Repository ID
     *
     * @typedef {Object} FileType
     * @property {string} id - File ID
     * @property {string} name - File name
     * @property {string} size - File size
     * @property {string} path - File path
     * @property {string} repo - Repository ID
     * */
    /**
     * Save a file in database
     * @param {FileData} fileData
     * @return {Promise<FileType>} File saved
     * @async
     * */
    static async save(fileData) {
        const { name, size, path, repo } = fileData;
        const result = await db.query(
            "INSERT INTO files VALUES (DEFAULT,$1,$2,$3,$4) RETURNING *",
            [name, size, path, repo],
        );
        const fileSaved = result.rows[0];
        return fileSaved;
    }
    /**
     * Get file URL to download
     * @param {string} id - File ID
     * @param {string} repoName - Repository Name
     * @return {Promise<string>} File public URL
     * @async
     * */
    static async download(id, repoName, userId) {
        const path_result = await db.query(
            "SELECT path, name FROM files WHERE id = $1",
            [id],
        );
        const { path, name } = path_result.rows[0];
        const fileUrl = supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .getPublicUrl(`${userId}/${repoName}/${path}`, { download: name }).data.publicUrl;
        return fileUrl;
    }
    /**
     * @typedef {Object} Result
     * @property {?string} error - Error message
     * */
    /**
     * Validate File ID
     * @param {string} id - File ID
     * @return {Promise<Result>} Result Data
     * @async
     * */
    static async validateId(id) {
        const schema = z
            .string({
                invalid_type_error: "ID must be a string!",
                required_error: "ID required!",
            })
            .uuid({ message: "ID must be a UUID" });
        const validation = await schema.safeParseAsync(id);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Check if the file exists in the database
     * @param {string} id - File ID
     * @return {Promise<boolean>} True if the file exists or False if not
     * @async
     * */
    static async checkIfExistsInDb(id) {
        const result_file = await db.query(
            "SELECT count(*) FROM files WHERE id = $1",
            [id],
        );
        const exists = result_file.rows[0].count > 0;
        return exists;
    }
    /**
     * Check if the file exists in the cloud storage
     * @param {string} repoName - Repository name
     * @param {string} file_id - File ID
     * @param {string} userId - ID of the repository owner
     * @return {Promise<boolean>} True if the file exists or False if not
     * @async
     * */
    static async checkIfExistsInCloud(repoName, file_id, userId) {
        const result_file = await db.query(
            "SELECT name,path FROM files WHERE id = $1",
            [file_id],
        );
        const { name, path } = result_file.rows[0];
        const {data,error} = await supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .list(`${userId}/${repoName}/${path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : ""}`, {
                search: name,
            });
        if (error) throw error
        const exists = data.length > 0;
        return exists;
    }
}
