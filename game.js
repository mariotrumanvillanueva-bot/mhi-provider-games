/* MHI World Quest v42 - Fresh frontend with resume, lockout, merge support */
(function () {
  'use strict';

  var APP_VERSION = '42.2-NEW-URL-FIX';
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby58uN2dk_Nl6kpsWG6pb-QrVRAKPWw9sfMceJjxcPxpPQqq_FZx7i1UEF9oQQYszNyGA/exec';

  var currentGame = null;
  var currentPlayer = '';
  var currentWeek = 'week1';
  var currentRoundType = 'main';
  var currentQuestionIndex = 0;
  var currentScore = 0;
  var isWaiting = false;

  function $(id) { return document.getElementById(id); }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text || '';
  }

  function htmlEscape(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function show(id, yes) {
    var el = $(id);
    if (el) el.classList.toggle('hidden', !yes);
  }

  function setConnection(text, mode) {
    var el = $('connectionStatus');
    if (!el) return;
    el.textContent = text;
    el.className = 'status-bar ' + (mode || '');
  }

  function setButtonLock(locked) {
    isWaiting = locked;
    var buttons = document.querySelectorAll('button');
    buttons.forEach(function (b) { b.disabled = locked; });
  }

  function api(action, data) {
    data = data || {};
    return new Promise(function (resolve, reject) {
      var callbackName = 'mhi_v42_cb_' + Date.now() + '_' + Math.floor(Math.random() * 999999);
      var payload = encodeURIComponent(JSON.stringify(Object.assign({}, data, { action: action })));
      var url = APPS_SCRIPT_URL + '?callback=' + encodeURIComponent(callbackName) + '&payload=' + payload + '&_=' + Date.now();
      var script = document.createElement('script');
      var done = false;

      var timer = setTimeout(function () {
        cleanup();
        reject(new Error('Apps Script did not respond. Open the /exec URL directly and confirm it says status ready.'));
      }, 25000);

      function cleanup() {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { delete window[callbackName]; } catch (err) { window[callbackName] = undefined; }
        if (script && script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = function (response) {
        cleanup();
        if (!response) return reject(new Error('Empty response from Apps Script.'));
        if (response.ok === false) return reject(new Error(response.message || 'Request failed.'));
        resolve(response);
      };

      script.onerror = function () {
        cleanup();
        reject(new Error('Could not load Apps Script response. Check deployment access and that the /exec URL is current.'));
      };

      script.src = url;
      document.body.appendChild(script);
    });
  }

  async function checkConnection() {
    try {
      var res = await api('health');
      var version = res.version || res.backendVersion || res.apiVersion || res.status || 'ready';
      if (res.status === 'ready' || res.status === 'ok' || res.ok === true || res.ready === true || res.version) {
        setConnection('Connected to Apps Script version ' + version + '. Website v' + APP_VERSION + '.', 'good');
      } else {
        setConnection('Connected to Apps Script. Website v' + APP_VERSION + '.', 'good');
      }
      return true;
    } catch (err) {
      setConnection('Not connected: ' + err.message, 'bad');
      return false;
    }
  }

  async function refreshLeaderboard() {
    try {
      var res = await api('getLeaderboard');
      var rows = res.leaderboard || [];
      var body = $('leaderboardBody');
      if (!body) return;
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="5">No scores yet.</td></tr>';
        return;
      }
      body.innerHTML = rows.map(function (r, i) {
        return '<tr><td>' + (i + 1) + '</td><td>' + htmlEscape(r.name) + '</td><td>' + htmlEscape(r.score) + '</td><td>' + htmlEscape(r.week) + '</td><td>' + htmlEscape(r.roundType) + '</td></tr>';
      }).join('');
    } catch (err) {
      setText('playerMessage', err.message);
    }
  }

  async function startOrResumeGame() {
    if (isWaiting) return;
    var name = ($('playerName') && $('playerName').value || '').trim();
    if (!name) {
      setText('playerMessage', 'Enter your name first.');
      return;
    }

    setButtonLock(true);
    setText('playerMessage', 'Checking your game status...');
    setText('duplicateNote', '');
    show('duplicateNote', false);

    try {
      var res = await api('startOrResumeGame', { name: name });
      currentPlayer = res.name || name;
      currentWeek = res.week || 'week1';
      currentRoundType = res.roundType || 'main';
      currentQuestionIndex = Number(res.questionIndex || 0);
      currentScore = Number(res.score || 0);
      currentGame = GAME_BANK.weeks[currentWeek] || GAME_BANK.weeks.week1;

      if (res.duplicateNote) {
        setText('duplicateNote', res.duplicateNote);
        show('duplicateNote', true);
      }

      if (res.completed) {
        show('gameCard', false);
        setText('playerMessage', res.message || 'You already finished this round and cannot replay it.');
        await refreshLeaderboard();
        return;
      }

      show('gameCard', true);
      setText('gameTitle', currentGame.title + ' — ' + prettyRound(currentRoundType));
      setText('gameStyle', currentGame.style || '');
      setText('playerMessage', res.message || 'Game loaded.');
      renderQuestion();
    } catch (err) {
      setText('playerMessage', err.message);
    } finally {
      setButtonLock(false);
    }
  }

  function prettyRound(value) {
    if (value === 'redemption') return 'Make-Up / Redemption';
    if (value === 'final') return 'Final Tournament';
    return 'Main Round';
  }

  function renderQuestion() {
    if (!currentGame) return;
    var questions = currentGame.questions || [];
    if (currentQuestionIndex >= questions.length) {
      finishGame();
      return;
    }
    var item = questions[currentQuestionIndex];
    setText('progressText', 'Question ' + (currentQuestionIndex + 1) + ' of ' + questions.length + ' • ' + prettyRound(currentRoundType));
    setText('questionText', item.q);
    setText('scorePill', 'Score: ' + currentScore);
    setText('answerFeedback', '');

    var wrap = $('choicesWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    item.choices.forEach(function (choice) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice';
      btn.textContent = choice;
      btn.addEventListener('click', function () { chooseAnswer(choice, btn); });
      wrap.appendChild(btn);
    });
  }

  async function chooseAnswer(choice, button) {
    if (isWaiting) return;
    var item = currentGame.questions[currentQuestionIndex];
    var correct = choice === item.answer;
    var nextIndex = currentQuestionIndex + 1;
    var nextScore = currentScore + (correct ? 10 : 0);

    var choices = document.querySelectorAll('.choice');
    choices.forEach(function (b) {
      b.disabled = true;
      if (b.textContent === item.answer) b.classList.add('correct');
    });
    if (!correct && button) button.classList.add('wrong');
    setText('answerFeedback', correct ? 'Correct!' : 'Not quite. Correct answer: ' + item.answer);

    try {
      await api('saveProgress', {
        name: currentPlayer,
        week: currentWeek,
        roundType: currentRoundType,
        questionIndex: nextIndex,
        score: nextScore,
        totalQuestions: (currentGame.questions || []).length,
        answer: choice,
        correctAnswer: item.answer,
        isCorrect: correct
      });
      currentQuestionIndex = nextIndex;
      currentScore = nextScore;
      setText('scorePill', 'Score: ' + currentScore);
      setTimeout(renderQuestion, 650);
    } catch (err) {
      setText('answerFeedback', 'Could not save progress: ' + err.message);
      choices.forEach(function (b) { b.disabled = false; });
    }
  }

  async function finishGame() {
    if (!currentGame) return;
    var total = (currentGame.questions || []).length;
    setText('questionText', 'Game complete!');
    var wrap = $('choicesWrap');
    if (wrap) wrap.innerHTML = '';
    setText('progressText', 'Final score: ' + currentScore + ' out of ' + (total * 10));
    setText('scorePill', 'Score: ' + currentScore);
    try {
      var res = await api('finishGame', {
        name: currentPlayer,
        week: currentWeek,
        roundType: currentRoundType,
        score: currentScore,
        totalQuestions: total
      });
      setText('answerFeedback', res.message || 'Score submitted. You cannot replay this round unless an owner resets you.');
      await refreshLeaderboard();
    } catch (err) {
      setText('answerFeedback', 'Could not submit final score: ' + err.message);
    }
  }

  async function adminLogin() {
    try {
      var res = await api('adminLogin', { pin: ($('adminPin') && $('adminPin').value) || '' });
      show('adminPanel', true);
      setText('adminMessage', res.message || 'Admin unlocked.');
    } catch (err) {
      setText('adminMessage', err.message);
    }
  }

  async function ownerLogin() {
    try {
      var res = await api('ownerLogin', { pin: ($('ownerPin') && $('ownerPin').value) || '' });
      show('ownerPanel', true);
      setText('ownerMessage', res.message || 'Owner unlocked.');
    } catch (err) {
      setText('ownerMessage', err.message);
    }
  }

  async function adminAction(action, target, extra) {
    try {
      var res = await api(action, Object.assign({
        pin: (($('ownerPin') && $('ownerPin').value) || ($('adminPin') && $('adminPin').value) || ''),
        adminPin: ($('adminPin') && $('adminPin').value) || '',
        ownerPin: ($('ownerPin') && $('ownerPin').value) || '',
        week: ($('weekSelect') && $('weekSelect').value) || 'week1',
        roundType: ($('roundType') && $('roundType').value) || 'main'
      }, extra || {}));
      setText(target, res.message || 'Done.');
      await checkConnection();
      await refreshLeaderboard();
    } catch (err) {
      setText(target, err.message);
    }
  }

  function bind(id, fn) {
    var el = $(id);
    if (el) el.addEventListener('click', fn);
  }

  document.addEventListener('DOMContentLoaded', function () {
    bind('loadGameBtn', startOrResumeGame);
    bind('refreshLeaderboardBtn', refreshLeaderboard);
    bind('adminLoginBtn', adminLogin);
    bind('ownerLoginBtn', ownerLogin);

    bind('setWeekGameBtn', function () { adminAction('setWeekGame', 'adminMessage'); });
    bind('openRoundBtn', function () { adminAction('openRound', 'adminMessage'); });
    bind('closeRoundBtn', function () { adminAction('closeRound', 'adminMessage'); });
    bind('clearCustomQuestionsBtn', function () { adminAction('clearCustomQuestions', 'adminMessage'); });

    bind('forceCloseAllRoundsBtn', function () { adminAction('forceCloseAllRounds', 'ownerMessage'); });
    bind('resetPlayerRoundBtn', function () {
      adminAction('resetPlayerRound', 'ownerMessage', { name: (($('resetPlayerName') && $('resetPlayerName').value) || '').trim() });
    });
    bind('deletePlayerCompletelyBtn', function () {
      var name = (($('resetPlayerName') && $('resetPlayerName').value) || '').trim();
      if (name && confirm('Delete all records for ' + name + '?')) adminAction('deletePlayerCompletely', 'ownerMessage', { name: name });
    });
    bind('mergeUsersBtn', function () {
      adminAction('mergeUsers', 'ownerMessage', {
        fromName: (($('mergeFromName') && $('mergeFromName').value) || '').trim(),
        toName: (($('mergeToName') && $('mergeToName').value) || '').trim()
      });
    });
    bind('archiveResetLeaderboardBtn', function () {
      if (confirm('Archive scores and reset active leaderboard/progress?')) adminAction('archiveResetLeaderboard', 'ownerMessage');
    });

    checkConnection();
    refreshLeaderboard();
  });
})();
