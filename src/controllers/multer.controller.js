import multer from "multer";
import { extname, join, dirname } from "path";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import ResponseHandler from "../lib/responseHandler.js";
import errorCodes from "../lib/constants/errorCodes.js";
import { INTERNAL_SERVER_ERROR } from "../lib/constants/errors.js";

const reposPath = join(dirname(fileURLToPath(import.meta.url)), "../temp");

const imageStorage = multer.memoryStorage();
const fileStorage = multer.diskStorage({
    destination: async (req, _, cb) => {
        const { path, repoName } = req.body;

        if (!path) return cb("Path requerido!");
        if (!repoName) return cb("Nombre de repositorio requerido!");

        await mkdir(join(reposPath, repoName, path), { recursive: true });
        return cb(null, join(reposPath, repoName, path));
    },
    filename: (_, file, cb) => cb(null, file.originalname),
});

/**
 * Controller to handle images and repository files requests
 * */
export default class MulterController {
    /**
     * Upload a user image
     * */
    static uploadImage = multer({
        storage: imageStorage,
        fileFilter: (_, file, cb) => {
            // Only upload images with these extensions
            const exts_available = [".png", ".webp", ".jpg"];
            const ext = extname(file.originalname);
            if (exts_available.includes(ext)) {
                return cb(null, true);
            } else {
                return cb(new Error("Extensión de archivo no soportado!"));
            }
        },
    }).single("user_image");
    /**
     * Upload a file
     * */
    static uploadFile(req, res) {
        multer({
            storage: fileStorage,
        }).single("file")(req, res, (err) => {
            if (err) {
                return ResponseHandler.error(
                    errorCodes[INTERNAL_SERVER_ERROR],
                    "Internal Server Error!",
                    res,
                );
            }
            return ResponseHandler.ok(
                "Archivo subido al servidor!",
                req.file.originalname,
                res,
            );
        });
    }
}
