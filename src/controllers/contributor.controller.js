import ContributorService from "../services/contributor.service.js";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js";
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

/**
 * Controller to handle contributors requests
 * */
export default class ContributorController {
    static async getAll(req, res) {
        const { repoName } = req.query;
        const { token } = req.cookies;
        let result;
        try {
            result = await ContributorService.getAll(repoName, token);
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
                "Contributors Founded!",
                result.data,
                res,
            );
        }
    }
}
