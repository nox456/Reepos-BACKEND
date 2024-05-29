import simpleGit from "simple-git";

export default async function getContributors(projectPath) {
    const git = simpleGit(projectPath)
    const contributors = await git.log({
        format: { name: "%an" }
    })
    return contributors
}
