# 🛡️ PoC Findings Template — Penetration Test
 
> A template for documenting security findings at professional report quality.
> **How to use:** Fill in "Engagement Details" once, then duplicate the **"Finding Template"** block for each vulnerability you find.
> Golden rule: **document as you go, not at the end.** Every working payload + screenshot goes into the doc immediately.
 
---
 
## 📋 Engagement Details
 
| Field           | Value                                                    |
| --------------- | -------------------------------------------------------- |
| **Project**     | Leaky-Notes                                              |
| **Tester**      | Chagai                                                   |
| **Date**        | 2026/09/29                                               |
| **Test Type**   | White-box (source code access)                           |
| **Scope**       | One in login page (for now)                              |
| **Environment** | App running locally at `http://localhost:5173` (Kali VM) |
| **Tools**       | Burp Suite Community, sqlmap, Browser                    |
 
---
 
## 📊 Findings Summary
 
| ID   | Title                             | Severity            | Status  |
| ---- | --------------------------------- | ------------------- | ------- |
| F-01 | Blind SQL Injection in Login page | High                | Open    |
| <!-- | F-02                              | _(another finding)_ | _(...)_ | _(...)_ | --> |
 
---
 
# 🔻 Finding Template (duplicate per vulnerability)
 
## [F-XX] Short, clear finding title
 
| Field          | Details                                                |
| -------------- | ------------------------------------------------------ |
| **Severity**   | Critical / High / Medium / Low                         |
| **CVSS Score** | _(e.g. 8.1)_ — *optional*                              |
| **Category**   | OWASP Top 10 — A03: Injection · CWE-89 (SQL Injection) |
| **Status**     | Open / Fixed / Accepted Risk                           |
 
### 🎯 Location
- **Affected endpoint:** `METHOD /path` _(e.g. `POST /api/login`)_
- **Vulnerable parameter:** `<param>` _(location: query string / body / header / cookie)_
### 📝 Description
_(In your own words: what the vulnerability is and why it happens. E.g. "User input is concatenated directly into a SQL query without parameterization, allowing the query structure to be modified.")_
 
### 🔑 Preconditions
_(Is authentication required? Special privileges? If none, write "None — accessible to any user".)_
 
### 🔁 Steps to Reproduce
1. _(...)_
2. _(...)_
3. _(...)_
### 💉 Payload
```
<the-exact-payload-here>
```
 
### 👁️ Observed Result
_(What actually happened, including the observable signal. E.g. "A correct character guess returned `200 OK`; an incorrect guess returned `401`.")_
 
### 📸 Evidence
- `screenshot-01.png` — _(description: request and response)_
- `screenshot-02.png` — _(description: true/false comparison)_
> Tip: the most convincing evidence for blind SQLi is **two requests side by side** — one "true" response and one "false".
 
### 💥 Impact (CIA)
- **Confidentiality:** _(Is data leaked? Which?)_
- **Integrity:** _(Can data be modified/deleted?)_
- **Availability:** _(Can the service be disrupted/taken down?)_
### 🔧 Remediation
- **Primary fix:** use **Parameterized Queries / Prepared Statements** — input is sent separately from the query, so the DB always treats it as a *value*, never as *code*.
- **Defense in Depth:**
  - **Least Privilege** — grant the DB user only the permissions it actually needs.
  - **WAF** — request filtering as an extra safety net (not a replacement for the fix).
  - Server-side input validation.
### 🔗 References
- OWASP: https://owasp.org/Top10/A03_2021-Injection/
- CWE-89: https://cwe.mitre.org/data/definitions/89.html
---
---
 
# ✅ Worked Example — today's finding
 
## [F-01] Blind SQL Injection (Boolean-based) in an input parameter
 
| Field          | Details                       |
| -------------- | ----------------------------- |
| **Severity**   | High                          |
| **CVSS Score** | ~8.1 (estimate)               |
| **Category**   | OWASP A03: Injection · CWE-89 |
| **Status**     | Open                          |
 
### 🎯 Location
- **Affected endpoint:** `<METHOD /your-endpoint>` _(fill in from your app)_
- **Vulnerable parameter:** `<param>` _(fill in)_
### 📝 Description
User input is concatenated into a server-side SQL query (SQLite) without parameterization. The server does not return the query's contents in the response, but responds differently to true vs. false conditions — allowing data to be extracted indirectly (**Blind SQLi**).
 
### 🔑 Preconditions
_(Fill in — e.g. None, unauthenticated / requires a logged-in user.)_
 
### 🔁 Steps to Reproduce
1. Intercept the request to `<endpoint>` in Burp and send it to Repeater.
2. Inject a payload with a true condition → response `200`.
3. Inject a payload with a false condition → response `401`.
4. Change the guessed letter/character position and re-run → extract the password character by character.
### 💉 Payload
```
' AND <single-char-check-of-password> -- 
```
_(Fill in the exact character check you used — including SQLite's string-slicing function.)_
 
### 👁️ Observed Result
A correct character guess → `200 OK`. An incorrect guess → `401`. The status-code difference is the channel through which the password is read, even though it is never printed in the response body.
 
### 📸 Evidence
- `f01-true-200.png` — request with a correct guess (200)
- `f01-false-401.png` — request with an incorrect guess (401)
### 💥 Impact (CIA)
- **Confidentiality:** High — passwords/sensitive data can be extracted character by character.
- **Integrity:** Depends on DB privileges — potential to modify/delete data.
- **Availability:** Possible disruption via heavy queries.
### 🔧 Remediation
Parameterized Queries / Prepared Statements as the primary fix; plus Least Privilege for the DB user and a WAF as defense in depth.
 
### 🔗 References
- OWASP A03: https://owasp.org/Top10/A03_2021-Injection/
- CWE-89: https://cwe.mitre.org/data/definitions/89.html
---
 
## 📎 Appendix — Quick Severity Guide
 
| Severity     | When                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| **Critical** | Easy to exploit + full impact (RCE, full takeover, whole-DB leak without auth) |
| **High**     | Leak/modification of sensitive data, authentication bypass                     |
| **Medium**   | Limited impact or requires certain conditions                                  |
| **Low**      | Minor impact / non-sensitive information                                       |
 
> **CVSS** (Common Vulnerability Scoring System) is an industry standard for scoring severity (0–10). Official calculator: https://www.first.org/cvss/calculator/3.1
 