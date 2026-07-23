MHI WORLD QUEST v32 — SINGLE APPS SCRIPT RELEASE

This version removes GitHub/config.js entirely. The webpage and backend live in the SAME Apps Script deployment, so the portal cannot point to an older backend URL.

ADD THESE 5 FILES TO ONE GOOGLE APPS SCRIPT PROJECT ATTACHED TO THE GAME SPREADSHEET:
1. Code.gs              (Script file)
2. Index.html           (HTML file)
3. Style.html           (HTML file)
4. GameBankJS.html      (HTML file)
5. GameJS.html          (HTML file)

IMPORTANT:
- Delete or replace the old Code.gs content.
- File names must match exactly, including capitalization.
- Deploy as Web app.
- Execute as: Me
- Who has access: Anyone (or your organization, if all players are signed in)
- Open the NEW web app /exec URL. This version does not use the GitHub Pages URL.

BUTTON ACTIONS ROUTED DIRECTLY IN THIS RELEASE:
- Close Round -> setReleaseStatus
- Clear Custom Questions -> clearCustomQuestions
- Force Close All Rounds -> forceCloseAllRounds
- Reset Player Round -> ownerResetPlayerRound
- Archive + Reset Leaderboard -> ownerArchiveResetLeaderboard
- Delete Player Completely -> ownerDeletePlayer

Backend version: 32.0-single-appscript
