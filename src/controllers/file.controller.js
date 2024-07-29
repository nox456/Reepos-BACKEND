import FileService from "../services/file.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js";
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

export default class FileController {
    static async download(req, res) {
        const { id, repoName } = req.query;
        let result;
        try {
            result = await FileService.download(id, repoName);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(errorCodes[INTERNAL_SERVER_ERROR], "Internal Server Error!", res)
        }
        if (!result.success) {
            return ResponseHandler.error(errorCodes[result.error.type], result.error.message, res)
        } else {
            return ResponseHandler.ok("File founded!", result.data, res);
        }
    }
}
