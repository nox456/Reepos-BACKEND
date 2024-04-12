import express from "express";
import { HOST, PORT } from "./config/env.js";
import morgan from "./middlewares/morgan.js"

console.clear();
const app = express();

// Middlewares
app.use(express.json())
app.use(morgan)

app.listen(PORT, HOST, () => {
    console.log(`Server on http://${HOST}:${PORT}`);
});
