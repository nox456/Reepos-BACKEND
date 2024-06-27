import archiver from "archiver";
import { createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const downloadsDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../temp/downloads",
);

// Generate a zip file with the content of a repository
export default async function downloadFiles(urls, projectName) {
    const zip = createWriteStream(join(downloadsDir, `${projectName}.zip`));
    const archive = archiver("zip", { zlib: { level: 5 } });

    archive.pipe(zip);

    for (const url of urls) {
        const res = await fetch(url);
        const content = await res.text();
        const name = url.slice(url.lastIndexOf("/") + 1);
        const path = url.slice(url.lastIndexOf(projectName), url.indexOf(name));

        archive.append(content, { name, prefix: path });
    }
    archive.finalize();
    return `${projectName}.zip`;
}
