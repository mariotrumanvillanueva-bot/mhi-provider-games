const ADMIN_CODE="MHI-ADMIN-FRIDAY-2026";
const OWNER_CODE="MHI-OWNER-MARIO-TV-2026";
const TEMP_ADMIN_MINUTES=60;
const SHEETS={SETTINGS:"Settings",PLAYERS:"Players",PLAYS:"Plays",ADJUSTMENTS:"Adjustments",ACTION_LOGS:"Action Logs",TEMP_CODES:"Temporary Admin Codes",SUSPICIOUS:"Suspicious Activity",FUN_SCORES:"Fun Scores",CORRECTIONS:"Name Corrections",BONUS_POINTS:"External Bonus Points",CUSTOM_QUESTIONS:"Custom Questions"};
function doPost(e){try{const data=JSON.parse(e.postData.contents||"{}");const a=data.action;
if(a==="joinGame")return json(joinGame(data,e));if(a==="saveProgress")return json(saveProgress(data,e));if(a==="submitScore")return json(submitScore(data,e));if(a==="leaderboard")return json(getLeaderboard());if(a==="exportLeaderboard")return json(exportLeaderboard(data,e));if(a==="adminVerify")return json({ok:isAdmin(data.code)});if(a==="ownerVerify")return json({ok:isOwner(data.code)});if(a==="setReleaseStatus")return json(setReleaseStatus(data,e));if(a==="setWeekGame")return json(setWeekGame(data,e));if(a==="renamePlayerTypo")return json(renamePlayerTypo(data,e));if(a==="fairPlayAudit")return json(fairPlayAudit(data));if(a==="ownerAdjust")return json(ownerAdjust(data,e));if(a==="ownerResetPlayerRound")return json(ownerResetPlayerRound(data,e));if(a==="ownerArchiveResetLeaderboard")return json(ownerArchiveResetLeaderboard(data,e));if(a==="ownerDeletePlayer")return json(ownerDeletePlayer(data,e));if(a==="ownerDeletePlayerCompletely")return json(ownerDeletePlayer(data,e));if(a==="generateTempAdminCode")return json(generateTempAdminCode(data,e));if(a==="getActionLogs")return json(getActionLogs(data));if(a==="getSuspiciousActivity")return json(getSuspiciousActivity(data));if(a==="internalSummaryReport")return json(internalSummaryReport(data));if(a==="participationReport")return json(participationReport(data));if(a==="make-upReport")return json(make-upReport(data));if(a==="prizePointsReport")return json(prizePointsReport(data));if(a==="getActiveProviderRound")return json(getActiveProviderRound(data));if(a==="submitFunScore")return json(submitFunScore(data,e));if(a==="funLeaderboard")return json(funLeaderboard(data));if(a==="deleteFunUser")return json(deleteFunUser(data,e));if(a==="deepAuditReport")return json(deepAuditReport(data));if(a==="setupBonusPointsSheet")return json(setupBonusPointsSheet(data,e));if(a==="getCustomQuestions")return json(getCustomQuestions(data));if(a==="saveCustomQuestions")return json(saveCustomQuestions(data,e));if(a==="clearCustomQuestions")return json(clearCustomQuestions(data,e));if(a==="logPracticeRun")return json(logPracticeRun(data,e));return json({ok:false,message:"Unknown action."});}catch(err){return json({ok:false,message:String(err)});}}
function json(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function ss(){return SpreadsheetApp.getActiveSpreadsheet();}function sheet(n){return ss().getSheetByName(n);}function now(){return new Date();}function norm(n){return String(n||"").trim().replace(/\s+/g," ").toLowerCase();}function nice(n){return String(n||"").trim().replace(/\s+/g," ");}function uuid(){return Utilities.getUuid();}
function isOwner(c){return String(c||"")===OWNER_CODE;}function isAdmin(c){return String(c||"")===ADMIN_CODE||isTempAdmin(c);}function canExport(c){return isAdmin(c)||isOwner(c);}function boolValue(v){return v===true||v==="TRUE"||v==="true";}
function isTempAdmin(c){const sh=sheet(SHEETS.TEMP_CODES);const values=sh.getDataRange().getValues();const current=now();for(let i=1;i<values.length;i++){if(values[i][0]===String(c||"")&&values[i][3]==="Active"&&new Date(values[i][2])>=current)return true;}return false;}
function logAction(role,action,details,e){sheet(SHEETS.ACTION_LOGS).appendRow([now(),role,action,JSON.stringify(details||{}),""]);}function logSuspicious(name,issue,details){sheet(SHEETS.SUSPICIOUS).appendRow([now(),nice(name),norm(name),issue,JSON.stringify(details||{})]);}
function settingKey(week,type){return week+" "+(type==="redemption"?"Make-Up":"Main")+" Status";}function gameKey(week){return week+" Game";}function activeGameKey(week,type){return week+" "+type+" Active Game";}
function getSettingsMap(){const v=sheet(SHEETS.SETTINGS).getDataRange().getValues();const m={};for(let i=1;i<v.length;i++)m[v[i][0]]=v[i][1];return m;}
function setSetting(key,val){const sh=sheet(SHEETS.SETTINGS);const v=sh.getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][0]===key){sh.getRange(i+1,2).setValue(val);return;}}sh.appendRow([key,val,""]);}
function getWeekGame(week){const m=getSettingsMap();return m[gameKey(week)]||"Flag Finder";}function isReleased(week,type){return getSettingsMap()[settingKey(week,type)]==="Open";}
function setWeekGame(d,e){
  const ok=(d.role==="owner"&&isOwner(d.code))||(d.role==="admin"&&isAdmin(d.code));
  if(!ok)return{ok:false,message:"Invalid code."};

  setSetting(gameKey(d.week),d.game);

  const m=getSettingsMap();
  if(m["Active Provider Week"]===d.week && m["Active Provider Release Type"]){
    setSetting("Active Provider Game",d.game);
    setSetting(activeGameKey(d.week,m["Active Provider Release Type"]),d.game);
  }

  logAction(d.role,"Set Week Game",{week:d.week,game:d.game},e);
  return{ok:true,message:d.week+" game set to "+d.game,activeWeek:m["Active Provider Week"]===d.week};
}
function setReleaseStatus(d,e){
  const ok=(d.role==="owner"&&isOwner(d.code))||(d.role==="admin"&&isAdmin(d.code));
  if(!ok)return{ok:false,message:"Invalid code."};

  const chosenGame=getWeekGame(d.week);

  setSetting(settingKey(d.week,d.releaseType),d.status);

  if(d.status==="Open"){
    // This is the exact open round. Players can only play this week + round + game.
    setSetting(activeGameKey(d.week,d.releaseType),chosenGame);
    setSetting("Active Provider Week",d.week);
    setSetting("Active Provider Release Type",d.releaseType);
    setSetting("Active Provider Game",chosenGame);
  }

  if(d.status==="Closed"){
    // Closing the active round ends the game. No new joins or rejoins are allowed while closed.
    setSetting(settingKey(d.week,d.releaseType),"Closed");
    setSetting(activeGameKey(d.week,d.releaseType),"");
    const m=getSettingsMap();
    if(m["Active Provider Week"]===d.week && m["Active Provider Release Type"]===d.releaseType){
      setSetting("Active Provider Week","");
      setSetting("Active Provider Release Type","");
      setSetting("Active Provider Game","");
    }
  }

  logAction(d.role,"Set Release Status",{week:d.week,releaseType:d.releaseType,status:d.status,activeGame:chosenGame},e);
  return{ok:true,message:settingKey(d.week,d.releaseType)+" is now "+d.status,active:{week:d.week,releaseType:d.releaseType,game:chosenGame,status:d.status}};
}
function ensurePlayer(name){const sh=sheet(SHEETS.PLAYERS);const nn=norm(name), niceName=nice(name);const v=sh.getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][1]===nn)return{nameNice:v[i][0],nameNorm:nn};}sh.appendRow([niceName,nn,now(),"","Active"]);return{nameNice:niceName,nameNorm:nn};}
function updateNameInSheet(sheetName, normCol, displayCol, oldNorm, newNorm, newNice){const sh=sheet(sheetName);const v=sh.getDataRange().getValues();let changed=0;for(let i=1;i<v.length;i++){if(v[i][normCol]===oldNorm){sh.getRange(i+1,normCol+1).setValue(newNorm);if(displayCol!==null)sh.getRange(i+1,displayCol+1).setValue(newNice);changed++;}}return changed;}

