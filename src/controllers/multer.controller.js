import multer from "multer"
import { extname } from "path"

const imageStorage =  multer.memoryStorage()

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
