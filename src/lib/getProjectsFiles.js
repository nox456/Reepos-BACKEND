import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { readdir, readFile } from "fs/promises"

const projectsPath = join(dirname(fileURLToPath(import.meta.url)), "../temp")

export default async function getProjectFiles(projectName) {
    const path = join(projectsPath, projectName)
    const allFiles = await readdir(path, { recursive: true })

    const filesFiltered = allFiles.filter((f) => !f.includes(".git") && f.includes("."))

    const files = []
    for (const file of filesFiltered) {
        const buffer = await readFile(join(path, file))
        files.push({
            path: file,
            buffer
        })
    }
    return files
}