function ensureNameCorrectionsSheet(){
  let sh=ss().getSheetByName(SHEETS.CORRECTIONS);
  if(!sh){
    sh=ss().insertSheet(SHEETS.CORRECTIONS);
    sh.appendRow(["Timestamp","Old Name","Old Normalized Name","Corrected Name","Corrected Normalized Name","Changed By","Status"]);
  }
  if(sh.getLastRow()===0){
    sh.appendRow(["Timestamp","Old Name","Old Normalized Name","Corrected Name","Corrected Normalized Name","Changed By","Status"]);
  }
  return sh;
}
function addNameCorrection(oldName,newName,role){
  const sh=ensureNameCorrectionsSheet();
  sh.appendRow([now(),nice(oldName),norm(oldName),nice(newName),norm(newName),role,"Active"]);
}
function findNameCorrection(oldNorm){
  const sh=ensureNameCorrectionsSheet();
  const v=sh.getDataRange().getValues();
  for(let i=v.length-1;i>=1;i--){
    if(v[i][2]===oldNorm && String(v[i][6]||"Active")==="Active"){
      return{oldName:v[i][1],oldNorm:v[i][2],newName:v[i][3],newNorm:v[i][4],changedBy:v[i][5],timestamp:v[i][0]};
    }
  }
  return null;
}

