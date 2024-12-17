const requiredEnvVars = [
    'DB_URL',
    'SECRET',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'SUPABASE_IMAGE_BUCKET',
    'SUPABASE_REPOSITORY_BUCKET',
    'FRONTEND_ORIGIN',
    'COOKIES_SAMESITE',
    'COOKIES_SECURE',
    'HOST',
    'PORT'
]

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Required environment variable not defined: ${varName}`)
    }
})

export const HOST = process.env.HOST
export const PORT = process.env.PORT
export const DB_URL = process.env.DB_URL
export const SECRET = process.env.SECRET
export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_KEY = process.env.SUPABASE_KEY
export const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET
export const SUPABASE_REPOSITORY_BUCKET = process.env.SUPABASE_REPOSITORY_BUCKET
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN
export const COOKIES_SAMESITE = process.env.COOKIES_SAMESITE
export const COOKIES_SECURE = process.env.COOKIES_SECURE
