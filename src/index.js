import express from "express";
import { HOST, PORT } from "./config/env.js";
import morgan from "./middlewares/morgan.js"
import routes from "./routes/index.routes.js"

console.clear();
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan)

// Routes
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()
})
app.use(routes)

// Start Server
app.listen(PORT, HOST, () => {
    console.log(`Server on http://${HOST}:${PORT}`);
});
