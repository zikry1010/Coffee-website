# Test Plan — Pocket

NWC4343 Group Project · Session 0826  
Type: black-box / functional  
Environment: Chrome mobile viewport (390×844) and a phone browser

Use a fresh profile or **Reset all data** before the suite.

## Test cases

| ID | Title | Steps | Expected |
| --- | --- | --- | --- |
| TC01 | Add income | Add 5000, note Payday | Ready to place = RM5,000. Recent shows Income added. Split now enabled. |
| TC02 | Apply % plan | Split now → Apply my % plan → Confirm | Commitment 2000, Food 1500, Saving 1000, Fun 500. Pool = 0. |
| TC03 | Overspend blocked | Food → Log spend → 2000 | Guard is red. Record spend disabled. Balance stays 1500. |
| TC04 | Valid spend | Food → Log spend → 200, note Groceries | Food = 1300. Activity shows spend. |
| TC05 | Empty-jar block | Create jar Bills (0). Open it. | Log spend disabled. Status “Empty — stop spending”. |
| TC06 | Transfer | Food → Move money → Saving, 100 | Food 1200, Saving 1100. History type Moves shows Food → Saving. |
| TC07 | Transfer too much | Food → Move → 99999 | Guard red. Move disabled. |
| TC08 | Even split | Reset. Income 100. Split evenly. Confirm. | Four jars get 25 each. |
| TC09 | Split more than pool | Income 50. Type 40 + 20 | Still to place goes negative. Confirm shows toast and does not apply. |
| TC10 | Plan over 100% | Settings: 50 + 50 + 20 | Total warn. Save rejected. |
| TC11 | Plan 100% | Settings default 40/30/20/10 | Total green. Save succeeds. |
| TC12 | Custom jar | + New jar Transport | Appears on home at RM0. Plan % 0 until edited. |
| TC13 | Delete with balance | Try delete Food while it has money | Toast: move or spend first. Jar remains. |
| TC14 | History filters | See all → Spends | Only spend rows. |
| TC15 | Monthly report | This month after TC01–TC04 | Income 5000, Spent 200, In jars > 0. |
| TC16 | Export | Settings → Export data | JSON file downloads. |
| TC17 | Import | Reset, then Import that file | Jars and activity restored. |
| TC18 | Currency | Settings symbol `$` | Home amounts use `$`. |
| TC19 | Offline | After first load, disable network, reload | App shell still opens. |
| TC20 | Install metadata | Open manifest / Add to Home Screen | Name Pocket, theme #1a3a32. |

## Result sheet (fill during demo)

| ID | Pass / Fail | Tester | Date | Notes |
| --- | --- | --- | --- | --- |
| TC01 | | | | |
| TC02 | | | | |
| TC03 | | | | |
| TC04 | | | | |
| TC05 | | | | |
| TC06 | | | | |
| TC07 | | | | |
| TC08 | | | | |
| TC09 | | | | |
| TC10 | | | | |
| TC11 | | | | |
| TC12 | | | | |
| TC13 | | | | |
| TC14 | | | | |
| TC15 | | | | |
| TC16 | | | | |
| TC17 | | | | |
| TC18 | | | | |
| TC19 | | | | |
| TC20 | | | | |
