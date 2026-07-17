(() => {
let session=null,qIndex=0,score=0,correct=0,activeQuestions=[],activeGameDef=null,selectedChecks=new Set(),answerLocked=false,practiceMode=false;const $=id=>document.getElementById(id);
function shuffleArray(items){return [...items].sort(()=>Math.random()-0.5);}
function shuffledChoices(question){return question.a.map((text,index)=>({text,index})).sort(()=>Math.random()-0.5);}
function pointsForCorrect(){
  if(session && session.game==="World Quest Tie-Breaker") return SCORE_RULES.tieBreakerCorrectAnswer;
  if(session && session.week==="Final Kahoot") return SCORE_RULES.finalCorrectAnswer;
  return SCORE_RULES.correctAnswer;
}
function pointsForCompletion(){
  if(session && session.game==="World Quest Tie-Breaker") return SCORE_RULES.tieBreakerCompletion;
  if(session && session.week==="Final Kahoot") return SCORE_RULES.finalCompletion;
  return SCORE_RULES.completion;
}

async function api(action,payload={}){if(!API_URL||API_URL.includes("PASTE_"))throw new Error("API_URL is not set in config.js.");const res=await fetch(API_URL,{method:"POST",body:JSON.stringify({action,...payload})});return await res.json();}
async function getQuestionsForPlay(gameName,week,releaseType){const gameDef=GAME_BANK[gameName];let questions=filterQuestionsForWeek(gameDef,week,releaseType==="redemption");try{const custom=await api("getCustomQuestions",{game:gameName,week,releaseType});if(custom.ok&&custom.questions&&custom.questions.length){questions=custom.questions;}}catch(e){}return questions;}
async function joinGame(){const name=$("playerName").value.trim().replace(/\s+/g," ");const week=$("weekSelect").value;const round=$("roundSelect").value;if(!name)return alert("Enter your name first.");try{let result=await api("joinGame",{name,week,releaseType:round});if(result.requiresConfirmation || result.similarNameWarning){
  const proceed=confirm(result.message||"A similar name is already being used. Continue?");
  if(!proceed)return;
  const confirmResult=await api("joinGame",{name,week,releaseType:round,confirmOldTypo:true,similarNameConfirmation:true});
  if(!confirmResult.ok){alert(confirmResult.message||"You cannot join this round.");return;}
  result=confirmResult;
}
if(!result.ok){alert(result.message||"You cannot join this round.");return;}const gameName=result.game;const activeWeek=result.week||week;const activeRound=result.releaseType||round;session={name,week:activeWeek,game:gameName,releaseType:activeRound,redemption:activeRound==="redemption",playId:result.playId};$("weekSelect").value=activeWeek;$("roundSelect").value=activeRound;activeGameDef=GAME_BANK[gameName];activeQuestions=await getQuestionsForPlay(gameName,activeWeek,activeRound);if(!activeQuestions||activeQuestions.length===0){alert("This game has no questions for this round.");return;}if(result.resume){qIndex=Math.min(result.progress.qIndex||0,activeQuestions.length-1);score=result.progress.score||0;correct=result.progress.correct||0;}else{qIndex=0;score=0;correct=0;}$("entryPanel").classList.add("hidden");$("activeGamePanel").classList.remove("hidden");$("gameStatus").textContent=(result.statusText||"Open")+": "+gameName;$("winnerRule").textContent=activeGameDef.prizeEligible&&!session.redemption?"Top player + prize points":"Top player tracked, no prize points";renderQuestion();await refreshLeaderboard();}catch(e){alert(e.message);}}
function renderQuestion(){answerLocked=false;const q=activeQuestions[qIndex];$("questionText").textContent=q.q;$("answers").innerHTML="";$("matchingBox").innerHTML="";$("typedAnswerBox").classList.add("hidden");$("matchingBox").classList.add("hidden");$("nextBtn").disabled=true;selectedChecks=new Set();$("feedback").textContent="Current score: "+score;if(activeGameDef.type==="choice"){shuffledChoices(q).forEach((choice)=>{const btn=document.createElement("button");btn.type="button";btn.className="answer-btn";btn.textContent=choice.text;btn.addEventListener("click",()=>answerQuestion(choice.index===q.c,btn));$("answers").appendChild(btn);});}if(activeGameDef.type==="typed")$("typedAnswerBox").classList.remove("hidden");if(activeGameDef.type==="selectAll"){shuffledChoices(q).forEach((choice)=>{const btn=document.createElement("button");btn.type="button";btn.className="answer-btn";btn.textContent=choice.text;btn.addEventListener("click",()=>{if(selectedChecks.has(choice.index)){selectedChecks.delete(choice.index);btn.classList.remove("correct");}else{selectedChecks.add(choice.index);btn.classList.add("correct");}});$("answers").appendChild(btn);});const submit=document.createElement("button");submit.type="button";submit.textContent="Submit Selected Answers";submit.addEventListener("click",submitSelectAll);$("answers").appendChild(submit);}if(activeGameDef.type==="matching"){$("matchingBox").classList.remove("hidden");const right=q.pairs.map(p=>p[1]).sort(()=>Math.random()-.5);q.pairs.forEach(pair=>{const row=document.createElement("div");row.className="match-row";const left=document.createElement("strong");left.textContent=pair[0];const sel=document.createElement("select");sel.dataset.correct=pair[1];sel.innerHTML='<option value="">Choose match</option>'+right.map(r=>'<option value="'+r+'">'+r+'</option>').join("");row.appendChild(left);row.appendChild(sel);$("matchingBox").appendChild(row);});const submit=document.createElement("button");submit.type="button";submit.textContent="Submit Matching";submit.addEventListener("click",submitMatching);$("matchingBox").appendChild(submit);}}
function submitTyped(){const q=activeQuestions[qIndex];const guess=$("typedAnswer").value.trim().toLowerCase();if(!guess)return alert("Type an answer first.");answerQuestion(guess===q.answer.toLowerCase());$("typedAnswer").value="";}
function submitSelectAll(){const q=activeQuestions[qIndex];answerQuestion([...selectedChecks].sort().join(",")===[...q.c].sort().join(","));}
function submitMatching(){const selects=[...document.querySelectorAll("#matchingBox select")];answerQuestion(selects.every(sel=>sel.value&&sel.value===sel.dataset.correct));}
async function saveProgress(){if(!session)return;try{await api("saveProgress",{playId:session.playId,qIndex,score,correct});}catch(e){}}
function answerQuestion(isCorrect,clickedBtn){
if(answerLocked)return;
answerLocked=true;
[...document.querySelectorAll(".answer-btn")].forEach(btn=>btn.disabled=true);
[...document.querySelectorAll("#matchingBox select")].forEach(sel=>sel.disabled=true);
if($("typedAnswer"))$("typedAnswer").disabled=true;
if(clickedBtn)clickedBtn.classList.add(isCorrect?"correct":"wrong");
if(isCorrect){
  score += pointsForCorrect();
  correct++;
  $("feedback").textContent="Correct! Current score: "+score;
}
else $("feedback").textContent="Not quite. Current score: "+score;
$("nextBtn").disabled=true;
saveProgress();
setTimeout(()=>{nextQuestion();},900);
}
async function nextQuestion(){answerLocked=false;if($('typedAnswer'))$('typedAnswer').disabled=false;qIndex++;if(!practiceMode)await saveProgress();if(qIndex<activeQuestions.length)return renderQuestion();score += pointsForCompletion();try{if(practiceMode){$("questionText").textContent="Practice complete. Final practice score: "+score+". No leaderboard points were saved.";await api("logPracticeRun",{code:$("ownerCode").value,game:session.game,week:session.week,releaseType:session.releaseType,score,correct});}else{const result=await api("submitScore",{playId:session.playId,name:session.name,week:session.week,game:session.game,releaseType:session.releaseType,score,correct,answered:activeQuestions.length,prizeEligible:activeGameDef.prizeEligible&&!session.redemption,badge:BADGE_RULES[session.game]||'',difficulty:difficultyForWeek(session.week)});$("questionText").textContent=result.message||("Game complete. Final score: "+score);}$("answers").innerHTML="";$("typedAnswerBox").classList.add("hidden");$("matchingBox").classList.add("hidden");$("nextBtn").disabled=true;await refreshLeaderboard();}catch(e){alert(e.message);}}
function exitToEntry(){$("entryPanel").classList.remove("hidden");$("activeGamePanel").classList.add("hidden");saveProgress();}
async function refreshLeaderboard(){try{const result=await api("leaderboard",{});if(!result.ok)return;$("leaderboard").innerHTML="";result.leaderboard.forEach(row=>{const li=document.createElement("li");li.innerHTML="<strong>"+row.name+"</strong> — "+row.totalPoints+" pts<br><small>Prize points: "+row.prizePoints+" • Bonus: "+(row.bonusPoints||0)+" • Games: "+row.gamesPlayed+(row.badges?" • Badges: "+row.badges:"")+"</small>";$("leaderboard").appendChild(li);});}catch(e){$("leaderboard").innerHTML="<li>"+e.message+"</li>";}}
function downloadCSV(filename,rows){const csv=rows.map(r=>r.map(v=>'"'+String(v??"").replaceAll('"','""')+'"').join(",")).join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
function downloadExcelReport(filename,rows){
  const safe=(v)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  const html=`<html><head><meta charset="UTF-8"></head><body>
  <h2>MHI Provider Coordinator Leaderboard</h2>
  <p>Use the "External Bonus Points" tab in the backend Google Sheet to add bonus points. Refresh the leaderboard after editing.</p>
  <table border="1">${rows.map((r,i)=>"<tr>"+r.map(c=>i===0?"<th>"+safe(c)+"</th>":"<td>"+safe(c)+"</td>").join("")+"</tr>").join("")}</table>
  <br/>
  <h3>External Bonus Points Entry Template</h3>
  <table border="1">
  <tr><th>Date</th><th>Name</th><th>Normalized Name</th><th>Week</th><th>Bonus Type</th><th>Points</th><th>Reason</th><th>Added By</th><th>Notes</th></tr>
  <tr><td></td><td>Player Name</td><td>auto-filled in backend if blank</td><td>Week 1</td><td>Trivia Bonus</td><td>5</td><td>Example reason</td><td>Owner/Admin</td><td></td></tr>
  </table>
  </body></html>`;
  const blob=new Blob([html],{type:"application/vnd.ms-excel"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=filename;
  a.click();
  URL.revokeObjectURL(url);
}
async function exportLeaderboard(code,outputId){const result=await api("exportLeaderboard",{code});if(!result.ok){if(outputId)$(outputId).textContent=JSON.stringify(result,null,2);else alert(result.message||"Export denied.");return;}downloadExcelReport("mhi_provider_coordinators_leaderboard.xls",result.rows);if(outputId)$(outputId).textContent="Leaderboard exported.";}
async function adminLogin(){const result=await api("adminVerify",{code:$("adminCode").value});if(result.ok)$("adminPanel").classList.remove("hidden");else alert("Invalid admin code.");}
async function ownerLogin(){const result=await api("ownerVerify",{code:$("ownerCode").value});if(result.ok)$("ownerPanel").classList.remove("hidden");else alert("Invalid owner code.");}
async function setRelease(role,status){const code=role==="owner"?$("ownerCode").value:$("adminCode").value;const week=role==="owner"?$("ownerWeek").value:$("adminWeek").value;const releaseType=role==="owner"?$("ownerReleaseType").value:$("adminReleaseType").value;const result=await api("setReleaseStatus",{role,code,week,releaseType,status});$(role==="owner"?"ownerOutput":"adminOutput").textContent=JSON.stringify(result,null,2);await loadActiveDefault();}
async function setWeekGame(role){const code=role==="owner"?$("ownerCode").value:$("adminCode").value;const week=role==="owner"?$("ownerWeek").value:$("adminWeek").value;const game=role==="owner"?$("ownerGameChoice").value:$("adminGameChoice").value;const result=await api("setWeekGame",{role,code,week,game});$(role==="owner"?"ownerOutput":"adminOutput").textContent=JSON.stringify(result,null,2);await loadActiveDefault();}
async function fairPlayAudit(){const result=await api("fairPlayAudit",{code:$("adminCode").value});$("adminOutput").textContent=JSON.stringify(result,null,2);}
async function ownerAdjust(){const result=await api("ownerAdjust",{code:$("ownerCode").value,name:$("adjustName").value,points:Number($("adjustPoints").value),reason:$("adjustReason").value});$("ownerOutput").textContent=JSON.stringify(result,null,2);await refreshLeaderboard();}
async function ownerAction(action){const result=await api(action,{code:$("ownerCode").value});$("ownerOutput").textContent=JSON.stringify(result,null,2);}
async function setupBonusPointsSheet(role){const code=role==="owner"?$("ownerCode").value:$("adminCode").value;const result=await api("setupBonusPointsSheet",{code});$(role==="owner"?"ownerOutput":"adminOutput").textContent=JSON.stringify(result,null,2);await refreshLeaderboard();}
async function renamePlayer(role){const code=role==="owner"?$("ownerCode").value:$("adminCode").value;const oldName=role==="owner"?$("ownerOldName").value:$("adminOldName").value;const newName=role==="owner"?$("ownerNewName").value:$("adminNewName").value;const result=await api("renamePlayerTypo",{role,code,oldName,newName});$(role==="owner"?"ownerOutput":"adminOutput").textContent=JSON.stringify(result,null,2);await refreshLeaderboard();}
async function ownerResetPlayerRound(){const result=await api("ownerResetPlayerRound",{code:$("ownerCode").value,name:$("resetPlayerName").value,week:$("resetWeek").value,releaseType:$("resetReleaseType").value});$("ownerOutput").textContent=JSON.stringify(result,null,2);await refreshLeaderboard();}
async function ownerArchiveResetLeaderboard(){if(!confirm("Archive current completed plays and reset the visible leaderboard? This keeps history but clears current leaderboard scoring."))return;const result=await api("ownerArchiveResetLeaderboard",{code:$("ownerCode").value});$("ownerOutput").textContent=JSON.stringify(result,null,2);await refreshLeaderboard();}
async function ownerDeletePlayer(){const name=$("ownerDeletePlayerName").value;if(!name)return alert("Enter a player name to delete.");if(!confirm("Completely delete all records for "+name+"? This cannot be undone."))return;const result=await api("ownerDeletePlayer",{code:$("ownerCode").value,name});$("ownerOutput").textContent=JSON.stringify(result,null,2);await refreshLeaderboard();}


function applyActiveRoundLock(active){
  const hasActive=active && active.week;
  $("weekSelect").disabled=!!hasActive;
  $("roundSelect").disabled=!!hasActive;
}

async function loadActiveDefault(){
  try{
    const result=await api("getActiveProviderRound",{});
    const notice=$("activeDefaultNotice");
    if(result.ok && result.active && result.active.week){
      $("weekSelect").value=result.active.week;
      $("roundSelect").value=result.active.releaseType || "main";
      applyActiveRoundLock(result.active);
      if(notice){
        notice.textContent="Active open game: "+result.active.week+" • "+(result.active.game||"Selected game")+" • "+(result.active.releaseType==="redemption"?"Make-Up":"Main Weekly Game")+". Players can only play this active round.";
      }
    }else if(notice){applyActiveRoundLock(null);
      notice.textContent="No round is open yet. Admin/Owner must open a game before players can start.";
    }
  }catch(e){
    const notice=$("activeDefaultNotice");
    if(notice)notice.textContent="Unable to check active open game yet.";applyActiveRoundLock(null);
  }
}


async function startOwnerPractice(){const verify=await api("ownerVerify",{code:$("ownerCode").value});if(!verify.ok){alert("Invalid owner code.");return;}const active=await api("getActiveProviderRound",{});if(!active.ok||!active.active){alert("No active round is open to practice.");return;}practiceMode=true;const gameName=active.active.game;const activeWeek=active.active.week;const activeRound=active.active.releaseType;session={name:"OWNER PRACTICE",week:activeWeek,game:gameName,releaseType:activeRound,redemption:activeRound==="redemption",playId:"PRACTICE-"+Date.now()};activeGameDef=GAME_BANK[gameName];activeQuestions=await getQuestionsForPlay(gameName,activeWeek,activeRound);qIndex=0;score=0;correct=0;$("entryPanel").classList.add("hidden");$("activeGamePanel").classList.remove("hidden");$("gameStatus").textContent="OWNER PRACTICE: "+activeWeek+" • "+gameName+" • "+(activeRound==="redemption"?"Make-Up/Make-Up":"Main");$("winnerRule").textContent="Practice only. No leaderboard points saved.";renderQuestion();}
async function loadEditableQuestions(){const result=await api("getCustomQuestions",{code:$("ownerCode").value,week:$("editorWeek").value,releaseType:$("editorReleaseType").value,game:$("editorGame").value,includeDefault:true});$("ownerOutput").textContent=JSON.stringify(result,null,2);if(result.ok){$("questionEditorBox").value=JSON.stringify(result.questions||[],null,2);}}
async function saveEditableQuestions(){let questions;try{questions=JSON.parse($("questionEditorBox").value||"[]");}catch(e){alert("Question editor is not valid JSON.");return;}const result=await api("saveCustomQuestions",{code:$("ownerCode").value,week:$("editorWeek").value,releaseType:$("editorReleaseType").value,game:$("editorGame").value,questions});$("ownerOutput").textContent=JSON.stringify(result,null,2);}
async function clearEditableQuestions(){if(!confirm("Clear custom questions for this selected week/round/game and go back to default coded questions?"))return;const result=await api("clearCustomQuestions",{code:$("ownerCode").value,week:$("editorWeek").value,releaseType:$("editorReleaseType").value,game:$("editorGame").value});$("ownerOutput").textContent=JSON.stringify(result,null,2);if(result.ok)$("questionEditorBox").value="";}

function downloadJsonReport(filename,data){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
}
function downloadExcelRows(filename,title,rows){
  const safe=(v)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  const html=`<html><head><meta charset="UTF-8"></head><body><h2>${safe(title)}</h2><table border="1">${rows.map((r,i)=>"<tr>"+r.map(c=>i===0?"<th>"+safe(c)+"</th>":"<td>"+safe(c)+"</td>").join("")+"</tr>").join("")}</table></body></html>`;
  const blob=new Blob([html],{type:"application/vnd.ms-excel"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
}
async function exportAuditReport(code,outId){
  const result=await api("fullAuditReport",{code});$(outId).textContent=JSON.stringify(result,null,2);
  if(result.ok)downloadJsonReport("world_quest_audit_report.json",result);
}
async function exportBonusReport(code,outId){
  const result=await api("bonusPointReport",{code});$(outId).textContent=JSON.stringify(result,null,2);
  if(result.ok){const rows=[["Date","Name","Week","Bonus Type","Points","Reason","Added By","Notes"]];(result.rows||[]).forEach(r=>rows.push([r.date,r.name,r.week,r.bonusType,r.points,r.reason,r.addedBy,r.notes]));downloadExcelRows("world_quest_bonus_points_report.xls","World Quest Bonus Points Report",rows);}
}
async function exportMakeupReport(code,outId){
  const result=await api("makeupEligibilityReport",{code});$(outId).textContent=JSON.stringify(result,null,2);
  if(result.ok){const rows=[["Name","Week","Completed Main","Completed Make-Up","Eligible If Round Opens"]];(result.rows||[]).forEach(r=>rows.push([r.name,r.week,r.completedMain,r.completedMakeup,r.eligible]));downloadExcelRows("world_quest_makeup_eligibility.xls","World Quest Make-Up Eligibility Report",rows);}
}
async function activeRoundDashboard(){
  const result=await api("activeRoundDashboard",{code:$("ownerCode").value});$("ownerOutput").textContent=JSON.stringify(result,null,2);
}
async function forceCloseAllRounds(){
  if(!confirm("Force close all open rounds? This stops new joins and rejoining."))return;
  const result=await api("forceCloseAllRounds",{code:$("ownerCode").value});$("ownerOutput").textContent=JSON.stringify(result,null,2);await loadActiveDefault();
}

document.addEventListener("DOMContentLoaded",()=>{$("joinBtn").addEventListener("click",joinGame);$("submitTypedBtn").addEventListener("click",submitTyped);$("nextBtn").style.display="none";$("exitBtn").addEventListener("click",exitToEntry);$("refreshBtn").addEventListener("click",refreshLeaderboard);$("exportBtn").addEventListener("click",()=>exportLeaderboard($("exportCode").value));$("adminLoginBtn").addEventListener("click",adminLogin);$("ownerLoginBtn").addEventListener("click",ownerLogin);$("adminSetGameBtn").addEventListener("click",()=>setWeekGame("admin"));$("ownerSetGameBtn").addEventListener("click",()=>setWeekGame("owner"));$("adminOpenBtn").addEventListener("click",()=>setRelease("admin","Open"));$("adminCloseBtn").addEventListener("click",()=>setRelease("admin","Closed"));$("ownerOpenBtn").addEventListener("click",()=>setRelease("owner","Open"));$("ownerCloseBtn").addEventListener("click",()=>setRelease("owner","Closed"));$("ownerPracticeBtn").addEventListener("click",startOwnerPractice);$("ownerLoadQuestionsBtn").addEventListener("click",loadEditableQuestions);$("ownerSaveQuestionsBtn").addEventListener("click",saveEditableQuestions);$("ownerResetQuestionsBtn").addEventListener("click",clearEditableQuestions);$("adminAuditBtn").addEventListener("click",fairPlayAudit);$("adminExportBtn").addEventListener("click",()=>exportLeaderboard($("adminCode").value,"adminOutput"));$("adminSetupBonusBtn").addEventListener("click",()=>setupBonusPointsSheet("admin"));$("ownerExportBtn").addEventListener("click",()=>exportLeaderboard($("ownerCode").value,"ownerOutput"));$("ownerSetupBonusBtn").addEventListener("click",()=>setupBonusPointsSheet("owner"));$("ownerAdjustBtn").addEventListener("click",ownerAdjust);$("adminRenamePlayerBtn").addEventListener("click",()=>renamePlayer("admin"));$("ownerRenamePlayerBtn").addEventListener("click",()=>renamePlayer("owner"));$("ownerGenerateTempBtn").addEventListener("click",()=>ownerAction("generateTempAdminCode"));$("ownerLogsBtn").addEventListener("click",()=>ownerAction("getActionLogs"));$("ownerSuspiciousBtn").addEventListener("click",()=>ownerAction("getSuspiciousActivity"));$("ownerReportBtn").addEventListener("click",()=>ownerAction("internalSummaryReport"));$("ownerParticipationBtn").addEventListener("click",()=>ownerAction("participationReport"));$("ownerMake-UpBtn").addEventListener("click",()=>ownerAction("make-upReport"));$("ownerPrizeBtn").addEventListener("click",()=>ownerAction("prizePointsReport"));$("ownerAuditBtn").addEventListener("click",()=>ownerAction("deepAuditReport"));$("ownerResetPlayerBtn").addEventListener("click",ownerResetPlayerRound);$("ownerResetLeaderboardBtn").addEventListener("click",ownerArchiveResetLeaderboard);$("ownerDeletePlayerBtn").addEventListener("click",ownerDeletePlayer);if($("adminAuditExportBtn"))$("adminAuditExportBtn").addEventListener("click",()=>exportAuditReport($("adminCode").value,"adminOutput"));if($("adminMakeupReportBtn"))$("adminMakeupReportBtn").addEventListener("click",()=>exportMakeupReport($("adminCode").value,"adminOutput"));if($("ownerActiveDashboardBtn"))$("ownerActiveDashboardBtn").addEventListener("click",activeRoundDashboard);if($("ownerForceCloseBtn"))$("ownerForceCloseBtn").addEventListener("click",forceCloseAllRounds);if($("ownerAuditExportBtn"))$("ownerAuditExportBtn").addEventListener("click",()=>exportAuditReport($("ownerCode").value,"ownerOutput"));if($("ownerBonusReportBtn"))$("ownerBonusReportBtn").addEventListener("click",()=>exportBonusReport($("ownerCode").value,"ownerOutput"));if($("ownerMakeupReportBtn"))$("ownerMakeupReportBtn").addEventListener("click",()=>exportMakeupReport($("ownerCode").value,"ownerOutput"));refreshLeaderboard();loadActiveDefault();});
})();