function renamePlayerTypo(d,e){
  const ok=(d.role==="owner"&&isOwner(d.code))||(d.role==="admin"&&isAdmin(d.code));
  if(!ok)return{ok:false,message:"Invalid code."};

  const oldNorm=norm(d.oldName);
  const newNorm=norm(d.newName);
  const newNice=nice(d.newName);

  if(!oldNorm||!newNorm)return{ok:false,message:"Old name and new name are required."};
  if(oldNorm===newNorm)return{ok:false,message:"Old name and new name are the same."};

  // This migrates every active/incomplete/completed record to the corrected name.
  // The incorrect old name is then unused, so entering it later starts as a brand-new player.
  const changed={
    players:updateNameInSheet(SHEETS.PLAYERS,1,0,oldNorm,newNorm,newNice),
    plays:updateNameInSheet(SHEETS.PLAYS,2,1,oldNorm,newNorm,newNice),
    adjustments:updateNameInSheet(SHEETS.ADJUSTMENTS,2,1,oldNorm,newNorm,newNice),
    suspicious:updateNameInSheet(SHEETS.SUSPICIOUS,2,1,oldNorm,newNorm,newNice)
  };

  // If no Players row changed but there are migrated plays/adjustments, make sure the corrected player exists.
  if(changed.players===0 && (changed.plays>0 || changed.adjustments>0 || changed.suspicious>0)){
    ensurePlayer(newNice);
  }

  addNameCorrection(d.oldName,d.newName,d.role);logAction(d.role,"Fix Typo / Rename Player Preserve Rejoin",{oldName:d.oldName,newName:d.newName,oldNorm,newNorm,changed},e);

  return{
    ok:true,
    message:"Player name corrected. The corrected name keeps active progress/history. The old typo is now unused and would start fresh.",
    changed,
    correctedName:newNice
  };
}
function findStarted(nm,week,game,type){const v=sheet(SHEETS.PLAYS).getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][2]===nm&&v[i][3]===week&&v[i][4]===game&&v[i][13]===type&&v[i][11]==="Started")return{row:i+1,values:v[i]};}return null;}

function getActiveProviderRound(d){
  const m=getSettingsMap();
  const week=m["Active Provider Week"]||"";
  const releaseType=m["Active Provider Release Type"]||"";
  if(!week||!releaseType)return{ok:true,active:null,message:"No active provider round is currently open."};

  if(!isReleased(week,releaseType)){
    return{ok:true,active:null,message:"No active provider round is currently open."};
  }

  const game=m["Active Provider Game"]||m[activeGameKey(week,releaseType)]||getWeekGame(week);

  return{ok:true,active:{week:week,releaseType:releaseType,game:game},message:"Active provider round loaded."};
}
function findStartedAny(nm,week,type){const v=sheet(SHEETS.PLAYS).getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][2]===nm&&v[i][3]===week&&v[i][13]===type&&v[i][11]==="Started")return{row:i+1,values:v[i]};}return null;}
function completedExact(nm,week,game,type){const v=sheet(SHEETS.PLAYS).getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][2]===nm&&v[i][3]===week&&v[i][4]===game&&v[i][13]===type&&v[i][11]==="Completed")return true;}return false;}
function completedMainAny(nm,week){const v=sheet(SHEETS.PLAYS).getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][2]===nm&&v[i][3]===week&&v[i][13]==="main"&&v[i][11]==="Completed")return true;}return false;}

