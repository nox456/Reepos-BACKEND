import RepositoryService from "../services/repository.service.js";
import ErrorHandler from "../lib/errorHandler.js"
import ResponseHandler from "../lib/responseHandler.js"

export default class RepositoryController {
    static async create(req, res) {
        const { repoData, projectName } = req.body
        let repoSaved
        try {
            repoSaved = await RepositoryService.createRepository(repoData, projectName)
        } catch (e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        return ResponseHandler.ok("Created Repository!", repoSaved, res)
    }
    static async upload(req, res) {
        const { projectName } = req.body
        try {
            await RepositoryService.uploadRepository(projectName)
        } catch(e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        return ResponseHandler.ok("Repository Uploaded!", projectName, res)
    }
}
