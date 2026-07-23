/* MHI World Quest v40 - Fresh GitHub frontend */
(function () {
  "use strict";

  const APP_VERSION = "40.0-FROM-SCRATCH";
  let currentGame = null;
  let currentQuestionIndex = 0;
  let currentScore = 0;
  let selectedWeek = "week1";
  let selectedRoundType = "main";

  const $ = (id) => document.getElementById(id);

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text || "";
  }

  function show(id, shouldShow) {
    const el = $(id);
    if (el) el.classList.toggle("hidden", !shouldShow);
  }

  function apiUrl() {
    const url = window.MHI_CONFIG && window.MHI_CONFIG.API_URL;
    if (!url || url.includes("PASTE_YOUR")) {
      throw new Error("Paste your Apps Script /exec URL into config.js first.");
    }
    return url;
  }

  // JSONP keeps GitHub Pages and Apps Script from fighting CORS.
  function api(action, data = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = "mhi_cb_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
      const payload = encodeURIComponent(JSON.stringify({ action, ...data }));
      const src = apiUrl() + "?callback=" + callbackName + "&payload=" + payload + "&t=" + Date.now();
      const script = document.createElement("script");
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Apps Script did not respond. Check the /exec URL and deployment permissions."));
      }, 20000);

      function cleanup() {
        clearTimeout(timer);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = (response) => {
        cleanup();
        if (!response || response.ok === false) {
          reject(new Error((response && response.message) || "Request failed."));
        } else {
          resolve(response);
        }
      };

      script.onerror = () => {
        cleanup();
        reject(new Error("Could not load Apps Script response. Make sure deployment access is allowed."));
      };
      script.src = src;
      document.body.appendChild(script);
    });
  }

  async function checkConnection() {
    try {
      const res = await api("health");
      setText("connectionStatus", "Connected to Apps Script version " + (res.version || "unknown") + ". Website v" + APP_VERSION + ".");
    } catch (err) {
      setText("connectionStatus", "Not connected: " + err.message);
    }
  }

  async function refreshLeaderboard() {
    try {
      const res = await api("getLeaderboard");
      const rows = res.leaderboard || [];
      const body = $("leaderboardBody");
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="4">No scores yet.</td></tr>';
        return;
      }
      body.innerHTML = rows.map((r, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(r.name)}</td><td>${r.score}</td><td>${escapeHtml(r.week || "")}</td></tr>`).join("");
    } catch (err) {
      setText("playerMessage", err.message);
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
  }

  async function loadActiveGame() {
    const name = $("playerName").value.trim();
    if (!name) {
      setText("playerMessage", "Enter your name first.");
      return;
    }
    try {
      const settings = await api("getSettings");
      if (!settings.roundOpen) {
        setText("playerMessage", "The round is currently closed.");
        return;
      }
      selectedWeek = settings.activeWeek || "week1";
      selectedRoundType = settings.roundType || "main";
      currentGame = GAME_BANK.weeks[selectedWeek] || GAME_BANK.weeks.week1;
      currentQuestionIndex = 0;
      currentScore = 0;
      show("gameCard", true);
      setText("gameTitle", currentGame.title + " - " + selectedRoundType);
      setText("playerMessage", "Game loaded. Good luck!");
      renderQuestion();
    } catch (err) {
      setText("playerMessage", err.message);
    }
  }

  function renderQuestion() {
    if (!currentGame) return;
    const questions = currentGame.questions || [];
    if (currentQuestionIndex >= questions.length) {
      finishGame();
      return;
    }
    const item = questions[currentQuestionIndex];
    setText("progressText", `Question ${currentQuestionIndex + 1} of ${questions.length}`);
    setText("questionText", item.q);
    const wrap = $("choicesWrap");
    wrap.innerHTML = "";
    item.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.textContent = choice;
      btn.addEventListener("click", () => chooseAnswer(choice));
      wrap.appendChild(btn);
    });
    setText("scoreText", "Current score: " + currentScore);
  }

  function chooseAnswer(choice) {
    const item = currentGame.questions[currentQuestionIndex];
    if (choice === item.answer) currentScore += 10;
    currentQuestionIndex += 1;
    renderQuestion();
  }

  async function finishGame() {
    const name = $("playerName").value.trim();
    setText("questionText", "Game complete!");
    $("choicesWrap").innerHTML = "";
    setText("progressText", "Final score: " + currentScore);
    try {
      await api("submitScore", { name, score: currentScore, week: selectedWeek, roundType: selectedRoundType });
      setText("scoreText", "Score submitted.");
      await refreshLeaderboard();
    } catch (err) {
      setText("scoreText", "Could not submit score: " + err.message);
    }
  }

  async function adminLogin() {
    try {
      await api("adminLogin", { pin: $("adminPin").value });
      show("adminPanel", true);
      setText("adminMessage", "Admin unlocked.");
    } catch (err) {
      setText("adminMessage", err.message);
    }
  }

  async function ownerLogin() {
    try {
      await api("ownerLogin", { pin: $("ownerPin").value });
      show("ownerPanel", true);
      setText("ownerMessage", "Owner unlocked.");
    } catch (err) {
      setText("ownerMessage", err.message);
    }
  }

  async function runAdminAction(action, messageTarget, extra = {}) {
    try {
      const res = await api(action, {
        pin: $("adminPin").value || $("ownerPin").value,
        week: $("weekSelect").value,
        roundType: $("roundType").value,
        ...extra
      });
      setText(messageTarget, res.message || "Done.");
      await checkConnection();
      await refreshLeaderboard();
    } catch (err) {
      setText(messageTarget, err.message);
    }
  }

  function bind(id, fn) {
    const el = $(id);
    if (el) el.addEventListener("click", fn);
  }

  document.addEventListener("DOMContentLoaded", () => {
    bind("loadGameBtn", loadActiveGame);
    bind("refreshLeaderboardBtn", refreshLeaderboard);
    bind("adminLoginBtn", adminLogin);
    bind("ownerLoginBtn", ownerLogin);

    bind("setWeekGameBtn", () => runAdminAction("setWeekGame", "adminMessage"));
    bind("openRoundBtn", () => runAdminAction("openRound", "adminMessage"));
    bind("closeRoundBtn", () => runAdminAction("closeRound", "adminMessage"));
    bind("clearCustomQuestionsBtn", () => runAdminAction("clearCustomQuestions", "adminMessage"));

    bind("forceCloseAllRoundsBtn", () => runAdminAction("forceCloseAllRounds", "ownerMessage"));
    bind("resetPlayerRoundBtn", () => runAdminAction("resetPlayerRound", "ownerMessage", { name: $("resetPlayerName").value.trim() }));
    bind("deletePlayerCompletelyBtn", () => runAdminAction("deletePlayerCompletely", "ownerMessage", { name: $("resetPlayerName").value.trim() }));
    bind("archiveResetLeaderboardBtn", () => {
      if (confirm("Archive active scores and reset the leaderboard?")) runAdminAction("archiveResetLeaderboard", "ownerMessage");
    });

    checkConnection();
    refreshLeaderboard();
  });
})();
