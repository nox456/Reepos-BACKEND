import RepositoryService from "../services/repository.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js"
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

export default class RepositoryController {
    static async create(req, res) {
        const { token } = req.cookies;
        const { repoData } = req.body;
        let result;
        try {
            result = await RepositoryService.createRepository(repoData, token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
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
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
        } else {
            return ResponseHandler.ok(
                "Repository downloaded!",
                result.data,
                res,
            );
        }
    }
}
