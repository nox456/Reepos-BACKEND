import FileService from "../services/file.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js";
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

/**
 * Controller to handle Files requests
 * */
export default class FileController {
    /**
     * Get public URL of a file to download it
     * */
    static async download(req, res) {
        const { id, repoName } = req.query;
        const { token } = req.cookies;
        let result;
        try {
            result = await FileService.download(id, repoName, token);
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
            return ResponseHandler.ok("File founded!", result.data, res);
        }
    }
    /**
     * Get info
     * */
    static async getInfo(req, res) {
        const { repoName, fileId, username } = req.query;
        let result;
        try {
            result = await FileService.getInfo(fileId, repoName, username);
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
            return ResponseHandler.ok("File Info", result.data, res);
        }
    }
}
