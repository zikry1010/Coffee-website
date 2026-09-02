# NWC4343 Group Project (0826) — Pocket

**Course:** NWC4343  
**Session:** 0826  
**Title:** Pocket — Mobile Income Management System

Pocket is a phone-first Progressive Web App that helps a user split income into named jars (Commitment, Food, Saving, Fun, or custom) and spend only from those jars so money is not overspent.

The working application lives in [`pocket/`](pocket/). Academic documents for submission are in [`docs/`](docs/).

## How to run

```bash
cd pocket
python3 -m http.server 4173
```

Then open `http://localhost:4173` on a phone or in a mobile viewport. In Safari or Chrome use **Add to Home Screen** to install it like an app. It works offline after the first visit. All data stays in `localStorage` on the device.

## Deliverables

| Item | Location |
| --- | --- |
| Working mobile system | [`pocket/`](pocket/) |
| Project report (Word-ready) | [`docs/PROJECT_REPORT.md`](docs/PROJECT_REPORT.md) |
| Printable report | [`docs/report.html`](docs/report.html) |
| User manual | [`docs/USER_MANUAL.md`](docs/USER_MANUAL.md) |
| Test plan | [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) |
| Presentation outline | [`docs/PRESENTATION_OUTLINE.md`](docs/PRESENTATION_OUTLINE.md) |
| Group workload sheet | [`docs/GROUP_WORKLOAD.md`](docs/GROUP_WORKLOAD.md) |

Fill in group member names, student IDs, and lecturer details in the documents before you submit.

## What the system does

1. Add income → it sits in **Ready to place**
2. Split into jars using a **% paycheck plan**, even split, or typed amounts
3. Log spends from a jar — blocked if the jar is empty or the amount is too high
4. Move leftover money between jars
5. Review this month’s income, spends, and balances
6. Export / import a JSON backup for the report appendix

Default plan: **40% Commitment · 30% Food · 20% Saving · 10% Fun**. Change it in Settings.

This repository also contains an older PHP coffee-shop site on the root. That site is **not** the NWC4343 deliverable.
