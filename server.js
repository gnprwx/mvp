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
        .query("SELECT * FROM posts ORDER BY id DESC")
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.error(err);
        });
});

app.post("/cbbs", (req, res) => {
    const { user, message } = req.body;
    client.query(
        `INSERT INTO posts (username, message, created_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)`,
        [user, message]
    );
    res.sendStatus(201);
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
