import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataDirectory = fileURLToPath(new URL("../data/", import.meta.url));
const databasePath = path.join(dataDirectory, "leaky-notes.db");

mkdirSync(dataDirectory, { recursive: true });

export const db = new Database(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL
  );
`);