function levenshtein(a,b){
  a=String(a||""); b=String(b||"");
  const matrix=[];
  for(let i=0;i<=b.length;i++)matrix[i]=[i];
  for(let j=0;j<=a.length;j++)matrix[0][j]=j;
  for(let i=1;i<=b.length;i++){
    for(let j=1;j<=a.length;j++){
      matrix[i][j]=b.charAt(i-1)===a.charAt(j-1)?matrix[i-1][j-1]:Math.min(matrix[i-1][j-1)+1,matrix[i][j-1]+1,matrix[i-1][j]+1);
    }
  }
  return matrix[b.length][a.length];
}
function findSimilarPlayerName(nameNorm){
  const sh=sheet(SHEETS.PLAYERS);
  const v=sh.getDataRange().getValues();
  for(let i=1;i<v.length;i++){
    const existing=v[i][1];
    const existingNorm=v[i][0];
    if(!existingNorm||existingNorm===nameNorm)continue;
    if(existingNorm.indexOf(nameNorm)>=0||nameNorm.indexOf(existingNorm)>=0||levenshtein(existingNorm,nameNorm)<=2){
      return{existingName:existing,existingNorm:existingNorm};
    }
  }
  return null;
}
function hasCompletedWeekAnyRound(nameNorm,week){
  const v=sheet(SHEETS.PLAYS).getDataRange().getValues();
  for(let i=1;i<v.length;i++){
    if(v[i][2]===nameNorm&&v[i][3]===week&&v[i][11]==="Completed")return true;
  }
  return false;
}

