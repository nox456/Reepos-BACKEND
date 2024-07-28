import FileService from "../services/file.service.js";
import ResponseHandler from "../lib/responseHandler.js";

export default class FileController {
    static async download(req, res) {
        const { id, repoName } = req.query;
        let result;
        try {
            result = await FileService.download(id, repoName);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(500, "Internal Server Error!", res)
        }
        if (!result.success) {
            if (result.error.type == "validation")
                return ResponseHandler.error(400, result.error.message, res)
            if (result.error.type == "not found")
                return ResponseHandler.error(404, result.error.message, res)
        } else {
            return ResponseHandler.ok("File founded!", result.data, res);
        }
    }
}
