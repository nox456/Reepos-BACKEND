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
            return ResponseHandler.ok("Repositorio creado!", null, res);
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
                "Repositorio subido a la nube!",
                null,
                res,
            );
        }
    }
    /**
     * Generate a zip file with repository content and get url to download
     * */
    static async download(req, res) {
        const { repoName, username } = req.query;
        let result;
        try {
            result = await RepositoryService.download(repoName, username);
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
                "Repositorio descargado!",
                result.data,
                res,
            );
        }
    }
    /**
     * Delete a repository from database and cloud storage
     * */
    static async delete(req, res) {
        const { repoName, password } = req.body;
        const { token } = req.cookies;
        let result;
        try {
            result = await RepositoryService.delete(repoName, token, password);
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
            return ResponseHandler.ok("Repositorio eliminado!", null, res);
        }
    }
    static async like(req, res) {
        const { repoName, username, userOwnerName } = req.body;
        let result;
        try {
            result = await RepositoryService.like(
                username,
                repoName,
                userOwnerName,
            );
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
                "Repositorio con like!",
                result.data,
                res,
            );
        }
    }
    /**
     * Search repositories by name
     * */
    static async search(req, res) {
        const { repoName } = req.query;
        let result;
        try {
            result = await RepositoryService.search(repoName);
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
                "Repositorio encontrado!",
                result.data,
                res,
            );
        }
    }
    /**
     * Change name of repository
     * */
    static async changeName(req, res) {
        const { newRepoName, repoName } = req.body;
        const { token } = req.cookies;
        let result;
        try {
            result = await RepositoryService.changeName(
                newRepoName,
                repoName,
                token,
            );
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
                "Nombre de repositorio cambiado!",
                result.data,
                res,
            );
        }
    }
    /**
     * Change description of repository
     * */
    static async changeDescription(req, res) {
        const { newDescription, repoName } = req.body;
        const { token } = req.cookies;
        let result;
        try {
            result = await RepositoryService.changeDescription(
                newDescription,
                repoName,
                token,
            );
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
                "Descripción de repositorio cambiada!",
                result.data,
                res,
            );
        }
    }
    static async getInfo(req, res) {
        const { repoName, username } = req.query;
        let result;
        try {
            result = await RepositoryService.getInfo(repoName, username);
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
                "Información del repositorio!",
                result.data,
                res,
            );
        }
    }
    /**
     * Get repositories from an user
     * */
    static async getFromUser(req, res) {
        const { username } = req.query;
        let result;
        try {
            result = await RepositoryService.getFromUser(username);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del Servidor!",
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
                "Repositorios encontrados!",
                result.data,
                res,
            );
        }
    }
    /**
     * Delete temp zip file
     * */
    static async deleteZip(req, res) {
        const { fileName } = req.body;
        let result;
        try {
            result = await RepositoryService.deleteZip(fileName);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del servidor!",
                res,
            );
        }
        return ResponseHandler.ok("Archivo zip eliminado!", null, res);
    }
    /**
     * Remove like from repository
     * */
    static async removeLike(req, res) {
        const { repoName, userOwnerName, username } = req.body;
        let result;
        try {
            result = await RepositoryService.removeLike(
                repoName,
                userOwnerName,
                username,
            );
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del Servidor!",
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
            return ResponseHandler.ok("Me gusta removido!", null, res);
        }
    }
    /**
     * Remove repo from temp directory
     * */
    static async removeTemp(req, res) {
        const { repoName } = req.body;
        let result;
        try {
            result = await RepositoryService.removeTemp(repoName);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del Servidor!",
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
                "Repositorio eliminado de la carpeta TEMP!",
                null,
                res,
            );
        }
    }
    /**
     * Delete from database without password
     * */
    static async deleteDb(req, res) {
        const { repoName } = req.body;
        const { token } = req.cookies;
        let result;
        try {
            result = await RepositoryService.deleteDb(repoName, token);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del Servidor!",
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
                "Repositorio eliminado de la base de datos!",
                null,
                res,
            );
        }
    }
    /**
     * Get images used in README
     * */
    static async readme(req, res) {
        const { token } = req.cookies;
        const { repoName } = req.query;
        let result;
        try {
            result = await RepositoryService.readme(token, repoName);
        } catch (e) {
            console.error(e);
            return ResponseHandler.error(
                errorCodes[INTERNAL_SERVER_ERROR],
                "Error del Servidor!",
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
            return ResponseHandler.ok("Imagenes del README!", result.data, res);
        }
    }
}
