import multer from "multer"
import { extname, join, dirname } from "path"
import { mkdir } from "fs/promises"
import { fileURLToPath } from "url"

const reposPath = join(dirname(fileURLToPath(import.meta.url)), "../temp")

// Store buffer image in memory
const imageStorage = multer.memoryStorage()
const repoStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const { path, projectName } = req.body
        await mkdir(join(reposPath, projectName, path), { recursive: true })
        return cb(null, join(reposPath, projectName, path))
    },
    filename: (req, file, cb) => {
        return cb(null, file.originalname)
    }
})

// Class used in 'user.routes.js' that contains middlewares to upload images
export default class MulterController {
    static uploadImage = multer({
        storage: imageStorage,
        fileFilter: (req, file, cb) => {
            // Only upload images with these extensions
            const exts_available = [".png", ".webp", ".jpg"]
            const ext = extname(file.originalname)
            if (exts_available.includes(ext)) {
                return cb(null, true)
            } else {
                return cb(new Error("Unsupported image extension!"))
            }
        }
    }).single("user_image")
    static uploadRepository = multer({
        storage: repoStorage
    }).single("file")
}
