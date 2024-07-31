import { join } from "path"
import { readdir, readFile } from "fs/promises"

/**
 * @typedef {Object} File
 * @property {string} path - File path
 * @property {Buffer} buffer - File buffer
 * */
/**
 * Get repository files by repository name
 * @param {string} repoName - Repository name
 * @return {Promise<File[]>} Files
 * @async
 * */
export default async function getRepoFiles(repoName) {
    const allFiles = await readdir(repoName, { recursive: true })

    const filesFiltered = allFiles.filter((f) => !f.includes(".git") && f.includes("."))

    const files = []
    for (const file of filesFiltered) {
        const buffer = await readFile(join(repoName, file))
        files.push({
            path: file,
            buffer
        })
    }
    return files
}
