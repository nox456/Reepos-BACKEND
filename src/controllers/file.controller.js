import FileService from "../services/file.service.js";
import ErrorHandler from "../lib/errorHandler.js";
import ResponseHandler from "../lib/responseHandler.js";

export default class FileController {
    static async download(req, res) {
        const { id, repoName } = req.query;
        let result;
        try {
            result = await FileService.download(id, repoName);
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
            return ResponseHandler.ok("File founded!", result.data, res);
        }
    }
}
