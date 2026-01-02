import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});
pool.on("connect", () => {
    console.log("Connection pool establish with databse");
});
export default pool;
