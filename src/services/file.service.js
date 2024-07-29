import File from "../models/file.model.js";

export default class FileService {
    static async download(id,projecName) {
        const id_validation = await File.validateId(id)
        if (id_validation) return {
            success: false,
            error: {
                message: id_validation.validationError,
                type: "validation"
            },
            data: null
        }

        const existsInDb = await File.checkIfExistsInDb(id)
        if (!existsInDb) return {
            success: false,
            error: {
                message: "File doesn't exists in database!",
                type: "not found"
            },
            data: null
        }

        const existsInCloud = await File.checkIfExistsInCloud(projecName,id)
        if (!existsInCloud) return {
            success: false,
            error: {
                message: "File doesn't exists in cloud storage",
                type: "not found"
            },
            data: null
        }


        const fileUrl = await File.download(id,projecName)
        return {
            success: true,
            error: null,
            data: fileUrl
        }
    }
}
