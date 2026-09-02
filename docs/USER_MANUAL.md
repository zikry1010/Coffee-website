# Pocket User Manual

NWC4343 Group Project · Session 0826

## 1. What Pocket is

Pocket is a phone app that splits your income into jars so you do not spend rent money on food, or food money on fun. It runs in the browser and can sit on your home screen like a normal app.

## 2. Install

### On a computer (for marking / demo)

1. Open a terminal in the project folder.
2. Run:

   ```bash
   cd pocket
   python3 -m http.server 4173
   ```

3. Open `http://localhost:4173`.
4. In Chrome DevTools, toggle the device toolbar (phone size) for the intended layout.

### On a phone

1. Open the same URL on the phone (same Wi‑Fi) or host the `pocket` folder on any static HTTPS site.
2. Safari (iPhone): Share → **Add to Home Screen**.
3. Chrome (Android): menu → **Install app** or **Add to Home Screen**.
4. After the first visit, Pocket still opens without a network.

## 3. Everyday use

### Add income

1. Tap **Add income**.
2. Type the amount (example: `2000`).
3. Optional note: `August salary`.
4. Tap **Add to Pocket**.

The money sits in **Ready to place**. It is not in a jar yet.

### Split into jars

1. Tap **Split now** (enabled only when the pool is above zero).
2. Choose one:
   - **Apply my % plan** — uses Settings percentages.
   - **Split evenly** — same amount in every jar.
   - Type your own amounts.
3. Check **Still to place**. It must not go negative.
4. Tap **Confirm split**.

### Spend from a jar

1. Tap a jar (for example Food).
2. Tap **Log spend**.
3. Type the amount. The green/red message tells you if it is allowed.
4. **Record spend** stays disabled if the jar is empty or the amount is too high.
5. Optional note: `Groceries`.

### Move money between jars

1. Open the source jar.
2. Tap **Move money**.
3. Pick the destination jar and amount.
4. Confirm. Pocket blocks a move that is larger than the source balance.

### This month

On the home screen tap **This month** to see income in, spent, money in jars, and ready-to-place for the current calendar month.

### History

Tap **See all**. Filter by All, Income, Splits, Spends, or Moves.

## 4. Settings

| Setting | Meaning |
| --- | --- |
| Currency symbol | Default `RM`. You can use `$`, `₱`, etc. (up to 3 characters). |
| Split plan (%) | Share of each paycheck per jar. Total cannot exceed 100%. |
| Export data | Downloads a JSON backup. |
| Import | Restores a previous backup (replaces current data). |
| Reset all data | Erases everything on this phone after you confirm. |

## 5. Jars

- **+ New jar** — name and colour. New jars start at 0% in the plan until you edit Settings.
- **Edit jar** — rename or recolour.
- **Delete jar** — only if the balance is 0. Move or spend the money first.

Default jars: Commitment 40%, Food 30%, Saving 20%, Fun 10%.

## 6. Tips for a live demo

1. Reset data (or use a fresh browser profile).
2. Add income `5000`, note `Payday`.
3. Apply % plan and confirm.
4. Open Food and try spend `2000` — it must fail.
5. Spend `200` for groceries — Food should show `1300`.
6. Move `100` from Food to Saving.
7. Open **This month** and **See all**.

## 7. Troubleshooting

| Symptom | What to try |
| --- | --- |
| Split now is grey | Add income first. |
| Record spend is grey | Amount is 0, empty jar, or amount is too high. |
| Plan will not save | Percentages add up to more than 100. |
| Old screen after an update | Hard-refresh or clear site data (export first). |
| Data disappeared | That browser profile was cleared. Import your JSON backup. |
