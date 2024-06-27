import RepositoryService from "../services/repository.service.js";
import ErrorHandler from "../lib/errorHandler.js";
import ResponseHandler from "../lib/responseHandler.js";

export default class RepositoryController {
    static async create(req, res) {
        const { repoData, projectName } = req.body;
        let repoSaved;
        try {
            repoSaved = await RepositoryService.createRepository(
                repoData,
                projectName,
            );
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        return ResponseHandler.ok("Created Repository!", repoSaved, res);
    }
    static async uploadCloud(req, res) {
        const { projectName } = req.body;
        let result;
        try {
            result = await RepositoryService.uploadRepository(projectName);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result?.projectNotExists) {
            return new ErrorHandler(res).notFound(
                "Project doesn't Exists",
                projectName,
            );
        } else {
            return ResponseHandler.ok(
                "Repository Uploaded to Cloud!",
                projectName,
                res,
            );
        }
    }
    static async getFiles(req, res) {
        const { projectName } = req.body;
        let result;
        try {
            result = await RepositoryService.getFiles(projectName);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result?.repoNotExists) {
            return new ErrorHandler(res).notFound(
                "Repository doesn't exists!",
                projectName,
            );
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound(
                "Files not found!",
                projectName,
            );
        }
        return ResponseHandler.ok("Files founded!", result, res);
    }
    static async download(req, res) {
        const { projectName } = req.query;
        let result;
        try {
            result = await RepositoryService.download(projectName);
        } catch (e) {
            console.error();
            return new ErrorHandler(res).internalServer();
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result?.repoNotExistsDb) {
            return new ErrorHandler(res).notFound(
                "Repository doesn't exists in database!",
                projectName,
            );
        } else if (result?.repoNotExistsCloud) {
            return new ErrorHandler(res).notFound(
                "Repository doesn't exists in cloud!",
                projectName,
            );
        }
        return ResponseHandler.ok("Project downloaded!", result, res);
    }
}
