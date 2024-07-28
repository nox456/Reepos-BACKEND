import multer from "multer";
import { extname, join, dirname } from "path";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import ResponseHandler from "../lib/responseHandler.js";

const reposPath = join(dirname(fileURLToPath(import.meta.url)), "../temp");

// Store buffer image in memory
const imageStorage = multer.memoryStorage();
const fileStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const { path, repoName } = req.body;

        if (!path) return cb("Path required!");
        if (!repoName) return cb("Repository Name required!");

        await mkdir(join(reposPath, repoName, path), { recursive: true });
        return cb(null, join(reposPath, repoName, path));
    },
    filename: (req, file, cb) => cb(null, file.originalname),
});

// Class used in 'user.routes.js' that contains middlewares to upload images
export default class MulterController {
    static uploadImage = multer({
        storage: imageStorage,
        fileFilter: (req, file, cb) => {
            // Only upload images with these extensions
            const exts_available = [".png", ".webp", ".jpg"];
            const ext = extname(file.originalname);
            if (exts_available.includes(ext)) {
                return cb(null, true);
            } else {
                return cb(new Error("Unsupported image extension!"));
            }
        },
    }).single("user_image");
    static uploadFile(req, res) {
        multer({
            storage: fileStorage,
        }).single("file")(req, res, (err) => {
            if (err) {
                return ResponseHandler.error(
                    500,
                    "Internal Server Error!",
                    res,
                );
            }
            return ResponseHandler.ok(
                "File Uploaded to Backend",
                req.file.originalname,
                res,
            );
        });
    }
}
