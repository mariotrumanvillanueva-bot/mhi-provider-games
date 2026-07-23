MHI WORLD QUEST v37 — DIRECT BUTTON FIX

This release removes the shared action router from the six problem buttons.
Each button now calls its own Apps Script server function directly.

FILES TO ADD/REPLACE IN ONE GOOGLE APPS SCRIPT PROJECT:
1. Code.gs
2. Index.html
3. Style.html
4. GameBankJS.html
5. GameJS.html

INSTALL:
1. Open the Google Sheet used by the game.
2. Extensions > Apps Script.
3. Replace Code.gs completely.
4. Replace the four HTML files completely.
5. Save all files.
6. Deploy > Manage deployments > Edit existing web app.
7. Select New version and click Deploy.
8. Open the same /exec URL and hard refresh.

Expected connection message:
Connected to Apps Script version 37.0-DIRECT-BUTTON-FIX.
