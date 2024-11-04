import errorCodes from "../lib/constants/errorCodes.js";
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";
import ResponseHandler from "../lib/responseHandler.js";
import CommitService from "../services/commit.service.js";

/**
 * Controller to handle commits requests
 * */
export default class CommitController {
    /**
     * Get all commits from a repository
     * */
    static async getAll(req, res) {
        const { repoName, username } = req.query;
        let result;
        try {
            result = await CommitService.getAll(repoName, username);
        } catch (e) {
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
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
            return ResponseHandler.ok("Commits encontrados!", result.data, res);
        }
    }
    /**
     * Get full information of commit by hash
     * */
    static async getInfo(req, res) {
        const { hash, repoName, username } = req.query;
        let result;
        try {
            result = await CommitService.getInfo(hash, repoName, username);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
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
                "Información del Commit!",
                result.data,
                res,
            );
        }
    }
}
