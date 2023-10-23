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

app.get("/cbbs", getAllPosts);
app.post("/cbbs", submitPost);
app.delete("/cbbs/:id", deletePost);

async function getAllPosts(req, res, next) {
    try {
        const posts = await client.query(
            "SELECT * FROM posts ORDER BY id DESC LIMIT 100"
        );
        res.json(posts.rows);
    } catch (err) {
        next(err);
    }
}

async function submitPost(req, res, next) {
    try {
        const { currentUser, message } = req.body;
        await client.query(
            `INSERT INTO posts (username, message, created_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)`,
            [currentUser, message]
        );
        res.sendStatus(202);
    } catch (err) {
        next(err);
    }
}

async function deletePost(req, res, next) {
    try {
        const index = req.params.id;
        await client.query(`DELETE FROM posts WHERE id=$1`, [index]);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus("500");
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
