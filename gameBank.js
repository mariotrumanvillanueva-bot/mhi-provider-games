const GAME_BANK = {
  "Movie Trivia": {prizeEligible:true,type:"choice",questions:[
    {q:"What does box office measure?",a:["Ticket sales","Movie length","Actor height","Snack prices"],c:0},
    {q:"Who leads the overall movie vision?",a:["Director","Audience","Ticket clerk","Composer only"],c:0},
    {q:"A movie premiere is the...",a:["First public showing","Final scene","Poster","Snack counter"],c:0},
    {q:"The written plan for a movie is a...",a:["Screenplay","Receipt","Trailer","Soundtrack"],c:0},
    {q:"A blockbuster is usually...",a:["Very popular/successful","Always silent","One scene only","A documentary only"],c:0},
    {q:"What is a trailer?",a:["A preview","A full movie only","A theater seat","A camera"],c:0}],
    redemptionQuestions:[
    {q:"Redemption: A plot twist is...",a:["Unexpected story change","Snack deal","Actor costume","Poster size"],c:0},
    {q:"Redemption: A stunt performer helps with...",a:["Dangerous scenes","Ticket sales","Subtitles","Lighting only"],c:0},
    {q:"Redemption: A scene is...",a:["A section of a movie","A ticket","A poster","A popcorn size"],c:0}]},
  "Guess the Quote": {prizeEligible:true,type:"choice",questions:[
    {q:"'May the Force be with you' is from...",a:["Star Wars","Titanic","Frozen","Jaws"],c:0},
    {q:"'I'll be back' is from...",a:["The Terminator","Toy Story","Up","Coco"],c:0},
    {q:"'Just keep swimming' is from...",a:["Finding Nemo","Cars","Rocky","Shrek"],c:0},
    {q:"'To infinity and beyond' is from...",a:["Toy Story","Moana","Avatar","Jumanji"],c:0},
    {q:"'There's no place like home' is from...",a:["The Wizard of Oz","Frozen","Jaws","Batman"],c:0}],
    redemptionQuestions:[
    {q:"Redemption quote: 'Houston, we have a problem' is linked to...",a:["Apollo 13","Shrek","Scream","Elf"],c:0},
    {q:"Redemption quote: 'Life is like a box of chocolates' is linked to...",a:["Forrest Gump","Titanic","Rocky","Avatar"],c:0},
    {q:"Redemption quote: 'Hakuna Matata' is linked to...",a:["The Lion King","Titanic","Jaws","Rocky"],c:0}]},
  "Emoji Movie Guess": {prizeEligible:false,type:"choice",questions:[
    {q:"Guess the movie: 🧊👸❄️",a:["Frozen","Titanic","Jumanji","Up"],c:0},
    {q:"Guess the movie: 🦁👑",a:["The Lion King","Madagascar","Tarzan","Cars"],c:0},
    {q:"Guess the movie: 🦈🌊🚤",a:["Jaws","Moana","Avatar","Finding Nemo"],c:0},
    {q:"Guess the movie: 🧙‍♂️⚡🏰",a:["Harry Potter","Shrek","Hocus Pocus","Thor"],c:0}],
    redemptionQuestions:[
    {q:"Redemption emoji: 🐠🌊🔍",a:["Finding Nemo","Cars","Rocky","Scream"],c:0},
    {q:"Redemption emoji: 👽🚲🌕",a:["E.T.","Titanic","Elf","Grease"],c:0}]},
  "Word Scramble": {prizeEligible:false,type:"typed",questions:[
    {q:"Unscramble: MLIF",answer:"film"},
    {q:"Unscramble: POCORPN",answer:"popcorn"},
    {q:"Unscramble: CESEN",answer:"scene"},
    {q:"Unscramble: POLT",answer:"plot"},
    {q:"Unscramble: COTAR",answer:"actor"}],
    redemptionQuestions:[
    {q:"Redemption unscramble: ORREHR",answer:"horror"},
    {q:"Redemption unscramble: CIMNEA",answer:"cinema"},
    {q:"Redemption unscramble: OREH",answer:"hero"}]},
  "Select All": {prizeEligible:true,type:"selectAll",questions:[
    {q:"Select all movie snacks.",a:["Popcorn","Candy","Soda","Keyboard"],c:[0,1,2]},
    {q:"Select all movie jobs.",a:["Director","Actor","Editor","Printer"],c:[0,1,2]},
    {q:"Select all genres.",a:["Horror","Comedy","Drama","Stapler"],c:[0,1,2]}],
    redemptionQuestions:[
    {q:"Redemption: Select all movie terms.",a:["Scene","Plot","Trailer","Receipt"],c:[0,1,2]}]},
  "Matching": {prizeEligible:false,type:"matching",questions:[
    {q:"Match the terms.",pairs:[["Trailer","Preview"],["Genre","Type"],["Actor","Performer"],["Credits","Worker list"],["Scene","Movie section"]]}],
    redemptionQuestions:[
    {q:"Redemption matching.",pairs:[["Sequel","Follow-up movie"],["Premiere","First showing"],["Scene","Part of movie"],["Plot","Story events"],["Cameo","Brief appearance"]]}]},
  "Kahoot Practice": {prizeEligible:true,type:"choice",questions:[
    {q:"Kahoot: Which is a movie award?",a:["Oscar","Receipt","Stapler","Keyboard"],c:0},
    {q:"Kahoot: Which is a movie job?",a:["Director","Dentist only","Bank teller only","Pilot only"],c:0},
    {q:"Kahoot: Which is a theater snack?",a:["Popcorn","Printer ink","Notebook","Mouse"],c:0}],
    redemptionQuestions:[]}
};