function joinGame(d,e){
  const enteredNorm=norm(d.name);
  const similar=findSimilarPlayerName(enteredNorm);
  if(similar && !d.similarNameConfirmation){
    logSuspicious(d.name,"Similar or duplicate name entered - confirmation required",{enteredName:d.name,similarTo:similar.existingName});
    return{ok:false,similarNameWarning:true,message:"A similar name is already being used: '"+similar.existingName+"'. If this is not you, you may continue as a separate player. Continue?"};
  }
  if(similar && d.similarNameConfirmation){
    logSuspicious(d.name,"Similar or duplicate name entered - player confirmed separate entry",{enteredName:d.name,similarTo:similar.existingName});
  }
  const correction=findNameCorrection(enteredNorm);
  if(correction && !d.confirmOldTypo){
    logSuspicious(d.name,"Corrected typo re-entered - confirmation required",{enteredName:d.name,correctedName:correction.newName,changedBy:correction.changedBy,correctionTimestamp:String(correction.timestamp)});
    return{
      ok:false,
      requiresConfirmation:true,
      message:"This name was recently corrected to '"+correction.newName+"'. If you continue with '"+nice(d.name)+"', it will start as a new player and admin/owner will be able to review it. Continue?"
    };
  }
  if(correction && d.confirmOldTypo){
    logSuspicious(d.name,"Corrected typo re-entered - player confirmed new entry",{enteredName:d.name,correctedName:correction.newName,changedBy:correction.changedBy,correctionTimestamp:String(correction.timestamp)});
  }
  const p=ensurePlayer(d.name);
  const active=getActiveProviderRound({}).active;

  if(!active||!active.week||!active.releaseType||!active.game){
    return{ok:false,message:"No provider game is currently open. Admin/Owner must open a week and game first."};
  }

  const week=active.week;
  const type=active.releaseType;
  const activeGame=active.game;

  if(type==="redemption" && hasCompletedWeekAnyRound(p.nameNorm,week)){
    logSuspicious(d.name,"Tried Make-Up after already completing week",{week:week,type:type,game:activeGame});
    return{ok:false,message:"Make-Up round is only for missed weekly games. This name already completed a game for this week."};
  }

  if(!isReleased(week,type)){
    logSuspicious(d.name,"Tried closed round",{week,type,game:activeGame});
    return{ok:false,message:"This round is closed. Admin/owner must open it first."};
  }

  // Rejoin only while the same exact active round is open.
  const startedAny=findStartedAny(p.nameNorm,week,type);
  if(startedAny){
    const resumedGame=startedAny.values[4];

    if(resumedGame!==activeGame){
      return{ok:false,message:"A different game is now active. Your old unfinished game is no longer joinable."};
    }

    return{
      ok:true,
      resume:true,
      playId:startedAny.values[0],
      week:week,
      releaseType:type,
      game:resumedGame,
      statusText:type==="redemption"?"Make-Up Open":"Game Open",
      progress:{
        qIndex:Number(startedAny.values[16]||0),
        score:Number(startedAny.values[17]||0),
        correct:Number(startedAny.values[18]||0)
      },
      message:"Unfinished active game restored."
    };
  }

  if(completedExact(p.nameNorm,week,activeGame,type)){
    return{ok:false,message:"Sorry, this name has already completed this active round."};
  }

  // Make-Up eligibility is controlled by Admin/Owner opening the make-up round.
  // If a week/round was reset by owner, the player can rejoin whichever round is currently open.
  

  const playId=uuid();
  sheet(SHEETS.PLAYS).appendRow([playId,p.nameNice,p.nameNorm,week,activeGame,now(),"",0,0,0,"","Started","",type,false,false,0,0,0]);
  logAction("player","Join Active Game",{name:p.nameNice,week,game:activeGame,type},e);

  return{ok:true,resume:false,playId,week:week,releaseType:type,game:activeGame,statusText:type==="redemption"?"Make-Up Open":"Game Open"};
}
function saveProgress(d,e){const sh=sheet(SHEETS.PLAYS);const v=sh.getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][0]===d.playId&&v[i][11]==="Started"){sh.getRange(i+1,17,1,3).setValues([[Number(d.qIndex||0),Number(d.score||0),Number(d.correct||0)]]);return{ok:true};}}return{ok:false,message:"Session not found"};}
function submitScore(d,e){const sh=sheet(SHEETS.PLAYS);const v=sh.getDataRange().getValues();let row=null;for(let i=1;i<v.length;i++)if(v[i][0]===d.playId)row=i+1;if(!row)return{ok:false,message:"Play session not found."};const start=sh.getRange(row,6).getValue();const elapsed=start?Math.round((now()-new Date(start))/60000):"";const score=Number(d.score||0);let fair=score>105||elapsed<1?"Review":"OK";sh.getRange(row,7,1,12).setValues([[now(),score,Number(d.correct||0),Number(d.answered||0),elapsed,"Completed",fair,d.releaseType,Boolean(d.prizeEligible),Number(d.answered||0),score,Number(d.correct||0)]]);if(fair==="Review")logSuspicious(d.name,"Score flagged",{score,elapsed});logAction("player","Submit Score",{name:d.name,week:d.week,game:d.game,score,fair,badge:d.badge||"",difficulty:d.difficulty||""},e);return{ok:true,message:"Game complete. Final score: "+score,fairFlag:fair};}
function ownerAdjust(d,e){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};const p=ensurePlayer(d.name);sheet(SHEETS.ADJUSTMENTS).appendRow([now(),p.nameNice,p.nameNorm,Number(d.points||0),d.reason,"Owner"]);logAction("owner","Score Adjustment",{name:p.nameNice,points:d.points,reason:d.reason},e);return{ok:true,message:"Adjustment recorded."};}
function ownerResetPlayerRound(d,e){
  if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};

  const target=norm(d.name);
  const week=d.week;
  const type=d.releaseType;

  if(!target||!week||!type)return{ok:false,message:"Name, week, and round are required."};

  const sh=sheet(SHEETS.PLAYS);
  const v=sh.getDataRange().getValues();
  let changed=0;
  let pointsRemoved=0;
  const gamesReset={};

  // Scope is intentionally narrow:
  // only this player + this week + this selected round type.
  // Other weeks stay untouched.
  for(let i=1;i<v.length;i++){
    if(v[i][2]===target && v[i][3]===week && v[i][13]===type && (v[i][11]==="Completed"||v[i][11]==="Started")){
      pointsRemoved+=Number(v[i][7]||0);
      gamesReset[v[i][4]]=true;
      sh.getRange(i+1,12).setValue("Owner Reset - Archived");
      sh.getRange(i+1,13).setValue("Archived");
      changed++;
    }
  }

  logAction("owner","Reset Player Week/Round",{
    name:d.name,
    week:week,
    releaseType:type,
    recordsArchived:changed,
    pointsRemoved:pointsRemoved,
    gamesReset:Object.keys(gamesReset)
  },e);

  return{
    ok:true,
    message:"Player reset completed for "+week+" "+(type==="redemption"?"redemption":"main")+" only. Points from that selected week/round were removed from the active leaderboard. If that week/round is open, the player can rejoin it. Other weeks were not affected.",
    recordsArchived:changed,
    pointsRemoved:pointsRemoved,
    gamesReset:Object.keys(gamesReset)
  };
}
function ownerArchiveResetLeaderboard(d,e){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};const sh=sheet(SHEETS.PLAYS);const v=sh.getDataRange().getValues();let changed=0;for(let i=1;i<v.length;i++){if(v[i][11]==="Completed"){sh.getRange(i+1,12).setValue("Leaderboard Reset - Archived");sh.getRange(i+1,13).setValue("Archived");changed++;}}logAction("owner","Archive Reset Leaderboard",{recordsArchived:changed},e);return{ok:true,message:"Leaderboard reset. Completed records archived and kept for history.",recordsArchived:changed};}
function deleteRowsByName(sheetName,nameNorm,colIndex){const sh=sheet(sheetName);const v=sh.getDataRange().getValues();let deleted=0;for(let i=v.length-1;i>=1;i--){if(v[i][colIndex]===nameNorm){sh.deleteRow(i+1);deleted++;}}return deleted;}
function ownerDeletePlayer(d,e){
  if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};
  const nameNorm=norm(d.name);
  if(!nameNorm)return{ok:false,message:"Name required."};

  const deleted={
    players:deleteRowsByName(SHEETS.PLAYERS,nameNorm,1),
    plays:deleteRowsByName(SHEETS.PLAYS,nameNorm,2),
    adjustments:deleteRowsByName(SHEETS.ADJUSTMENTS,nameNorm,2),
    suspicious:deleteRowsByName(SHEETS.SUSPICIOUS,nameNorm,2)
  };

  logAction("owner","Delete Player Completely",{name:d.name,normalizedName:nameNorm,deleted},e);
  return{ok:true,message:"Player completely deleted from Provider Coordinator records.",deleted};
}

