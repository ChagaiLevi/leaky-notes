# Leaky Notes: A Deliberately Vulnerable Web App

> WARNING: This application is intentionally insecure.
> Run it on localhost only. Never deploy it to a public server.

## 1. Goal
The goal of this project is to create a small application containing vulnerabilities that need to be exploited.
We are building it to practice exploiting vulnerabilities and hacking into the application.

## 2. Safety rules
- Run the app on localhost only. Never expose it to a network or deploy it to a public server or cloud.
- Never enter real data. Enter only dummy data.
- Publish only the code and the write-up—never a live instance that is running and accessible to others.

## 3. Tech stack
| Layer    | Tech                         | Why                                                                      |
| -------- | ---------------------------- | ------------------------------------------------------------------------ |
| Frontend | React + TypeScript (Vite)    | My main stack. Needed to plant client-side XSS (Reflected, Stored, DOM). |
| Backend  | Node.js + Express (TS)       | I'm familiar with that.                                                  |
| Database | SQLite                       | Because it's just a single file and doesn't require a full database.     |
| Auth     | JWT (stored in localStorage) | Intentionally in Local Storage rather than cookies.                      |

## 4. MVP features
- Login / Register
- Adding a note or post
- Private dashboard (/profile/:id): shows the user's private notes and email
- Search for a post
- A tag-based note view that reads the tag from the URL hash.
- Public post view page (/posts/:id) that displays a note's content to any viewer

## 5. Vulnerability registry
| #   | Vulnerability           | Location                                                           | Root cause                                                                                                            | PoC         | Impact                                                                                                                                       | Fix                                                                                                          |
| --- | ----------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Stored XSS              | Note view page                                                     | Note body is rendered with `dangerouslySetInnerHTML`                                                                  | TBD (Day 4) | Attacker's script runs in every viewer's browser and can steal their JWT from localStorage                                                   | Render note body as plain JSX text; if HTML is needed, sanitize it with DOMPurify                            |
| 2   | SQL Injection           | Login / Register                                                   | When combining the username and password, it uses string concatenation                                                | TBD (Day 3) | Bypass authentication and log in as any user without knowing the password; potentially read other tables                                     | Switch to using parameterized queries.                                                                       |
| 3   | Reflected XSS           | Search results page — server returns the query in its response     | The server reflects the search term into its response, and the frontend renders it as raw HTML instead of escaping it | TBD (Day 4) | An attacker can execute a script from a remote location—in other words, a malicious link.                                                    | Rendering as text (escaping) and HTML — DOMPurify.                                                           |
| 4   | DOM-based XSS           | Tag view page — reads the tag from the URL hash (`/notes#tag=...`) | Reads `location.hash` (source) and injects it via `dangerouslySetInnerHTML` (sink) without sanitizing                 | TBD (Day 4) | An attacker crafts a malicious hash link; when the victim opens it, JavaScript runs in their browser and can steal the JWT from localStorage | Render the value as text instead of injecting it into the sink; sanitize with DOMPurify if HTML is required  |
| 5   | IDOR                    | In the private Dashboard ("/profile/:id")                          | There is no check to verify whether the user is the owner of the account they are attempting to access.               | TBD (Day 4) | An attacker can access the personal information of other accounts. For example: phone numbers, email addresses.                              | Create an authorization check to determine if the user can access the account information.                   |
| 6   | JWT `alg: none` (bonus) | On token verification                                              | The server accepts a token even without any signature (alg="none").                                                   | TBD         | The attacker can access any account, including the admin account.                                                                            | Have the server enforce the signature—blocking requests if the signature is missing—and use a strong secret. |

## 6. Out of scope
- Post comments. 
- Hearts. 
- Like notifications. 
- Followers, and more...