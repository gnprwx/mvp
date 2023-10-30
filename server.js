import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import BadWordsNext from "bad-words-next";
import en from "bad-words-next/data/en.json" assert { type: "json" };

dotenv.config();

const { DATABASE_URL, PORT } = process.env;
const app = express();
const client = new pg.Client({
    connectionString: DATABASE_URL,
});
const badWords = new BadWordsNext({ data: en });

await client.connect();

app.use(express.static("public"));
app.use(express.json());

app.get("/nmb", getAllPosts);
app.post("/nmb", submitPost);
app.delete("/nmb/:id", deletePost);
app.patch("/nmb/:id", patchPost);

async function getAllPosts(_, res, next) {
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
            [currentUser, badWords.filter(message)]
        );
        res.sendStatus(202);
    } catch (err) {
        next(err);
    }
}

async function deletePost(req, res, next) {
    try {
        await client.query(`DELETE FROM posts WHERE id=$1`, [req.params.id]);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}

async function patchPost(req, res, next) {
    try {
        await client.query(`UPDATE posts SET message = $1 WHERE id=$2`, [
            badWords.filter(req.body.message),
            req.params.id,
        ]);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}

app.use("/", (req, res) => {
    res.sendStatus(404);
});

app.use((err, _, res, next) => {
    console.error(err);
    res.sendStatus("500");
    next();
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
