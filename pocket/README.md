# Pocket

Mobile-first money splitter. Add income, divide it into jars (Commitment, Food, Saving, Fun, or your own), then spend only from each jar so you don’t overspend.

## Use on your phone

1. Open the `pocket` folder on any static host, or run locally:
   ```bash
   cd pocket && python3 -m http.server 4173
   ```
2. Visit the page on your phone (same Wi‑Fi / tunnel).
3. In Safari or Chrome: **Add to Home Screen**.
4. Pocket installs like an app and works offline after the first load.

Data stays on your device (`localStorage`). Nothing is uploaded.

## What you can do

- **Add income** → lands in “Ready to place”
- **Split now** → move amounts into jars, apply your **% plan**, or split evenly
- **Tap a jar** → log spends (blocked if the jar is empty or the amount is too high)
- **Settings** → currency symbol + paycheck split percentages
- **Overview** → see money in jars and your total so every peso has a place

## Default jars & plan

| Jar | Share of income |
| --- | --- |
| Commitment | 40% |
| Food | 30% |
| Saving | 20% |
| Fun | 10% |

Change these anytime in Settings so payday always funds the right jars.
