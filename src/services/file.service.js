import File from "../models/file.model.js";

export default class FileService {
    static async download(id,projecName) {
        const id_validation_error = await File.validateId(id)
        if (id_validation_error) return id_validation_error

        const existsInDb = await File.checkIfExistsInDb(id)
        if (!existsInDb) return { fileNotExistsDb: true }

        const existsInCloud = await File.checkIfExistsInCloud(projecName,id)
        if (!existsInCloud) return { fileNotExistsCloud: true }


        const fileUrl = await File.download(id,projecName)
        return fileUrl
    }
}
