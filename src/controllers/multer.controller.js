import multer from "multer"
import { join, dirname, extname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, join(__dirname, "..", "temp", "images"))
    },
    filename: (req, file, cb) => {
        const { user_id } = req.body
        const ext = extname(file.originalname)
        return cb(null, `${user_id}${ext}`)
    }
})

export default class MulterController {
    static uploadImage = multer({
        storage: imageStorage,
        fileFilter: (req, file, cb) => {
            const exts_available = [".png", ".webp", ".jpg"]
            const ext = extname(file.originalname)
            if (exts_available.includes(ext)) {
                return cb(null, true)
            } else {
                return cb(new Error("Unsupported image extension!"))
            }
        }
    }).single("user_image")
}
