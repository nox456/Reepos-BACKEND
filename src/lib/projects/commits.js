import simpleGit from "simple-git"

export default async function getCommits(projectPath) {
    const git = simpleGit(projectPath)
    const commits = await git.log({
        format: { title: "%s", content: "%b", hash: "%H", author: "%an", created_at: "%ad" }
    })
    return commits
}