function ensureExternalBonusSheet(){
  let sh=ss().getSheetByName(SHEETS.BONUS_POINTS);
  if(!sh){
    sh=ss().insertSheet(SHEETS.BONUS_POINTS);
    sh.appendRow(["Date","Name","Normalized Name","Week","Bonus Type","Points","Reason","Added By","Notes"]);
  }
  if(sh.getLastRow()===0){
    sh.appendRow(["Date","Name","Normalized Name","Week","Bonus Type","Points","Reason","Added By","Notes"]);
  }
  return sh;
}
function getExternalBonusTotals(){
  const sh=ensureExternalBonusSheet();
  const v=sh.getDataRange().getValues();
  const totals={};
  for(let i=1;i<v.length;i++){
    const name=String(v[i][1]||"").trim();
    const normName=norm(v[i][2]||name);
    const pts=Number(v[i][5]||0);
    if(!normName || !pts)continue;
    if(!totals[normName])totals[normName]={name:name||normName,total:0,rows:0};
    totals[normName].total+=pts;
    totals[normName].rows++;
    // Auto-fill normalized name if blank so spreadsheet stays clean.
    if(!v[i][2]) sh.getRange(i+1,3).setValue(normName);
  }
  return totals;
}
function setupBonusPointsSheet(d,e){
  const ok=isOwner(d.code)||isAdmin(d.code);
  if(!ok)return{ok:false,message:"Invalid code."};
  ensureExternalBonusSheet();
  logAction(isOwner(d.code)?"owner":"admin","Setup External Bonus Points Sheet",{},e);
  return{ok:true,message:"External Bonus Points sheet is ready. Add bonus points there and refresh the leaderboard."};
}

