import Repository from "../models/repository.model.js";
import Commit from "../models/commit.model.js"
import Branch from "../models/branch.model.js"
import File from "../models/file.model.js"
import Contributor from "../models/contributor.model.js"
import Modification from "../models/modification.model.js"
import projectInfo from "../lib/getProjectsInfo.js"

export default class RepositoryService {
    static async createRepository(repoData, projectName) {
        const { commits, files, branches, contributors, modifications } = await projectInfo(projectName)

        const repoSaved = await Repository.save(repoData)

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
            commitsSaved.push(await Commit.save({ ...commit, repo: repoSaved.id }))
        }

        const modificationsSaved = []
        for (const modification of modifications) {
            modificationsSaved.push(await Modification.save(modification))
        }
    }
}
