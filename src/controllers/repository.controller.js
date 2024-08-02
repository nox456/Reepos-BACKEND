import RepositoryService from "../services/repository.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js";
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

/**
 * Controller to handle repositories requests
 * */
export default class RepositoryController {
    /**
     * Create a repository and save it in database
     * */
    static async create(req, res) {
        const { token } = req.cookies;
        const { repoData } = req.body;
        let result;
        try {
            result = await RepositoryService.createRepository(repoData, token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Internal Server Error!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Created Repository!", null, res);
        }
    }
    /**
     * Upload a repository to cloud storage
     * */
    static async uploadCloud(req, res) {
        const { repoName } = req.body;
        const { token } = req.cookies;
        let result;
        try {
            result = await RepositoryService.uploadRepository(repoName, token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Internal Server Error!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok(
                "Repository Uploaded to Cloud!",
                null,
                res,
            );
        }
    }
    /**
     * Get repository files
     * */
    static async getFiles(req, res) {
        const { repoName } = req.body;
        let result;
        try {
            result = await RepositoryService.getFiles(repoName);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Internal Server Error!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Files founded!", result.data, res);
        }
    }
    /**
     * Generate a zip file with repository content and get url to download
     * */
    static async download(req, res) {
        const { repoName } = req.query;
        let result;
        try {
            result = await RepositoryService.download(repoName);
        } catch (e) {
            console.error();
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Internal Server Error!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok(
                "Repository downloaded!",
                result.data,
                res,
            );
        }
    }
    /**
     * Delete a repository from database and cloud storage
     * */
    static async delete(req, res) {
        const { repoName } = req.body;
        const { token } = req.cookies;
        let result;
        try {
            result = await RepositoryService.delete(repoName, token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Internal Server Error!",
                res,
            );
        }
        if (!result.success) {
            return ResponseHandler.error(
                errorCodes[result.error.type],
                result.error.message,
                res,
            );
        } else {
            return ResponseHandler.ok("Repository deleted!", null, res);
        }
    }
}
