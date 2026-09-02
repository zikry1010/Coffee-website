# Pocket: A Mobile Income Management System

**NWC4343 Group Project · Session 0826**

| Field | Value |
| --- | --- |
| Course | NWC4343 |
| Session | 0826 |
| Project title | Pocket — Mobile Income Management System |
| System type | Progressive Web App (HTML, CSS, JavaScript) |
| Members | See `GROUP_WORKLOAD.md` |
| Lecturer | *[fill in]* |

---

## Abstract

Many people receive income as a single balance and then spend until the money is gone. Pocket is a mobile web application that forces a different habit: income is placed first, then split into jars (Commitment, Food, Saving, Fun, or user-defined), and spending is allowed only from a chosen jar. If a jar is empty or the amount is higher than the remaining balance, the spend is blocked. The system runs in the phone browser, can be installed to the home screen, and stores data only on the device. This report describes the problem, objectives, design, implementation, and testing of Pocket as the NWC4343 group project for session 0826.

## 1. Introduction

### 1.1 Background

Salary and side income usually arrive as one number in a bank account. Without a simple rule, food, bills, and leisure compete for the same cash. The envelope (or “jar”) method is a long-standing personal-finance practice: cash is divided into labelled envelopes, and you only spend what is in that envelope (Ramsey, 2013; Consumer Financial Protection Bureau, n.d.). Pocket applies that method on a phone so the user does not need physical envelopes or a spreadsheet.

### 1.2 Problem statement

The problem this project addresses is:

> How can a person on a phone separate incoming money into commitments, food, saving, and other uses, and be stopped from spending more than a given jar holds?

Existing banking apps show one account balance. They do not, by default, prevent a grocery spend from eating next month’s rent. Spreadsheet budgets work on a laptop but are slow on a phone and do not block a bad spend at the moment it is typed.

### 1.3 Objectives

1. Build a mobile-first system that records income and holds it in a “ready to place” pool.
2. Let the user split that pool into named jars using typed amounts, an even split, or a stored percentage plan.
3. Allow spending only from a selected jar, and reject spends that exceed the jar balance.
4. Support transfers between jars, a monthly summary, full activity history, and a JSON backup.
5. Package the system as an installable Progressive Web App that works offline after the first visit.

### 1.4 Scope

**In scope:** single-user phone use; local storage; income, split, spend, transfer, history, monthly report, backup, custom jars, currency symbol.

**Out of scope:** bank login, multi-user accounts, cloud sync, notifications, investment advice, and native App Store / Play Store packages. Those can be future work.

### 1.5 Report structure

Section 2 reviews related approaches. Section 3 states the methodology. Section 4 analyses requirements. Section 5 presents the design. Section 6 covers implementation. Section 7 reports testing. Section 8 concludes.

## 2. Related work

Three common approaches exist for this problem:

| Approach | Strength | Weakness for this user |
| --- | --- | --- |
| Single bank-app balance | Always up to date | No hard split; easy to overspend |
| Spreadsheet budget | Flexible percentages | Poor on a phone; no spend lock |
| Envelope / jar method | Clear limits per category | Paper envelopes are inconvenient |

Pocket takes the envelope method and implements it as a small PWA. Similar consumer apps (YNAB, Goodbudget) use the same idea with accounts and subscriptions. This project stays offline-first and small enough for a course prototype, while still enforcing the “do not overspend this jar” rule.

## 3. Methodology

The team used a short iterative (agile) cycle:

1. **Problem capture** — income must be separated; overspend must be blocked on the phone.
2. **Prototype** — static HTML/CSS/JS screens for home, income, split, and spend.
3. **Hardening** — percentage plan, live spend guard, empty-jar block.
4. **Extension** — transfers, history filters, monthly report, export/import.
5. **Documentation and test** — this report, user manual, and black-box test cases.

No server is required, so deployment is a static folder. That matches a mobile demo on any phone browser.

## 4. Requirements analysis

### 4.1 Functional requirements

| ID | Requirement |
| --- | --- |
| FR1 | User can add income with an amount and optional note. |
| FR2 | Income is added to an unallocated “ready to place” pool. |
| FR3 | User can split the pool into one or more jars. |
| FR4 | User can apply a stored percentage plan or an even split. |
| FR5 | User can log a spend from a jar. |
| FR6 | A spend larger than the jar balance is rejected and explained. |
| FR7 | Spending from an empty jar is disabled. |
| FR8 | User can create, rename, recolour, and delete empty jars. |
| FR9 | User can transfer money between jars if the source has enough. |
| FR10 | User can view recent and full activity, filtered by type. |
| FR11 | User can view a month summary (income, spent, balances). |
| FR12 | User can export and import a JSON backup. |
| FR13 | User can change the currency symbol and percentage plan. |

### 4.2 Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR1 | Layout targets a phone width (~360–430 px) with large tap targets. |
| NFR2 | First visit caches core files; later visits work offline. |
| NFR3 | Data remains on the device (`localStorage`). |
| NFR4 | Amounts are stored to two decimal places. |
| NFR5 | Interface language is simple English suitable for a demo. |

### 4.3 Use cases

1. **Add payday** — user enters RM 2,000; pool increases; activity shows “Income added”.
2. **Apply plan** — user opens Split, taps “Apply my % plan”, reviews, confirms.
3. **Blocked spend** — user tries to spend more than Food holds; Record spend stays disabled.
4. **Allowed spend** — user spends a valid amount; jar balance falls; activity records it.
5. **Move leftover** — user moves unused Food into Saving.
6. **Backup** — user exports JSON for the report appendix.

