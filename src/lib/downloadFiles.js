import archiver from "archiver";
import { createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const downloadsDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../temp/downloads",
);

/**
 * Generate a zip files by repository name
 * @param {string[]} urls - Files urls
 * @param {string} repoName - Repository name
 * @return {Promise<string>} ZIP file name
 * @async
 * */
export default async function downloadFiles(files, repoName) {
    const zip = createWriteStream(join(downloadsDir, `${repoName}.zip`));
    const archive = archiver("zip", { zlib: { level: 5 } });

    archive.pipe(zip);

    for (const file of files) {
        const res = await fetch(file.url);
        const res_blob = await res.blob()
        const res_buffer = await res_blob.arrayBuffer()
        const content = Buffer.from(res_buffer)

        archive.append(content, { name: file.name, prefix: file.path });
    }
    archive.finalize();
    return `${repoName}.zip`;
}
