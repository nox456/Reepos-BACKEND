import RepositoryService from "../services/repository.service.js";
import ErrorHandler from "../lib/errorHandler.js";
import ResponseHandler from "../lib/responseHandler.js";

export default class RepositoryController {
    static async create(req, res) {
        const { token } = req.cookies;
        const { repoData } = req.body;
        let result;
        try {
            result = await RepositoryService.createRepository(repoData, token);
        } catch (e) {
            console.error(e);
            return new ErrorHandler(res).internalServer();
        }
        if (!result.success) {
            return new ErrorHandler(res).badRequest(result.error.message, null);
        } else {
            return ResponseHandler.ok("Created Repository!", null, res);
        }
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
        if (!result.success) {
            if (result.error.type == "validation")
                return new ErrorHandler(res).badRequest(
                    result.error.message,
                    null,
                );
            if (result.error.type == "not found")
                return new ErrorHandler(res).notFound(
                    result.error.message,
                    null,
                );
        } else {
            return ResponseHandler.ok(
                "Repository Uploaded to Cloud!",
                null,
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
        if (!result.success) {
            if (result.error.type == "validation")
                return new ErrorHandler(res).badRequest(
                    result.error.message,
                    null,
                );
            if (result.error.type == "not found")
                return new ErrorHandler(res).notFound(
                    result.error.message,
                    null,
                );
        } else {
            return ResponseHandler.ok("Files founded!", result.data, res);
        }
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
        if (!result.success) {
            if (result.error.type == "validation")
                return new ErrorHandler(res).badRequest(
                    result.error.message,
                    null,
                );
            if (result.error.type == "not found")
                return new ErrorHandler(res).notFound(
                    result.error.message,
                    null,
                );
        } else {
            return ResponseHandler.ok(
                "Repository downloaded!",
                result.data,
                res,
            );
        }
    }
}
