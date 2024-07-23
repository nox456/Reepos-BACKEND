import RepositoryService from "../services/repository.service.js";
import ErrorHandler from "../lib/errorHandler.js";
import ResponseHandler from "../lib/responseHandler.js";

export default class RepositoryController {
    static async create(req, res) {
        const { repoData, repoName } = req.body;
        let repoSaved;
        try {
            repoSaved = await RepositoryService.createRepository(
                repoData,
                repoName,
            );
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        return ResponseHandler.ok("Created Repository!", repoSaved, res);
    }
    static async uploadCloud(req, res) {
        const { repoName } = req.body;
        let result;
        try {
            result = await RepositoryService.uploadRepository(repoName);
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
                "Repository doesn't Exists",
                repoName,
            );
        } else {
            return ResponseHandler.ok(
                "Repository Uploaded to Cloud!",
                repoName,
                res,
            );
        }
    }
    static async getFiles(req, res) {
        const { repoName } = req.body;
        let result;
        try {
            result = await RepositoryService.getFiles(repoName);
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
                repoName,
            );
        } else if (result.length == 0) {
            return new ErrorHandler(res).notFound(
                "Files not found!",
                repoName,
            );
        }
        return ResponseHandler.ok("Files founded!", result, res);
    }
    static async download(req, res) {
        const { repoName } = req.query;
        let result;
        try {
            result = await RepositoryService.download(repoName);
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
                repoName,
            );
        } else if (result?.repoNotExistsCloud) {
            return new ErrorHandler(res).notFound(
                "Repository doesn't exists in cloud!",
                repoName,
            );
        }
        return ResponseHandler.ok("Repository downloaded!", result, res);
    }
}
