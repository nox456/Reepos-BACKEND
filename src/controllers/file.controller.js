import FileService from "../services/file.service.js";
import ErrorHandler from "../lib/errorHandler.js"
import ResponseHandler from "../lib/responseHandler.js"

export default class FileController {
    static async download(req,res) {
        const { id, projectName } = req.query
        let result
        try {
            result = await FileService.download(id,projectName)
        } catch(e) {
            console.error(e)
            return new ErrorHandler(res).internalServer()
        }
        if (result?.validationError) {
            return new ErrorHandler(res).badRequest(result.validationError,result.validationField)
        } else if (result?.fileNotExists) {
            return new ErrorHandler(res).notFound("File doesn't exists!", id)
        }
        return ResponseHandler.ok("File founded!", result, res)
    }
}
