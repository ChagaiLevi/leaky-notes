# Leaky Notes local security lab

This repository is a deliberately incomplete learning scaffold. It is intended
to run only on your local machine. The route handlers and frontend actions are
left as TODOs so you can add the vulnerable and secure implementations by hand.

## Requirements

- Node.js 22 or newer (Node 24 is selected by the included `.nvmrc`)
- npm

## Install and run

If you use nvm, select the project runtime first:

```powershell
nvm use
```

Open a terminal for the backend:

```powershell
cd backend
npm install
npm run seed
npm run dev
```

Open a second terminal for the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open sqlite3 tool:

```bash
cd backend/data
sqlite3 leaky-notes.db
SELECT id, name, body FROM comments WHERE name = 'attacker'
```

Then open <http://127.0.0.1:5173>. The API listens only on
<http://127.0.0.1:3001>.

Run `npm run seed` again whenever you want to replace the database with its
original dummy users and products.

## Intentionally unfinished

- `POST /api/login`
- `GET /api/products?q=...`
- `GET /api/comments`
- `POST /api/comments`
- All frontend request, response, and display logic

The seed creates only the requested `users` and `products` tables. Add any
comments schema yourself when you implement that exercise.

Do not deploy or expose this application to a network. Use only dummy data.
