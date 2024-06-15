import { join } from "path"
import { readdir, readFile } from "fs/promises"

export default async function getProjectFiles(projectName) {
    const allFiles = await readdir(projectName, { recursive: true })

    const filesFiltered = allFiles.filter((f) => !f.includes(".git") && f.includes("."))

    const files = []
    for (const file of filesFiltered) {
        const buffer = await readFile(join(projectName, file))
        files.push({
            path: file,
            buffer
        })
    }
    return files
}