function getLeaderboard(){const totals={};const plays=sheet(SHEETS.PLAYS).getDataRange().getValues();for(let i=1;i<plays.length;i++){if(plays[i][11]!=="Completed")continue;const key=plays[i][2],name=plays[i][1],score=Number(plays[i][7]||0),prize=boolValue(plays[i][14]);if(!totals[key])totals[key]={name,totalPoints:0,prizePoints:0,gamesPlayed:0,badges:{}};totals[key].totalPoints+=score;totals[key].gamesPlayed++;if(prize)totals[key].prizePoints+=score;totals[key].badges[plays[i][4]]=true;}const adj=sheet(SHEETS.ADJUSTMENTS).getDataRange().getValues();for(let i=1;i<adj.length;i++){const key=adj[i][2],name=adj[i][1],pts=Number(adj[i][3]||0);if(!totals[key])totals[key]={name,totalPoints:0,prizePoints:0,gamesPlayed:0,bonusPoints:0};totals[key].totalPoints+=pts;totals[key].bonusPoints=(totals[key].bonusPoints||0)+pts;}
const bonus=getExternalBonusTotals();Object.keys(bonus).forEach(key=>{if(!totals[key])totals[key]={name:bonus[key].name,totalPoints:0,prizePoints:0,gamesPlayed:0,bonusPoints:0};totals[key].totalPoints+=bonus[key].total;totals[key].bonusPoints=(totals[key].bonusPoints||0)+bonus[key].total;});const badgeNames={"Flag Finder":"Movie Buff","Landmark Legends":"Quote Master","Map Quest":"Emoji Expert","World Scramble":"Word Wizard","Culture Clues":"Sharp Selector","Passport Matching":"Match Maker","Global Showdown Kahoot":"Kahoot Champion"};const list=Object.values(totals).map(r=>{r.badges=Object.keys(r.badges||{}).map(g=>badgeNames[g]||g).join(", ");return r;});return{ok:true,leaderboard:list.sort((a,b)=>b.totalPoints-a.totalPoints).slice(0,40)};}
function exportLeaderboard(d,e){if(!canExport(d.code))return{ok:false,message:"Export denied."};const lb=getLeaderboard().leaderboard;const rows=[["Rank","Name","Total Points","Prize Points","Bonus/Adjustment Points","Games Played"]];lb.forEach((r,i)=>rows.push([i+1,r.name,r.totalPoints,r.prizePoints,r.bonusPoints||0,r.gamesPlayed]));return{ok:true,rows};}
function fairPlayAudit(d){if(!isAdmin(d.code)&&!isOwner(d.code))return{ok:false,message:"Invalid code."};const v=sheet(SHEETS.PLAYS).getDataRange().getValues();const seen={},issues=[];for(let i=1;i<v.length;i++){if(v[i][11]!=="Completed")continue;const key=v[i][2]+"|"+v[i][3]+"|"+v[i][4]+"|"+v[i][13];seen[key]=(seen[key]||0)+1;if(seen[key]>1)issues.push({row:i+1,issue:"Duplicate completion",name:v[i][1]});if(v[i][12]==="Review")issues.push({row:i+1,issue:"Marked for review",name:v[i][1],game:v[i][4]});}const suspicious=sheet(SHEETS.SUSPICIOUS).getDataRange().getValues();
  for(let j=1;j<suspicious.length;j++){
    if(String(suspicious[j][3]||"").indexOf("Corrected typo re-entered")>=0){
      issues.push({row:j+1,issue:suspicious[j][3],name:suspicious[j][1],details:suspicious[j][4]});
    }
  }
  return{ok:true,checkedRows:v.length-1,issues};}
function generateTempAdminCode(d,e){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};const temp="TEMP-ADMIN-"+Math.floor(100000+Math.random()*900000);const created=now();const expires=new Date(created.getTime()+TEMP_ADMIN_MINUTES*60000);sheet(SHEETS.TEMP_CODES).appendRow([temp,created,expires,"Active"]);return{ok:true,tempAdminCode:temp,expires:String(expires)};}
function getActionLogs(d){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};const v=sheet(SHEETS.ACTION_LOGS).getDataRange().getValues();return{ok:true,logs:v.slice(Math.max(1,v.length-50))};}
function getSuspiciousActivity(d){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};const v=sheet(SHEETS.SUSPICIOUS).getDataRange().getValues();return{ok:true,suspicious:v.slice(Math.max(1,v.length-50))};}
function allCompleted(){return sheet(SHEETS.PLAYS).getDataRange().getValues().filter((r,i)=>i>0&&r[11]==="Completed");}
function internalSummaryReport(d){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};const rows=allCompleted();return{ok:true,totalCompleted:rows.length,totalPlayers:new Set(rows.map(r=>r[2])).size,totalPoints:rows.reduce((s,r)=>s+Number(r[7]||0),0)};}
function participationReport(d){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};return{ok:true,rows:allCompleted().map(r=>({name:r[1],week:r[3],game:r[4],score:r[7],completed:r[6]}))};}
function make-upReport(d){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};return{ok:true,rows:allCompleted().filter(r=>r[13]==="redemption").map(r=>({name:r[1],week:r[3],game:r[4],score:r[7]}))};}
function prizePointsReport(d){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};return{ok:true,rows:allCompleted().filter(r=>boolValue(r[14])).map(r=>({name:r[1],week:r[3],game:r[4],score:r[7]}))};}
function deepAuditReport(d){if(!isOwner(d.code))return{ok:false,message:"Invalid owner code."};return fairPlayAudit({code:OWNER_CODE});}


