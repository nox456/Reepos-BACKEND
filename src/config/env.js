if (!process.env.HOST) {
    throw new Error("Env var HOST is not defined!");
}
if (!process.env.PORT) {
    throw new Error("Env var PORT is not defined!");
}
if (!process.env.DB_URL) {
    throw new Error("Env var DB_URL is not defined!");
}
if (!process.env.SECRET) {
    throw new Error("Env var SECRET is not defined!")
}
export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const DB_URL = process.env.DB_URL;
export const SECRET = process.env.SECRET;
