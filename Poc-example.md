# 🛡️ PoC Template — Penetration Test Findings

> A reusable blank template. Fill "Engagement Details" once, then duplicate the Finding block for each vulnerability you find.
> **Golden rule:** document as you go, not at the end. Every working payload + screenshot goes into the doc immediately.

---

## 📋 Engagement Details

| Field           | Value                                           |
| --------------- | ----------------------------------------------- |
| **Project**     | _(project name)_                                |
| **Tester**      | _(your name)_                                   |
| **Date**        | _(YYYY/MM/DD)_                                  |
| **Test Type**   | _(White-box / Black-box / Grey-box)_            |
| **Scope**       | _(what's in scope — endpoints / pages)_         |
| **Environment** | _(where the app runs, e.g. localhost + VM/WSL)_ |
| **Tools**       | _(Burp Suite, sqlmap, Browser DevTools, ...)_   |

---

## 📊 Findings Summary

| ID   | Title             | Severity                     | Status                       |
| ---- | ----------------- | ---------------------------- | ---------------------------- |
| F-01 | _(finding title)_ | _(Critical/High/Medium/Low)_ | _(Open/Fixed/Accepted Risk)_ |
| F-02 | _(...)_           | _(...)_                      | _(...)_                      |

---
---

## 🔻 Finding Block (duplicate per vulnerability)

### [F-XX] Short, clear finding title

| Field          | Details                                      |
| -------------- | -------------------------------------------- |
| **Severity**   | Critical / High / Medium / Low               |
| **CVSS Score** | _(e.g. 8.1 — optional)_                      |
| **Category**   | OWASP Top 10 — _(A0X: ...)_ · CWE-_(number)_ |
| **Status**     | Open / Fixed / Accepted Risk                 |

### 🎯 Location
- **Affected endpoint:** `METHOD /path` _(e.g. `GET /api/users/:id`)_
- **Vulnerable parameter:** `<param>` _(location: query / body / header / cookie / path)_

### 📝 Description
_(In your own words: what the vulnerability is and why it exists. Name the misplaced trust — what the server/code assumes, and what the attacker can do instead.)_

### 🔑 Preconditions
_(Authentication required? Special privileges? If none — "None — accessible to any user".)_

### 🔁 Steps to Reproduce
1. _(...)_
2. _(...)_
3. _(...)_

### 💉 Payload
```
<the-exact-payload-here>
```

### 👁️ Observed Result
_(What actually happened, including the observable signal. E.g. "Received another user's private_note", or "Correct guess → 200, incorrect → 401".)_

### 📸 Evidence
- `screenshot-01.png` — _(description: request and response)_
- `screenshot-02.png` — _(description: two-state comparison / before-after)_

### 💥 Impact (CIA)
- **Confidentiality:** _(Is data leaked? Which?)_
- **Integrity:** _(Can data be modified/deleted?)_
- **Availability:** _(Can the service be disrupted/taken down?)_

### 🔧 Remediation
- **Primary fix:** _(the main fix — in your own words.)_
- **Defense in Depth:** _(extra layers: least privilege, server-side validation, etc.)_

### 🔗 References
- OWASP: _(link)_
- CWE: _(link)_

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