### 4.4 Use-case diagram (textual)

```
[User]
  |-- add income
  |-- split into jars
  |-- apply % plan / even split
  |-- log spend (guarded)
  |-- transfer between jars
  |-- manage jars
  |-- view history / monthly report
  |-- export or import backup
  |-- change settings
```

## 5. System design

### 5.1 Architecture

Pocket is a single-page application. `index.html` holds the screens (views). `css/styles.css` styles a phone column. `js/app.js` owns state, rendering, and validation. `sw.js` plus `manifest.json` make it installable and offline-capable.

```
Phone browser
    └── Pocket PWA
            ├── Views (home, income, split, jar, spend, transfer, history, report, settings)
            ├── State (currency, unallocated, jars[], activity[])
            └── localStorage key "pocket.v1"
```

### 5.2 Data model

```
State
  currency: string          // e.g. "RM"
  unallocated: number       // ready-to-place pool
  jars[]:
    id, name, color, balance, planPct
  activity[]:
    id, at, type, title, detail, amount, jarId?, toJarId?
```

Activity types: `income`, `allocate`, `spend`, `transfer`.

There is no entity-relationship database. Persistence is one JSON document. That is enough for a single-user prototype and keeps the demo runnable without MySQL or PHP.

### 5.3 Main flow

1. Income increases `unallocated`.
2. A confirmed split decreases `unallocated` and increases jar balances. The split total cannot exceed the pool.
3. A spend decreases one jar. If `amount > balance`, the action is blocked.
4. A transfer decreases one jar and increases another by the same amount.

### 5.4 Interface design

- Dark green and paper colours, large amounts, and 48 px buttons for thumbs.
- Home shows the pool, total on hand, jars with a share bar, and recent activity.
- Spend and transfer screens show a live guard message (available / too much / remaining after).
- Settings holds currency, the % plan (must not exceed 100%), backup, and reset.

### 5.5 Security and privacy

No passwords or bank tokens are stored. The only risk is local device access. Reset wipes the key after a confirm dialog. Import accepts only JSON that contains a `jars` array.

## 6. Implementation

### 6.1 Technology

| Layer | Choice | Reason |
| --- | --- | --- |
| Structure | HTML5 | One file, easy to host |
| Style | CSS3 | Phone-first, no framework lock-in |
| Logic | Vanilla JavaScript | No build step for the demo |
| Storage | `localStorage` | Offline, private |
| Install | Web App Manifest + Service Worker | Home-screen icon, cache |

### 6.2 Key modules in `app.js`

- `load` / `save` — hydrate and persist state, including `planPct` fallbacks.
- `money` — format with the user’s currency symbol.
- `applyPlanPercents` — floor most jar shares, give remainder to the last jar when the plan totals 100% so cents are not lost.
- `updateSpendGuard` / `updateTransferGuard` — disable the confirm button when the amount is invalid.
- `renderReport` — sums this calendar month’s income and spends.
- `exportData` / `importData` — JSON backup for marking and recovery.

### 6.3 Default paycheck plan

| Jar | Share |
| --- | --- |
| Commitment | 40% |
| Food | 30% |
| Saving | 20% |
| Fun | 10% |

The user can change these before payday. The plan is a suggestion until they tap Confirm split.

### 6.4 Example

Income RM 5,000 with the default plan:

| Jar | Amount |
| --- | --- |
| Commitment | RM 2,000 |
| Food | RM 1,500 |
| Saving | RM 1,000 |
| Fun | RM 500 |

A Food spend of RM 2,000 is blocked. A Food spend of RM 200 succeeds; Food becomes RM 1,300.

## 7. Testing

Black-box tests are listed in `TEST_PLAN.md`. Summary of results from the development build:

| Area | Result |
| --- | --- |
| Add income | Pool and activity update |
| % plan on RM 5,000 | 2000 / 1500 / 1000 / 500 |
| Overspend | Button disabled; warning shown |
| Valid spend | Balance reduced |
| Transfer | Source down, destination up |
| Empty jar | Log spend disabled |
| Plan over 100% | Save rejected |
| Export / import | State restored |
| Offline cache | App shell loads from service worker |

Limitations: `localStorage` is per browser profile. Clearing site data wipes the budget unless a backup was exported. The service worker cannot cache the Google Fonts CDN if the phone is offline on first visit; system fonts still render.

## 8. Conclusion and future work

Pocket meets the stated problem: income is separated on a phone, and overspending a jar is blocked. The prototype is small, installable, and documented for NWC4343 session 0826.

Possible extensions:

- Optional monthly cap per jar (budget, not only balance).
- Cloud backup with a student login.
- Recurring bills inside Commitment.
- Native wrapper (Capacitor / Flutter) if the course later requires a store build.

## References

Consumer Financial Protection Bureau. (n.d.). *Your money, your goals: Tools for the benefit of consumers*. https://www.consumerfinance.gov/

Ramsey, D. (2013). *The total money makeover*. Thomas Nelson.

Mozilla Developer Network. (n.d.). *Progressive web apps*. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

## Appendix A — How to run

See the root `README.md` or `USER_MANUAL.md`.

## Appendix B — Source files

| File | Role |
| --- | --- |
| `pocket/index.html` | Screens |
| `pocket/css/styles.css` | Layout and theme |
| `pocket/js/app.js` | Rules and state |
| `pocket/sw.js` | Offline cache |
| `pocket/manifest.json` | Install metadata |

## Appendix C — Sample backup

Use **Settings → Export data** and attach the downloaded JSON to the submission if the lecturer asks for evidence of test data.
