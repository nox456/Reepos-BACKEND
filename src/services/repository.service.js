import Repository from "../models/repository.model.js";
import Commit from "../models/commit.model.js"
import Branch from "../models/branch.model.js"
import File from "../models/file.model.js"
import Contributor from "../models/contributor.model.js"
import Modification from "../models/modification.model.js"
import Commit_Branch from "../models/commit_branch.model.js";
import Repository_Language from "../models/repository_language.model.js";
import projectInfo from "../lib/getProjectsInfo.js"

export default class RepositoryService {
    static async createRepository(repoData, projectName) {
        const { commits, files, branches, contributors, modifications } = await projectInfo(projectName)
        const { name, description, user_owner, languages } = repoData
        const repoSaved = await Repository.save({ name, description, user_owner })

        for (const language of languages) {
            await Repository_Language.save(repoSaved.id, language)
        }

        const contributorsSaved = []
        for (const contributor of contributors) {
            contributorsSaved.push(await Contributor.save({ contributor, repo: repoSaved.id }))
        }

        const branchesSaved = []
        for (const branch of branches) {
            branchesSaved.push(await Branch.save({ name: branch.name, type: branch.type, repo: repoSaved.id }))
        }

        const filesSaved = []
        for (const file of files) {
            filesSaved.push(await File.save({ name: file.name, size: file.size, path: file.path, repo: repoSaved.id }))
        }

        const commitsSaved = []
        for (const commit of commits) {
            const contributor = contributorsSaved.find((c) => c.name == commit.author).id
            const commitSaved = await Commit.save({ title: commit, content: commit.content, hash: commit.hash, author: contributor, created_at: commit.created_at, repo: repoSaved.id })

            commitsSaved.push(commitSaved)

            const branchesSaved = branchesSaved.filter((b) => commit.branches.includes(b.name))

            for (const branchSaved of branchesSaved) {
                await Commit_Branch.save(commitSaved.id, branchSaved.id)
            }
        }

        for (const modification of modifications) {
            const commit = commitsSaved.find((c) => c.hash == modification.commit).id
            const file = filesSaved.find((f) => f.path == modification.file).id
            await Modification.save({ type: modification.type, commit, file })
        }
        return repoSaved
    }
}
