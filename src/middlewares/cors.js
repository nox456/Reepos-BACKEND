import { FRONTEND_ORIGIN } from "../config/env.js"

export default function cors(_,res,next) {
    res.set({
        "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE"
    })
    next()
}
