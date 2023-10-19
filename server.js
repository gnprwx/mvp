import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_URL, PORT } = process.env;
const app = express();
const client = new pg.Client({
    connectionString: DATABASE_URL,
});

await client.connect();

app.use(express.static("public"));
app.use(express.json());

app.get("/cbbs", (req, res) => {
    client
        .query("SELECT * FROM posts ORDER BY created_at DESC")
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.error(err);
        });
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
