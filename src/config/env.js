// Throw errors when a needed env var doesn't exists
if (!process.env.DB_URL) {
    throw new Error("Env var DB_URL is not defined!");
}
if (!process.env.SECRET) {
    throw new Error("Env var SECRET is not defined!")
}
if (!process.env.SUPABASE_URL) {
    throw new Error("Env var SUPABASE_URL is not defined!")
}
if (!process.env.SUPABASE_KEY) {
    throw new Error("Env var SUPABASE_KEY is not defined!")
}
if (!process.env.SUPABASE_IMAGE_BUCKET) {
    throw new Error("Env var SUPABASE_IMAGE_BUCKET is not defined!")
}
if (!process.env.SUPABASE_REPOSITORY_BUCKET) {
    throw new Error("Env var SUPABASE_REPOSITORY_BUCKET is not defined!")
}
if (!process.env.FRONTEND_ORIGIN) {
    throw new Error("Env var FRONTEND_ORIGIN is not defined!")
}
if (!process.env.COOKIES_SAMESITE) {
    throw new Error("Env var COOKIES_SAMESITE is not defined!")
}
if (!process.env.COOKIES_SECURE) {
    throw new Error("Env var COOKIES_SECURE is not defined!")
}
export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const DB_URL = process.env.DB_URL;
export const SECRET = process.env.SECRET;
export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_KEY = process.env.SUPABASE_KEY
export const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET
export const SUPABASE_REPOSITORY_BUCKET = process.env.SUPABASE_REPOSITORY_BUCKET
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN
export const COOKIES_SAMESITE = process.env.COOKIES_SAMESITE
export const COOKIES_SECURE = process.env.COOKIES_SECURE