function ensureFunScoresSheet(){
  let sh=ss().getSheetByName(SHEETS.FUN_SCORES);
  if(!sh){
    sh=ss().insertSheet(SHEETS.FUN_SCORES);
    sh.appendRow(["Timestamp","Name","Normalized Name","Game","Score","Date"]);
  }
  return sh;
}
function submitFunScore(d,e){
  const name=nice(d.name||"Guest");
  const nameNorm=norm(name);
  const game=String(d.game||"Fun Game");
  const score=Number(d.score||0);
  const date=String(d.date||"");
  const sh=ensureFunScoresSheet();
  sh.appendRow([now(),name,nameNorm,game,score,date]);
  return{ok:true,message:"Fun score saved."};
}
function funLeaderboard(d){
  const sh=ensureFunScoresSheet();
  const v=sh.getDataRange().getValues();
  const rows=[];
  for(let i=1;i<v.length;i++){
    rows.push({name:v[i][1],nameNorm:v[i][2],game:v[i][3],score:Number(v[i][4]||0),date:v[i][5]});
  }
  rows.sort((a,b)=>b.score-a.score);
  return{ok:true,leaderboard:rows.slice(0,20)};
}
function deleteFunUser(d,e){
  if(!isAdmin(d.code)&&!isOwner(d.code))return{ok:false,message:"Invalid admin code."};
  const target=norm(d.name);
  if(!target)return{ok:false,message:"Name required."};
  const sh=ensureFunScoresSheet();
  const v=sh.getDataRange().getValues();
  let deleted=0;
  for(let i=v.length-1;i>=1;i--){
    if(v[i][2]===target){
      sh.deleteRow(i+1);
      deleted++;
    }
  }
  logAction(isOwner(d.code)?"owner":"admin","Delete Fun Leaderboard User",{name:d.name,deleted},e);
  return{ok:true,message:"User deleted from MHI Mini Games leaderboard.",deleted};
}


function customKey(week,releaseType,game){return String(week||"")+"|"+String(releaseType||"main")+"|"+String(game||"");}
function ensureCustomQuestionsSheet(){let sh=ss().getSheetByName(SHEETS.CUSTOM_QUESTIONS);if(!sh){sh=ss().insertSheet(SHEETS.CUSTOM_QUESTIONS);sh.appendRow(["Key","Week","Round","Game","Questions JSON","Updated At","Updated By","Status"]);}if(sh.getLastRow()===0){sh.appendRow(["Key","Week","Round","Game","Questions JSON","Updated At","Updated By","Status"]);}return sh;}
function getCustomQuestions(data){const sh=ensureCustomQuestionsSheet();const key=customKey(data.week,data.releaseType,data.game);const v=sh.getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][0]===key&&String(v[i][7]||"Active")==="Active"){try{return{ok:true,source:"custom",questions:JSON.parse(v[i][4]||"[]")};}catch(err){return{ok:false,message:"Custom questions JSON is invalid: "+err};}}}return{ok:true,source:"default",questions:[]};}
function saveCustomQuestions(data,e){if(!isOwner(data.code))return{ok:false,message:"Invalid owner code."};const questions=data.questions;if(!Array.isArray(questions))return{ok:false,message:"Questions must be a JSON array."};if(questions.length<1)return{ok:false,message:"Add at least one question."};const jsonText=JSON.stringify(questions);const key=customKey(data.week,data.releaseType,data.game);const sh=ensureCustomQuestionsSheet();const v=sh.getDataRange().getValues();for(let i=1;i<v.length;i++){if(v[i][0]===key){sh.getRange(i+1,1,1,8).setValues([[key,data.week,data.releaseType,data.game,jsonText,now(),"owner","Active"]]);logAction("owner","Save Custom Questions",{week:data.week,releaseType:data.releaseType,game:data.game,count:questions.length},e);return{ok:true,message:"Custom questions updated.",count:questions.length};}}sh.appendRow([key,data.week,data.releaseType,data.game,jsonText,now(),"owner","Active"]);logAction("owner","Save Custom Questions",{week:data.week,releaseType:data.releaseType,game:data.game,count:questions.length},e);return{ok:true,message:"Custom questions saved.",count:questions.length};}
function clearCustomQuestions(data,e){if(!isOwner(data.code))return{ok:false,message:"Invalid owner code."};const key=customKey(data.week,data.releaseType,data.game);const sh=ensureCustomQuestionsSheet();const v=sh.getDataRange().getValues();let cleared=0;for(let i=1;i<v.length;i++){if(v[i][0]===key&&String(v[i][7]||"Active")==="Active"){sh.getRange(i+1,8).setValue("Cleared");cleared++;}}logAction("owner","Clear Custom Questions",{week:data.week,releaseType:data.releaseType,game:data.game,cleared},e);return{ok:true,message:"Custom questions cleared. Game will use default coded questions.",cleared};}
function logPracticeRun(data,e){if(!isOwner(data.code))return{ok:false,message:"Invalid owner code."};logAction("owner","Practice Run",{week:data.week,releaseType:data.releaseType,game:data.game,score:data.score,correct:data.correct},e);return{ok:true,message:"Practice run logged only. No leaderboard points saved."};}
