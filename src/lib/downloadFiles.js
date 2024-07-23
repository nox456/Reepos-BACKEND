import archiver from "archiver";
import { createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const downloadsDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../temp/downloads",
);

// Generate a zip file with the content of a repository
export default async function downloadFiles(urls, repoName) {
    const zip = createWriteStream(join(downloadsDir, `${repoName}.zip`));
    const archive = archiver("zip", { zlib: { level: 5 } });

    archive.pipe(zip);

    for (const url of urls) {
        const res = await fetch(url);
        const res_blob = await res.blob()
        const res_buffer = await res_blob.arrayBuffer()
        const content = Buffer.from(res_buffer)
        const name = url.slice(url.lastIndexOf("/") + 1);
        const path = url.slice(url.lastIndexOf(repoName), url.indexOf(name));

        archive.append(content, { name, prefix: path });
    }
    archive.finalize();
    return `${repoName}.zip`;
}
