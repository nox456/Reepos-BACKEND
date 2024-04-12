import pg from "pg";
import { DB_URL } from "../config/env.js";

const db = new pg.Pool({
    connectionString: DB_URL,
});

export default db
