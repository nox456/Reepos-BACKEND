import simpleGit from "simple-git";
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function projectInfo(projectName) {
    const git = simpleGit(join(__dirname, "../temp", projectName))
    const commits = await git.log({
        format: { title: "%s", content: "%b", hash: "%H", author: "%an", created_at: "%ad" }
    })
    for (const commit of commits.all) {
        const branchesResult = await git.branch(['--contains', commit.hash])
        commit.branches = Object.keys(branchesResult.branches)
    }
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
        const resultRaw = await git.show([commit.hash, "--pretty=format:", '--name-status'])
        const files = resultRaw.split("\n").map((f) => f.split("\t"))
        for (const file of files) {
            if (file[0] == "A" || file[0] == "M" || file[0] == "D" ) {
                modifications.push({
                    commit: commit.hash,
                    type: file[0],
                    file: file[1]
                })
            }
        }
    }
    return {
        commits: commits.all,
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
