import archiver from "archiver";
import { createWriteStream } from "fs";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const downloadsDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../temp/downloads",
);

/**
 * @typedef {Object} File
 * @property {string} id - File ID
 * @property {string} name - File name
 * @property {string} size - File size
 * @property {string} path - File path
 * @property {string} last_commit_title - Title of the last commit
 * @property {string} last_commit_created_at - Date of creation of the last commit
 * @property {string} url - Public url of the file
 * */
/**
 * Generate a zip files by repository name
 * @param {File[]} files - Files urls
 * @param {string} repoName - Repository name
 * @return {Promise<string>} ZIP file name
 * @async
 * */
export default async function downloadFiles(files, repoName) {
    const downloads = await readdir(downloadsDir)
    if (downloads.includes(`${repoName}.zip`)) return `${repoName}.zip`

    const zip = createWriteStream(join(downloadsDir, `${repoName}.zip`));
    const archive = archiver("zip", { zlib: { level: 5 } });

    archive.pipe(zip);

    for (const file of files) {
        const res = await fetch(file.url);
        const res_blob = await res.blob()
        const res_buffer = await res_blob.arrayBuffer()
        const content = Buffer.from(res_buffer)

        archive.append(content, { name: file.name, prefix: `${repoName}/${file.path.slice(0,file.path.indexOf(file.name))}` });
    }
    await archive.finalize();
    return `${repoName}.zip`;
}
