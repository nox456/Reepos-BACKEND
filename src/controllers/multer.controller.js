import multer from "multer"
import { extname } from "path"

// Store buffer image in memory
const imageStorage =  multer.memoryStorage()

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
}
