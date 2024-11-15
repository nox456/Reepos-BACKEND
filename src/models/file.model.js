import db from "../connections/database.js";
import supabase from "../connections/supabase.js";
import { SUPABASE_REPOSITORY_BUCKET } from "../config/env.js";
import { z } from "zod";
import { FILE_INFO } from "./queries.js";
import * as Types from "../lib/types.js";

/**
 * Repository File class
 * */
export default class File {
    /**
     * Save a file in database
     * @param {Types.FileData} fileData
     * @return {Promise<Types.FileType>} File saved
     * @async
     * */
    static async save(fileData) {
        const { name, size, path, repo, language } = fileData;
        const result = await db.query(
            "INSERT INTO files VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING *",
            [name, size, path, repo, language],
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
        const repo_result = await db.query(
            "SELECT id FROM repositories WHERE user_owner = $1 AND name = $2",
            [userId, repoName],
        );
        const { path, name } = path_result.rows[0];
        const fileUrl = supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .getPublicUrl(`${userId}/${repo_result.rows[0].id}/${path}`, {
                download: name,
            }).data.publicUrl;
        return fileUrl;
    }
    /**
     * Validate File ID
     * @param {string} id - File ID
     * @return {Promise<Types.Validation} Result Data
     * @async
     * */
    static async validateId(id) {
        const schema = z
            .string({
                invalid_type_error: "ID debe ser un string!",
                required_error: "ID requerido!",
            })
            .uuid({ message: "ID debe ser un UUID" });
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
        const repo_result = await db.query(
            "SELECT id FROM repositories WHERE user_owner = $1 AND name = $2",
            [userId, repoName],
        );
        const { name, path } = result_file.rows[0];
        const { data, error } = await supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .list(
                `${userId}/${repo_result.rows[0]}/${path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : ""}`,
                {
                    search: name,
                },
            );
        if (error) throw error;
        const exists = data.length > 0;
        return exists;
    }
    /**
     * Get info of file
     * @param {string} id - File ID
     * @return {Promise<Types.FileInfo>}
     * @async
     * */
    static async getInfo(id, repoName, userId) {
        const result = await db.query(FILE_INFO, [id]);
        const fileInfo = result.rows[0];

        const ext = fileInfo.path.slice(fileInfo.path.lastIndexOf(".") + 1);
        const binExts = [
            "png",
            "jpg",
            "mp3",
            "mp4",
            "exe",
            "webp",
            "gif",
            "jpeg",
            "ico",
            "svg",
        ];

        const repo_result = await db.query(
            "SELECT id FROM repositories WHERE user_owner = $1 AND name = $2",
            [userId, repoName],
        );
        const fileDownloadUrl = supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .getPublicUrl(
                `${userId}/${repo_result.rows[0].id}/${fileInfo.path}`,
                {
                    download: fileInfo.name,
                },
            );
        fileInfo.url = fileDownloadUrl.data.publicUrl;

        if (!binExts.includes(ext)) {
            const fileUrl = supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .getPublicUrl(
                    `${userId}/${repo_result.rows[0].id}/${fileInfo.path}`,
                );
            const file_result = await fetch(fileUrl.data.publicUrl);

            fileInfo.content = await file_result.text();
        } else {
            fileInfo.content = null;
        }
        return fileInfo;
    }
}
