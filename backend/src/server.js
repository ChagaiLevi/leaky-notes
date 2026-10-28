import cors from "cors";
import express, { request, response } from "express";
import "./database.js";
import { db } from "./database.js";
import crypto from "node:crypto";
import cookieParser from "cookie-parser";

const app = express();
const host = "127.0.0.1";
const port = 3001;
export const isConnecting = false;

app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.post("/api/login", (_request, _response) => {
  let username = _request.headers.username;
  let password = _request.headers.password;

  const SQLRequest = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  const user = db.prepare(SQLRequest).get();

  if (user) {
    const sessionId = crypto.randomBytes(32).toString("hex");
    const userId = user.id;
    db.prepare("INSERT INTO sessions (session_id, user_id) VALUES (?, ?)").run(sessionId, userId);

    _response.cookie("session", sessionId, {
      httpOnly: true,
      sameSite: "strict",
    });

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
  // const sessionUser = _request.cookies.session;
  const session = db.prepare("SELECT id FROM sessions WHERE username = ?").get(_request.cookies.session);



  if (user && session) {
    _response.json(user);
  }
  else if (user) {
    _response.status(403).json();
  }
  else {
    _response.status(404).json();
  }
});

app.get("/api/me/", (_request, _response) => {
  const sessionId = _request.cookies.session;

  if (!sessionId) {
    _response.status(401).json();
  }
  else {
    const session = db.prepare("SELECT user_id FROM sessions WHERE session_id = ?").get(sessionId);

    if (!session) {
      _response.status(401).json();
      return;
    }

    const user = db.prepare("SELECT id, username FROM users WHERE id = ?").get(session.user_id);

    _response.json({
      user
    });
  }


});

app.get("/api/logout", (_request, _response) => {
  db.prepare("DELETE FROM sessions WHERE session_id = ?;").get(_request.cookies.session).run();
  _response.cookie("session", "", {
    httpOnly: true,
    sameSite: "strict",
  });
  _response.redirect("http://127.0.0.1:5173/login");
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
