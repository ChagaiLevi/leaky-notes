import cors from "cors";
import express from "express";
import "./database.js";

const app = express();
const host = "127.0.0.1";
const port = 3001;

app.use(cors({ origin: "http://127.0.0.1:5173" }));
app.use(express.json());

app.post("/api/login", (_request, _response) => {
  // TODO: Implement the login exercise.
});

app.get("/api/products", (_request, _response) => {
  // TODO: Implement the product search exercise.
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
