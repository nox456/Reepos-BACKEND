import express from "express";
import { HOST, PORT } from "./config/env.js";
import morgan from "./middlewares/morgan.js"
import cookie_parser from "./middlewares/cookie-parser.js"
import routes from "./routes/index.routes.js"

console.clear();
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan)
app.use(cookie_parser)

// Routes
app.use(routes)

// Start Server
app.listen(PORT, HOST, () => {
    console.log(`Server on http://${HOST}:${PORT}`);
});
