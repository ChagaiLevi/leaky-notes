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
      'succes': true
    });
  }
  else {
    _response.status(401).json();
  }

  return _response;
});

app.get("/api/products", (_request, _response) => {
  // TODO: Implement the product search exercise
});

app.get("/api/comments", (_request, _response) => {
  // TODO: Implement the comments-list exercise.
});

app.post("/api/comments", (_request, _response) => {
  // TODO: Implement the comment-submission exercise.
});

app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});
