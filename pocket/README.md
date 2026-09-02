# Pocket

NWC4343 Group Project (0826) — mobile income splitter.

Add income, divide it into jars (Commitment, Food, Saving, Fun, or your own), then spend only from each jar so you do not overspend. Move leftover money between jars and check this month’s totals.

## Use on your phone

```bash
cd pocket && python3 -m http.server 4173
```

1. Open the page on your phone (same Wi‑Fi) or a static host.
2. In Safari or Chrome: **Add to Home Screen**.
3. Pocket installs like an app and works offline after the first load.

Data stays on the device (`localStorage`). Export a JSON backup from Settings if you need it for the report appendix.

## What you can do

- **Add income** → lands in Ready to place
- **Split now** → % plan, even split, or typed amounts
- **Tap a jar** → log spends (blocked if empty or too high) or **Move money**
- **This month** → income, spent, and balances
- **See all** → filter activity
- **Settings** → currency (default RM), paycheck %, export/import, reset

## Default jars & plan

| Jar | Share of income |
| --- | --- |
| Commitment | 40% |
| Food | 30% |
| Saving | 20% |
| Fun | 10% |

Course documents: see [`docs/`](../docs/) in the repository root.
