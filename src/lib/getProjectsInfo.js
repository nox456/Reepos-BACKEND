import simpleGit from "simple-git";
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function projectInfo(projectName) {
    const git = simpleGit(join(__dirname, "../temp", projectName))
    const commits = await git.log({
        format: { title: "%s", content: "%b", hash: "%H", author: "%an", created_at: "%ad" }
    })
    const contributors = await git.log({
        format: { name: "%an" }
    })
    const branches = await git.branchLocal()

    const filesRaw = await git.raw('ls-tree', '-r', '--name-only', 'HEAD')

    const filesPath = filesRaw.split("\n")

    const files = []

    for (const path of filesPath) {
        const sizeText = await git.raw('ls-tree', '-r', '--format=%(objectsize)', 'HEAD', path == "" ? "." : path)
        const sizeBytes = parseInt(sizeText.slice(0, sizeText.lastIndexOf("\\")))

        let size
        if (sizeBytes >= 1000000) {
            size = `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`
        } else if (sizeBytes > 1000) {
            size = `${(sizeBytes / 1024).toFixed(1)} KB`
        } else {
            size = `${sizeBytes} B`
        }

        files.push({
            name: path.slice(path.lastIndexOf("/") + 1),
            size,
            path
        })
    }
    const modifications = []

    for (const commit of commits.all) {
        const diff = await git.diffSummary([commit.hash, '--name-status'])
        for (const file of diff.files) {
            modifications.push({
                commit: commit.hash,
                type: file.status,
                file: file.file
            })
        }
    }
    return {
        commits,
        contributors: [...new Set(contributors.all.map((c => c.name)))],
        branches: branches.all.map((b) => {
            return {
                name: b,
                type: b == "master" || b == "main" ? "primary" : "secondary"
            }
        }),
        files,
        modifications
    }
}
