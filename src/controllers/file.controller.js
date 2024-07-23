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
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(
                result.validationError,
                result.validationField,
            );
        } else if (result?.fileNotExistsDb) {
            return new ErrorHandler(res).notFound(
                "File doesn't exists in database!",
                id,
            );
        } else if (result?.fileNotExistsCloud) {
            return new ErrorHandler(res).notFound(
                "File doesn't exists in cloud!",
                id,
            );
        }
        return ResponseHandler.ok("File founded!", result, res);
    }
}
