import cors from "cors";
import express, { request, response } from "express";
import "./database.js";
import { db } from "./database.js";

const app = express();
const host = "127.0.0.1";
const port = 3001;
export const isConnecting = false;

app.use(cors({ origin: "http://127.0.0.1:5173" }));
app.use(express.json());

app.post("/api/login", (_request, _response) => {

  // TODO: Implement the login exercise.
  let username = _request.headers.username;
  let password = _request.headers.password;

  const SQLRequest = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  const user = db.prepare(SQLRequest).get();

  if (user) {
    _response.json({
      username,
      password,
      'success': true
    });
  }
  else {
    _response.status(401).json();
  }
});

app.get("/api/users/:id", (_request, _response) => {
  const id = _request.params.id;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

  if (user) {
    _response.json(user);
  }
  else {
    _response.status(404).json();
  }
});

app.get("/api/products", (_request, _response) => {
  const term = typeof _request.query.search === "string" ? _request.query.search : "";
  const results = term
    ? db.prepare("SELECT * FROM products WHERE name LIKE ?").all(`%${term}%`)
    : db.prepare("SELECT * FROM products").all();

  _response.json({ results });
});

app.get("/api/comments", (_request, _response) => {
  const SQLRequest = `SELECT * FROM comments`;

  const results = db.prepare(SQLRequest).all();

  _response.json({ results });
});

app.post("/api/comments", (_request, _response) => {
  const addComment = _request.body.addComment;

  if (addComment) {
    const name = addComment.name;
    const body = addComment.body;

    const result = db.prepare(`INSERT INTO comments (name, body) VALUES (?, ?)`).run(name, body);

    _response.json({
      result,
      'success': true
    });
  }
  else {
    _response.status(401).json();
  }
});

app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});
