# Presentation Outline — Pocket

NWC4343 · Session 0826  
Suggested length: 8–12 minutes + questions

## Slide list

1. **Title** — Pocket, NWC4343 / 0826, group names
2. **Problem** — One bank balance. Easy to overspend rent or food money.
3. **Idea** — Envelope / jar method on a phone.
4. **Objectives** — Split income, block overspend, work offline.
5. **Users and use cases** — Payday, groceries, move leftover, monthly check.
6. **Design** — PWA, localStorage, views diagram.
7. **Default plan** — 40 / 30 / 20 / 10
8. **Live demo** — follow the script below
9. **Testing** — overspend blocked, transfer, backup
10. **Limitations** — no bank sync, one device
11. **Future work** — monthly caps, login backup
12. **Q&A**

## Live demo script (about 3 minutes)

1. Reset (or incognito) so the screen is empty.
2. Add income **5000** — “Payday”.
3. Split now → **Apply my % plan** → Confirm. Point at 2000 / 1500 / 1000 / 500.
4. Open Food. Try **2000**. Show the red guard and disabled button.
5. Spend **200** — Groceries. Food becomes 1300.
6. **Move money** 100 to Saving.
7. Open **This month** and **See all**.
8. Optional: Settings → Export data.

Speak in simple English. One person drives the phone; another narrates.

## Questions you should be ready for

- Why not use a bank app? — Banks show one balance; Pocket enforces a split.
- Why not a database? — Single user, offline demo; JSON in localStorage is enough.
- What if two people share a budget? — Out of scope; would need accounts.
- What if the user clears the browser? — Export JSON; import later.
- How do percentages that do not add to 100 work? — Leftover stays in Ready to place.
