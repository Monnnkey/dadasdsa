const db = require("./db");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/register", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) return res.sendStatus(400);

    try {
        const hash = await bcrypt.hash(password, 10);
        db.prepare("INSERT INTO users(username, password) VALUES(?, ?)").run(login, hash);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/login", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) return res.sendStatus(400);

    console
    try {
        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(login);
        console.log("znaleziony użytkownik:", user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.sendStatus(401);
        }
        console.log(user.username);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post("/todos", (req, res) => {
    const { user, description } = req.body;

    if (!user || !description) return res.sendStatus(400);

    try {
        const u = db.prepare("SELECT id FROM users WHERE username = ?").get(user);
        if (!u) return res.sendStatus(401);

        const result = db.prepare("INSERT INTO todos(user_id, description) VALUES(?, ?)").run(u.id, description);
        res.json({ id: result.lastInsertRowid });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get("/todos", (req, res) => {
    const { user } = req.query;

    if (!user) return res.sendStatus(400);

    try {
        const u = db.prepare("SELECT id FROM users WHERE username = ?").get(user);
        if (!u) return res.sendStatus(401);

        const rows = db.prepare(
            "SELECT id, description AS text, completed AS done FROM todos WHERE user_id = ?"
        ).all(u.id);

        res.json(rows.map(r => ({ ...r, done: !!r.done })));
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.listen(8888, () => {
    console.log("Działa");
});