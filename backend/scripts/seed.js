import { db } from "../src/database.js";

db.exec(`
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS comments;

  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
  );

  CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    body TEXT
  );

  INSERT INTO users (id, username, password) VALUES
    (1, 'admin', 'dummy-admin-password'),
    (2, 'alice', 'dummy-alice-password'),
    (3, 'bob', 'dummy-bob-password');

  INSERT INTO products (id, name, description) VALUES
    (1, 'Notebook', 'A plain paper notebook for lab notes.'),
    (2, 'Mechanical Keyboard', 'A compact keyboard with clicky keys.'),
    (3, 'USB Lamp', 'A small adjustable desk lamp.'),
    (4, 'Practice Lock', 'A transparent lock made for learning.'),
    (5, 'Sticker Pack', 'Assorted fictional security-lab stickers.');

  INSERT INTO comments (name, body) VALUES
    ('Maya', 'This is a friendly practice comment.'),
    ('Noah', 'The local lab is ready for testing.');
`);

db.close();

console.log("Seeded data/leaky-notes.db with dummy users, products, and comments.");
