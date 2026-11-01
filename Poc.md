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

| ID   | Title             | Severity                     | Status                       |
| ---- | ----------------- | ---------------------------- | ---------------------------- |
| F-01 | _(finding title)_ | _(Critical/High/Medium/Low)_ | _(Open/Fixed/Accepted Risk)_ |
| F-02 | _(...)_           | _(...)_                      | _(...)_                      |

---
---

<!-- ## 🔻 Finding Block (duplicate per vulnerability) -->

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
- **Availability:** Yes, because he can also log in as the 'admin' user.

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
---

## 📎 Appendix — Severity Quick Guide

| Severity     | When                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| **Critical** | Easy to exploit + full impact (RCE, full takeover, whole-DB leak, no auth) |
| **High**     | Sensitive data leak/modification, authentication bypass                    |
| **Medium**   | Limited impact, or requires certain conditions                             |
| **Low**      | Minor impact / non-sensitive information                                   |

> **CVSS** — industry-standard severity score (0–10). Calculator: https://www.first.org/cvss/calculator/3.1