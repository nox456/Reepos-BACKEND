import ContributorService from "../services/contributor.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js";
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

/**
 * Controller to handle contributors requests
 * */
export default class ContributorController {
    static async getAll(req, res) {
        const { repoName, username } = req.query;
        let result;
        try {
            result = await ContributorService.getAll(repoName, username);
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
                "Contribuidores encontrados!",
                result.data,
                res,
            );
        }
    }
}
