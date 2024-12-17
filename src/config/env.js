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
    'PORT',
]

requiredEnvVars.forEach(varName => {
    if (!process.env[varName] && varName == 'HOST' && process.env.NODE_ENV != 'production') {
        throw new Error(`Required environment variable not defined: ${varName}`)
    }
})

const {
    HOST,
    PORT,
    DB_URL,
    SECRET,
    SUPABASE_URL,
    SUPABASE_KEY,
    SUPABASE_IMAGE_BUCKET,
    SUPABASE_REPOSITORY_BUCKET,
    FRONTEND_ORIGIN,
    COOKIES_SAMESITE,
    COOKIES_SECURE,
    NODE_ENV,
    RENDER_EXTERNAL_HOST,
} = process.env

export {
    HOST,
    PORT,
    DB_URL,
    SECRET,
    SUPABASE_URL,
    SUPABASE_KEY,
    SUPABASE_IMAGE_BUCKET,
    SUPABASE_REPOSITORY_BUCKET,
    FRONTEND_ORIGIN,
    COOKIES_SAMESITE,
    COOKIES_SECURE,
    NODE_ENV,
    RENDER_EXTERNAL_HOST,
}
