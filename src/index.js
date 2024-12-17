import express from "express";
import { HOST, PORT, NODE_ENV, RENDER_EXTERNAL_URL  } from "./config/env.js";
import morgan from "./middlewares/morgan.js";
import cookie_parser from "./middlewares/cookie-parser.js";
import routes from "./routes/index.routes.js";
import cors from "./middlewares/cors.js";

console.clear();
const app = express();

// Middlewares
app.use(cors);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan);
app.use(cookie_parser);

// Routes
app.use(routes);

// Start Server
app.listen(PORT, HOST, () => {
    if (NODE_ENV == 'production') {
        console.log(`Server on ${RENDER_EXTERNAL_URL}`);
    } else {
        console.log(`Server on http://${HOST}:${PORT}`)
    }
});
