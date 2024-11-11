import db from "../connections/database.js";
import supabase from "../connections/supabase.js";
import { SUPABASE_REPOSITORY_BUCKET } from "../config/env.js";
import getReposFiles from "../lib/getReposFiles.js";
import { z } from "zod";
import { readdir, rm } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
    REPOSITORIES_FILES,
    REPOSITORIES_LIKES,
    REPOSITORY_INFO,
    SEARCH_REPOSITORIES,
    USER_REPOSITORIES,
} from "./queries.js";
import * as Types from "../lib/types.js"

const reposPath = join(dirname(fileURLToPath(import.meta.url)), "../temp");

/**
 * Repository class
 * */
export default class Repository {
    /**
     * Save a repository in database
     * @param {Types.RepoData} repoData - Repository Data
     * @return {Promise<Types.RepoType>} Repository saved
     * @async
     * */
    static async save(repoData) {
        const { name, description, user_owner } = repoData;
        const result = await db.query(
            "INSERT INTO repositories VALUES (DEFAULT,$1,$2,$3,DEFAULT,DEFAULT) RETURNING *",
            [name, description, user_owner],
        );
        const repoSaved = result.rows[0];
        return repoSaved;
    }
    /**
     * Upload a repository to cloud storage
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async upload(repoName, userId) {
        const path = join(reposPath, repoName);
        const files = await getReposFiles(path);
        for (const file of files) {
            const { error } = await supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .upload(`${userId}/${repoName}/${file.path}`, file.buffer);
            if (error) throw error;
        }
    }
    /**
     * Validate Repository name
     * @param {string} repoName - Repository name
     * @return {Promise<Types.Validation>} Result Data
     * @async
     * */
    static async validateRepoName(repoName) {
        const schema = z
            .string({
                invalid_type_error: "Nombre de repositorio debe ser un string!",
                required_error: "Nombre de repositorio requerido!",
            })
            .max(25, "Nombre de repositorio debe tener 25 o menos caracteres");
        const validation = await schema.safeParseAsync(repoName);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Check if the repository exists in backend
     * @param {string} repoName - Repository name
     * @return {Promise<boolean>} True if the repository exists or False if not
     * @async
     * */
    static async checkIfExistsInBackend(repoName) {
        const repos = await readdir(reposPath);
        return repos.includes(repoName);
    }
    /**
     * Check if the repository exists in database
     * @param {string} repoName - Repository name
     * @return {Promise<boolean>} True if the repository exists or False if not
     * @async
     * */
    static async checkIfExistsInDb(repoName) {
        const result = await db.query(
            "SELECT count(*) FROM repositories WHERE name = $1",
            [repoName],
        );
        const exists = result.rows[0].count > 0;
        return exists;
    }
    /**
     * Get files from a repository
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @return {Promise<Types.File[]>} Files
     * @async
     * */
    static async getFiles(repoName, userId) {
        const result_files = await db.query(REPOSITORIES_FILES, [
            userId,
            repoName,
        ]);
        const files = result_files.rows;
        for (const file of files) {
            const url = supabase.storage
                .from(SUPABASE_REPOSITORY_BUCKET)
                .getPublicUrl(`${userId}/${repoName}/${file.path}`)
                .data.publicUrl;
            file.url = url;
        }
        return files;
    }
    /**
     * Check if the repository exists in cloud storage
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @return {Promise<boolean>} True if the repository exists or False if not
     * @async
     * */
    static async checkIfExistsInCloud(repoName, userId) {
        const { data, error } = await supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .list(userId);
        if (error) throw error;
        const repos = data.map((p) => p.name);
        return repos.includes(repoName);
    }
    /**
     * Validate Repository description
     * @param {string} description - Repository description
     * @return {Promise<Types.Validation>} Result Data
     * @async
     * */
    static async validateDescription(description) {
        const schema = z
            .string({
                required_error: "Descripción requerida!",
                invalid_type_error: "Descripción debe ser un string!",
            })
            .max(200, "Descripción debe tener 200 o menos caracteres");
        const validation = await schema.safeParseAsync(description);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Validate languages
     * @param {string[]} languages - Repository languages
     * @return {Promise<Types.Validation>} Result Data
     * @async
     * */
    static async validateLanguages(languages) {
        const schema = z
            .string({
                invalid_type_error: "Lenguajes debe ser un array de strings!",
                required_error: "Lenguajes requeridos!",
            })
            .array()
            .nonempty("El repositorio debe tener por lo menos 1 lenguaje!");
        const validation = await schema.safeParseAsync(languages);
        let error = null;
        if (!validation.success) {
            error = validation.error.issues[0].message;
        }
        return { error };
    }
    /**
     * Check if the user already has a repository by name
     * @param {string} name - Repository name
     * @param {string} userId - User ID
     * @return {Promise<boolean>} True if the user has the repo and false if not
     * @async
     * */
    static async checkIfUserHasRepo(name, userId) {
        const result = await db.query(
            "SELECT count(*) FROM repositories WHERE name = $1 AND user_owner = $2",
            [name, userId],
        );
        const hasRepo = result.rows[0].count == 1;
        return hasRepo;
    }
    /**
     * Delete a repository by name and user ID from database
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @async
     * */
    static async deleteDb(repoName, userId) {
        await db.query(
            "DELETE FROM repositories WHERE name = $1 AND user_owner = $2",
            [repoName, userId],
        );
    }
    /**
     * Delete a repository by name and user ID from cloud storage
     * @param {string} repoName - Repository name
     * @param {string} userId - User ID
     * @aync
     * */
    static async deleteCloud(repoName, userId) {
        const files_result = await db.query(REPOSITORIES_FILES, [
            userId,
            repoName,
        ]);
        const files = files_result.rows.map(
            (f) => `${userId}/${repoName}/${f.path}`,
        );
        const { error } = await supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .remove(files);
        if (error) throw error;
    }
    /**
     * Like the repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async like(userId, repoName, userOwnerId) {
        const result = await db.query(
            "SELECT likes FROM repositories WHERE name = $1 AND user_owner = $2",
            [repoName, userOwnerId],
        );
        const users_liked = result.rows[0].likes;
        users_liked.push(userId);
        await db.query(
            "UPDATE repositories SET likes = $1 WHERE name = $2 AND user_owner = $3",
            [users_liked, repoName, userOwnerId],
        );
    }
    /**
     * Search repositories by name
     * @param {string} repoName - Repository name
     * @return {Promise<Types.RepositoryFounded[]>} Repositories founded
     * @async
     * */
    static async search(repoName) {
        const repos_result = await db.query(SEARCH_REPOSITORIES, [
            `%${repoName}%`,
        ]);
        const repos = repos_result.rows;
        return repos;
    }
    /**
     * Change name of repository
     * @param {string} newRepoName - New repository name
     * @param {string} repoName - Repository name
     * @async
     * */
    static async changeName(newRepoName, repoName, userId) {
        await db.query(
            "UPDATE repositories SET name = $1 WHERE name = $2 AND user_owner = $3",
            [newRepoName, repoName, userId],
        );
    }
    /**
     * Change description of repository
     * @param {string} newDescription - New repository description
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @async
     * */
    static async changeDescription(newDescription, repoName, userId) {
        await db.query(
            "UPDATE repositories SET description = $1 WHERE name = $2 AND user_owner = $3",
            [newDescription, repoName, userId],
        );
    }
    /**
     * Get full information of repository by name and user owner ID
     * @param {string} repoName - Repository name
     * @param {string} userId - User owner ID
     * @return {Promise<Types.RepoInfo>} Info object of repository
     * @async
     * */
    static async getFullInfo(repoName, userId) {
        const info_result = await db.query(REPOSITORY_INFO, [userId, repoName]);
        const info = info_result.rows[0];

        const readme_url = supabase.storage
            .from(SUPABASE_REPOSITORY_BUCKET)
            .getPublicUrl(`${userId}/${repoName}/README.md`).data.publicUrl;
        const res = await fetch(readme_url);

        if (res.ok) {
            const content = await res.text();
            const linesMatches = content
                .split("\n")
                .filter(
                    (line) => line.includes("<img") || line.startsWith("!["),
                );

            let readme_with_urls;
            if (linesMatches.length == 0) {
                readme_with_urls = content;
            } else {
                readme_with_urls = content
                    .split("\n")
                    .map((line) => {
                        if (line.includes("<img") || line.startsWith("![")) {
                            let path;
                            if (line.startsWith("![")) {
                                path = line.slice(
                                    line.indexOf("(") + 1,
                                    line.lastIndexOf(")"),
                                );
                            } else {
                                path = line.slice(
                                    line.indexOf("=") + 2,
                                    line.lastIndexOf('"'),
                                );
                            }
                            const url = supabase.storage
                                .from(SUPABASE_REPOSITORY_BUCKET)
                                .getPublicUrl(
                                    join(`${userId}/${repoName}`, path),
                                ).data.publicUrl;
                            return line.replace(path, url);
                        } else {
                            return line;
                        }
                    })
                    .join("\n");
            }

            info.readme = readme_with_urls;
        } else {
            info.readme = null;
        }

        return info;
    }
    /**
     * Get repositories from an user by ID
     * @param {string} username - User owner name
     * @return {Promise<Types.Repo[]>} User's repositories
     * @async
     * */
    static async getFromUser(username) {
        const userId_result = await db.query(
            "SELECT id FROM users WHERE username = $1",
            [username],
        );
        const userId = userId_result.rows[0].id;
        const repos_result = await db.query(USER_REPOSITORIES, [userId]);
        const repos = repos_result.rows;
        return repos;
    }
    /**
     * Delete a temp zip file of repository
     * @param {string} fileName - Zip file name
     * @async
     * */
    static async deleteZip(fileName) {
        await rm(join(reposPath, "downloads", fileName), { recursive: true });
    }
    /**
     * Check if a user already like a repo
     * @param {string} username - User name that will like
     * @param {string} repoName - Repository name
     * @param {string} userOwnerId - User owner id
     * @return {Promise<boolean>} True if user liked the repo and False if not
     * @async
     * */
    static async checkIfLike(username, repoName, userOwnerId) {
        const result = await db.query(REPOSITORIES_LIKES, [
            repoName,
            userOwnerId,
        ]);
        const users_likes = result.rows.map((r) => r.username);
        return users_likes.includes(username);
    }
    /**
     * Remove a like from repository of an user
     * @param {string} repoName - Repository name
     * @param {string} userOwnerId - User owner ID
     * @param {string} userId - User ID
     * @async
     * */
    static async removeLike(repoName, userOwnerId, userId) {
        const res = await db.query(
            "SELECT likes FROM repositories WHERE name = $1 AND user_owner = $2",
            [repoName, userOwnerId],
        );
        const likes = res.rows[0].likes.filter((f) => f != userId);
        await db.query(
            "UPDATE repositories SET likes = $1 WHERE name = $2 AND user_owner = $3",
            [likes, repoName, userOwnerId],
        );
    }
    /**
     * Remove repository from temp directory
     * @param {string} repoName - Repository name
     * @async
     * */
    static async removeTemp(repoName) {
        await rm(join(reposPath, repoName), { recursive: true });
    }
}
