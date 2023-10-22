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
        .query("SELECT * FROM posts ORDER BY id DESC LIMIT 100")
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.error(err);
        });
});

app.post("/cbbs", (req, res) => {
    const { currentUser, message } = req.body;
    client
        .query(
            `INSERT INTO posts (username, message, created_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)`,
            [currentUser, message]
        )
        .then((data) => {
            return res.sendStatus(202);
        })
        .catch((err) => {
            console.error(err);
        });
});

app.delete("/cbbs/:id", (req, res) => {
    const index = req.params.id;
    client
        .query(`DELETE FROM posts WHERE id=$1`, [index])
        .then((data) => {
            res.sendStatus(204);
        })
        .catch((err) => {
            console.error(err);
        });
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
