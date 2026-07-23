/* MHI World Quest v41.1 - Status Ready Fix */
(function () {
  "use strict";

  const APP_VERSION = "41.1-STATUS-READY-FIX";
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
    return "https://script.google.com/macros/s/AKfycbxr-K44uUgTsP3IgDArgknk0ryIxTy5H6aas3x4qKT0zH9Igy4sf_-QcG7iqm9J2Sl62g/exec";
  }

  function api(action, data = {}) {
    return new Promise((resolve, reject) => {
      const callbackName =
        "mhi_cb_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);

      const payload = encodeURIComponent(JSON.stringify({ action, ...data }));
      const src =
        apiUrl() +
        "?callback=" +
        callbackName +
        "&payload=" +
        payload +
        "&t=" +
        Date.now();

      const script = document.createElement("script");

      const timer = setTimeout(() => {
        cleanup();
        reject(
          new Error(
            "Apps Script did not respond. Check the /exec URL and deployment permissions."
          )
        );
      }, 20000);

      function cleanup() {
        clearTimeout(timer);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = (response) => {
        cleanup();

        if (!response) {
          reject(new Error("No response from Apps Script."));
          return;
        }

        if (response.ok === false) {
          reject(new Error(response.message || "Request failed."));
          return;
        }

        resolve(response);
      };

      script.onerror = () => {
        cleanup();
        reject(
          new Error(
            "Could not load Apps Script response. Make sure deployment access is allowed."
          )
        );
      };

      script.src = src;
      document.body.appendChild(script);
    });
  }

  async function checkConnection() {
    const statusEl = $("connectionStatus");

    try {
      let res;

      try {
        res = await api("health");
      } catch (healthErr) {
        res = await api("status");
      }

      const scriptStatus =
        res.version ||
        res.backendVersion ||
        res.apiVersion ||
        res.status ||
        "ready";

      if (
        res.status === "ready" ||
        res.status === "ok" ||
        res.ready === true ||
        res.version ||
        res.backendVersion ||
        res.apiVersion
      ) {
        if (statusEl) {
          statusEl.textContent =
            "Connected to Apps Script. Status " +
            scriptStatus +
            ". Website v" +
            APP_VERSION +
            ".";
          statusEl.className = "status good";
        }
        return true;
      }

      if (statusEl) {
        statusEl.textContent =
          "Connected to Apps Script. Response received. Website v" +
          APP_VERSION +
          ".";
        statusEl.className = "status good";
      }

      return true;
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = "Not connected: " + apiUrl();
        statusEl.className = "status bad";
      }

      console.error("Connection error:", err);
      return false;
    }
  }

  async function refreshLeaderboard() {
    try {
      const res = await api("getLeaderboard");
      const rows = res.leaderboard || [];
      const body = $("leaderboardBody");

      if (!body) return;

      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="4">No scores yet.</td></tr>';
        return;
      }

      body.innerHTML = rows
        .map(
          (r, i) =>
            `<tr>
              <td>${i + 1}</td>
              <td>${escapeHtml(r.name)}</td>
              <td>${escapeHtml(r.score)}</td>
              <td>${escapeHtml(r.week || "")}</td>
            </tr>`
        )
        .join("");
    } catch (err) {
      setText("playerMessage", err.message);
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(
      /[&<>'"]/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        }[ch])
    );
  }

  async function loadActiveGame() {
    const nameEl = $("playerName");
    const name = nameEl ? nameEl.value.trim() : "";

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

      currentGame =
        GAME_BANK.weeks[selectedWeek] || GAME_BANK.weeks.week1;

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

    setText(
      "progressText",
      `Question ${currentQuestionIndex + 1} of ${questions.length}`
    );
    setText("questionText", item.q);

    const wrap = $("choicesWrap");
    if (!wrap) return;

    wrap.innerHTML = "";

    item.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.type = "button";
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
    const nameEl = $("playerName");
    const name = nameEl ? nameEl.value.trim() : "";

    setText("questionText", "Game complete!");

    const choicesWrap = $("choicesWrap");
    if (choicesWrap) choicesWrap.innerHTML = "";

    setText("progressText", "Final score: " + currentScore);

    try {
      await api("submitScore", {
        name,
        score: currentScore,
        week: selectedWeek,
        roundType: selectedRoundType
      });

      setText("scoreText", "Score submitted.");
      await refreshLeaderboard();
    } catch (err) {
      setText("scoreText", "Could not submit score: " + err.message);
    }
  }

  async function adminLogin() {
    try {
      const pinEl = $("adminPin");
      await api("adminLogin", { pin: pinEl ? pinEl.value : "" });

      show("adminPanel", true);
      setText("adminMessage", "Admin unlocked.");
    } catch (err) {
      setText("adminMessage", err.message);
    }
  }

  async function ownerLogin() {
    try {
      const pinEl = $("ownerPin");
      await api("ownerLogin", { pin: pinEl ? pinEl.value : "" });

      show("ownerPanel", true);
      setText("ownerMessage", "Owner unlocked.");
    } catch (err) {
      setText("ownerMessage", err.message);
    }
  }

  async function runAdminAction(action, messageTarget, extra = {}) {
    try {
      const adminPin = $("adminPin") ? $("adminPin").value : "";
      const ownerPin = $("ownerPin") ? $("ownerPin").value : "";
      const week = $("weekSelect") ? $("weekSelect").value : "week1";
      const roundType = $("roundType") ? $("roundType").value : "main";

      const res = await api(action, {
        pin: adminPin || ownerPin,
        week,
        roundType,
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

    bind("setWeekGameBtn", () =>
      runAdminAction("setWeekGame", "adminMessage")
    );

    bind("openRoundBtn", () =>
      runAdminAction("openRound", "adminMessage")
    );

    bind("closeRoundBtn", () =>
      runAdminAction("closeRound", "adminMessage")
    );

    bind("clearCustomQuestionsBtn", () =>
      runAdminAction("clearCustomQuestions", "adminMessage")
    );

    bind("forceCloseAllRoundsBtn", () =>
      runAdminAction("forceCloseAllRounds", "ownerMessage")
    );

    bind("resetPlayerRoundBtn", () => {
      const name = $("resetPlayerName")
        ? $("resetPlayerName").value.trim()
        : "";

      runAdminAction("resetPlayerRound", "ownerMessage", { name });
    });

    bind("deletePlayerCompletelyBtn", () => {
      const name = $("resetPlayerName")
        ? $("resetPlayerName").value.trim()
        : "";

      runAdminAction("deletePlayerCompletely", "ownerMessage", { name });
    });

    bind("archiveResetLeaderboardBtn", () => {
      if (confirm("Archive active scores and reset the leaderboard?")) {
        runAdminAction("archiveResetLeaderboard", "ownerMessage");
      }
    });

    checkConnection();
    refreshLeaderboard();
  });
})();
