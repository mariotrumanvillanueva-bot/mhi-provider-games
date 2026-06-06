const WEEK_DIFFICULTY = {
  "Week 1": "easy",
  "Week 2": "medium",
  "Week 3": "hard",
  "Week 4": "hard",
  "Final Kahoot": "championship"
};

function difficultyForWeek(week) {
  return WEEK_DIFFICULTY[week] || "easy";
}

function filterQuestionsForWeek(gameDef, week, redemption = false) {
  const pool = redemption ? gameDef.redemptionQuestions : gameDef.questions;
  const diff = difficultyForWeek(week);

  if (diff === "easy") {
    return pool.filter(q => ["easy", "medium"].includes(q.difficulty)).slice(0, 7);
  }

  if (diff === "medium") {
    return pool.filter(q => ["medium", "hard"].includes(q.difficulty)).slice(0, 8);
  }

  if (diff === "hard") {
    return pool.filter(q => ["hard", "championship"].includes(q.difficulty)).slice(0, 10);
  }

  if (diff === "championship") {
    return pool.filter(q => ["medium", "hard", "championship"].includes(q.difficulty)).slice(0, 15);
  }

  return pool.slice(0, 7);
}

const BADGE_RULES = {
  "Movie Trivia": "Movie Buff",
  "Guess the Quote": "Quote Master",
  "Emoji Movie Guess": "Emoji Expert",
  "Word Scramble": "Word Wizard",
  "Select All": "Sharp Selector",
  "Matching": "Match Maker",
  "Kahoot Practice": "Kahoot Champion"
};

const GAME_BANK = {
  "Movie Trivia": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"easy",q:"What does box office measure?",a:["Ticket sales","Movie length","Actor height","Snack prices"],c:0},
      {difficulty:"easy",q:"What is a trailer?",a:["A preview","A full movie only","A theater seat","A camera"],c:0},
      {difficulty:"easy",q:"A movie premiere is the...",a:["First public showing","Final scene","Poster","Snack counter"],c:0},
      {difficulty:"medium",q:"Who leads the overall creative vision of a movie?",a:["Director","Audience","Ticket clerk","Composer only"],c:0},
      {difficulty:"medium",q:"The written plan for a movie is a...",a:["Screenplay","Receipt","Trailer","Soundtrack"],c:0},
      {difficulty:"medium",q:"What do credits list?",a:["People who worked on the movie","Ticket prices","Only snacks","Weather"],c:0},
      {difficulty:"hard",q:"What is a prequel?",a:["A story set before the original","A snack preview","A deleted poster","A theater section"],c:0},
      {difficulty:"hard",q:"What is continuity in film?",a:["Details staying consistent across scenes","Ticket price changes","Snack portions","The movie rating"],c:0},
      {difficulty:"championship",q:"Which term means a new version of an older film?",a:["Remake","Sequel","Cameo","Matinee"],c:0},
      {difficulty:"championship",q:"Which role is usually most responsible for arranging recorded footage into the final movie?",a:["Editor","Composer","Extra","Concession worker"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Redemption: A scene is...",a:["A section of a movie","A ticket","A poster","A popcorn size"],c:0},
      {difficulty:"easy",q:"Redemption: A sequel is...",a:["A follow-up movie","A receipt","A soundtrack","A camera"],c:0},
      {difficulty:"medium",q:"Redemption: A plot twist is...",a:["Unexpected story change","Snack deal","Actor costume","Poster size"],c:0},
      {difficulty:"medium",q:"Redemption: A cameo is...",a:["A brief appearance","A theater room","A snack size","A ticket booth"],c:0},
      {difficulty:"medium",q:"Redemption: A film genre means...",a:["Type/category of movie","Ticket number","Actor age","Screen size"],c:0},
      {difficulty:"hard",q:"Redemption: A stunt performer usually helps with...",a:["Dangerous action scenes","Selling tickets","Writing subtitles only","Cleaning theaters"],c:0},
      {difficulty:"hard",q:"Redemption: What does cinematography focus on?",a:["How the movie is visually filmed","Who sells tickets","Snack pricing","The movie title font only"],c:0},
      {difficulty:"championship",q:"Redemption: What does pacing describe?",a:["How fast or slow the story feels","The ticket line speed","The actor's height","The number of posters"],c:0}
    ]
  },

  "Guess the Quote": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"easy",q:"'May the Force be with you' is from...",a:["Star Wars","Titanic","Frozen","Jaws"],c:0},
      {difficulty:"easy",q:"'Just keep swimming' is from...",a:["Finding Nemo","Cars","Rocky","Shrek"],c:0},
      {difficulty:"easy",q:"'To infinity and beyond' is from...",a:["Toy Story","Moana","Avatar","Jumanji"],c:0},
      {difficulty:"medium",q:"'I'll be back' is from...",a:["The Terminator","Toy Story","Up","Coco"],c:0},
      {difficulty:"medium",q:"'There's no place like home' is from...",a:["The Wizard of Oz","Frozen","Jaws","Batman"],c:0},
      {difficulty:"medium",q:"'Why so serious?' is linked to...",a:["The Dark Knight","Cars","Frozen","Up"],c:0},
      {difficulty:"hard",q:"'I'm king of the world!' is linked to...",a:["Titanic","Up","Cars","Coco"],c:0},
      {difficulty:"hard",q:"'Here's looking at you, kid' is linked to...",a:["Casablanca","Toy Story","Moana","Frozen"],c:0},
      {difficulty:"championship",q:"'You shall not pass!' is linked to...",a:["Lord of the Rings","Finding Nemo","Grease","Jumanji"],c:0},
      {difficulty:"championship",q:"'Life is like a box of chocolates' is linked to...",a:["Forrest Gump","Titanic","Rocky","Avatar"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Redemption quote: 'Hakuna Matata' is linked to...",a:["The Lion King","Titanic","Jaws","Rocky"],c:0},
      {difficulty:"easy",q:"Redemption quote: 'Let it go' is linked to...",a:["Frozen","Jaws","Batman","Cars"],c:0},
      {difficulty:"medium",q:"Redemption quote: 'Houston, we have a problem' is linked to...",a:["Apollo 13","Shrek","Scream","Elf"],c:0},
      {difficulty:"medium",q:"Redemption quote: 'I see dead people' is linked to...",a:["The Sixth Sense","Up","Moana","Cars"],c:0},
      {difficulty:"medium",q:"Redemption quote: 'Nobody puts Baby in a corner' is linked to...",a:["Dirty Dancing","Toy Story","Coco","Jaws"],c:0},
      {difficulty:"hard",q:"Redemption quote: 'Roads? Where we're going, we don't need roads.' is linked to...",a:["Back to the Future","Avatar","Frozen","Rocky"],c:0},
      {difficulty:"hard",q:"Redemption quote: 'Keep the change, ya filthy animal' is linked to...",a:["Home Alone","Titanic","Elf","Cars"],c:0},
      {difficulty:"championship",q:"Redemption quote: 'I'm walking here!' is linked to...",a:["Midnight Cowboy","Shrek","Up","Jaws"],c:0}
    ]
  },

  "Emoji Movie Guess": {
    prizeEligible: false,
    type: "choice",
    questions: [
      {difficulty:"easy",q:"Guess the movie: 🧊👸❄️",a:["Frozen","Titanic","Jumanji","Up"],c:0},
      {difficulty:"easy",q:"Guess the movie: 🦁👑",a:["The Lion King","Madagascar","Tarzan","Cars"],c:0},
      {difficulty:"easy",q:"Guess the movie: 🧸🤠🚀",a:["Toy Story","Frozen","Jaws","Avatar"],c:0},
      {difficulty:"medium",q:"Guess the movie: 🦈🌊🚤",a:["Jaws","Moana","Avatar","Finding Nemo"],c:0},
      {difficulty:"medium",q:"Guess the movie: 🧙‍♂️⚡🏰",a:["Harry Potter","Shrek","Hocus Pocus","Thor"],c:0},
      {difficulty:"medium",q:"Guess the movie: 🚗💨👮",a:["Fast & Furious","Cars","Speed","Taxi"],c:0},
      {difficulty:"hard",q:"Guess the movie: 👽🚲🌕",a:["E.T.","Titanic","Elf","Grease"],c:0},
      {difficulty:"hard",q:"Guess the movie: 🏠🎈👴",a:["Up","Jumanji","Moana","Avatar"],c:0},
      {difficulty:"championship",q:"Guess the movie: 🦖🏝️🚙",a:["Jurassic Park","Titanic","Up","Elf"],c:0},
      {difficulty:"championship",q:"Guess the movie: 🕷️🧑‍🦱🏙️",a:["Spider-Man","Batman","Superman","Frozen"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Redemption emoji: 🐠🌊🔍",a:["Finding Nemo","Cars","Rocky","Scream"],c:0},
      {difficulty:"easy",q:"Redemption emoji: 🧌🫏👸",a:["Shrek","Titanic","Up","Coco"],c:0},
      {difficulty:"medium",q:"Redemption emoji: 🤖❤️🌎",a:["WALL-E","Jaws","Cars","Frozen"],c:0},
      {difficulty:"medium",q:"Redemption emoji: 🐀👨‍🍳🍝",a:["Ratatouille","Titanic","Up","Elf"],c:0},
      {difficulty:"medium",q:"Redemption emoji: 🧛🩸🏰",a:["Dracula","Cars","Toy Story","Moana"],c:0},
      {difficulty:"hard",q:"Redemption emoji: 👑💍🌋",a:["Lord of the Rings","Frozen","Jaws","Up"],c:0},
      {difficulty:"hard",q:"Redemption emoji: 🧑‍🚀🌌🕳️",a:["Interstellar","Cars","Shrek","Grease"],c:0},
      {difficulty:"championship",q:"Redemption emoji: 🎹🌊🚢",a:["The Piano","Titanic","Moana","Jaws"],c:0}
    ]
  },

  "Word Scramble": {
    prizeEligible: false,
    type: "typed",
    questions: [
      {difficulty:"easy",q:"Unscramble: MLIF",answer:"film"},
      {difficulty:"easy",q:"Unscramble: COTAR",answer:"actor"},
      {difficulty:"easy",q:"Unscramble: POLT",answer:"plot"},
      {difficulty:"medium",q:"Unscramble: POCORPN",answer:"popcorn"},
      {difficulty:"medium",q:"Unscramble: NECES",answer:"scene"},
      {difficulty:"medium",q:"Unscramble: TLRPAIER",answer:"trailer"},
      {difficulty:"hard",q:"Unscramble: IOTRRCED",answer:"director"},
      {difficulty:"hard",q:"Unscramble: EIRPEMRE",answer:"premiere"},
      {difficulty:"championship",q:"Unscramble: RICTAGENMOAHYP",answer:"cinematography"},
      {difficulty:"championship",q:"Unscramble: LAVIINL",answer:"villain"}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Redemption unscramble: OREH",answer:"hero"},
      {difficulty:"easy",q:"Redemption unscramble: CAMNEI",answer:"cinema"},
      {difficulty:"medium",q:"Redemption unscramble: RHRORO",answer:"horror"},
      {difficulty:"medium",q:"Redemption unscramble: MYOEDC",answer:"comedy"},
      {difficulty:"medium",q:"Redemption unscramble: DERITC",answer:"credit"},
      {difficulty:"hard",q:"Redemption unscramble: ORNATSUKCD",answer:"soundtrack"},
      {difficulty:"hard",q:"Redemption unscramble: EESPRLQU",answer:"prequels"},
      {difficulty:"championship",q:"Redemption unscramble: RTHAACCER",answer:"character"}
    ]
  },

  "Select All": {
    prizeEligible: true,
    type: "selectAll",
    questions: [
      {difficulty:"easy",q:"Select all movie snacks.",a:["Popcorn","Candy","Soda","Keyboard"],c:[0,1,2]},
      {difficulty:"easy",q:"Select all movie jobs.",a:["Director","Actor","Editor","Printer"],c:[0,1,2]},
      {difficulty:"easy",q:"Select all genres.",a:["Horror","Comedy","Drama","Stapler"],c:[0,1,2]},
      {difficulty:"medium",q:"Select all movie terms.",a:["Scene","Plot","Trailer","Receipt"],c:[0,1,2]},
      {difficulty:"medium",q:"Select all story pieces.",a:["Character","Setting","Conflict","Mousepad"],c:[0,1,2]},
      {difficulty:"medium",q:"Select all movie formats.",a:["Sequel","Prequel","Short film","Spreadsheet"],c:[0,1,2]},
      {difficulty:"hard",q:"Select all production terms.",a:["Script","Take","Casting","Microwave"],c:[0,1,2]},
      {difficulty:"hard",q:"Select all film crew areas.",a:["Lighting","Sound","Editing","Payroll tax"],c:[0,1,2]},
      {difficulty:"championship",q:"Select all story structure terms.",a:["Climax","Theme","Resolution","Keyboard"],c:[0,1,2]},
      {difficulty:"championship",q:"Select all types of adapted/reworked films.",a:["Remake","Reboot","Spin-off","Receipt"],c:[0,1,2]}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Redemption: Select all theater items.",a:["Screen","Seats","Tickets","Toothbrush"],c:[0,1,2]},
      {difficulty:"easy",q:"Redemption: Select all story roles.",a:["Hero","Villain","Sidekick","Receipt"],c:[0,1,2]},
      {difficulty:"medium",q:"Redemption: Select all entertainment awards/shows.",a:["Oscar","Emmy","Tony","Oil change"],c:[0,1,2]},
      {difficulty:"medium",q:"Redemption: Select all audience-facing movie items.",a:["Poster","Trailer","Ticket","Stapler"],c:[0,1,2]},
      {difficulty:"medium",q:"Redemption: Select all things a script may include.",a:["Dialogue","Action lines","Scene headings","Snack prices"],c:[0,1,2]},
      {difficulty:"hard",q:"Redemption: Select all post-production roles/tasks.",a:["Editing","Sound mixing","Visual effects","Concessions"],c:[0,1,2]},
      {difficulty:"hard",q:"Redemption: Select all story conflict types.",a:["Person vs self","Person vs nature","Person vs society","Person vs popcorn"],c:[0,1,2]},
      {difficulty:"championship",q:"Redemption: Select all film classification concepts.",a:["Rating","Genre","Runtime","Seat color"],c:[0,1,2]}
    ]
  },

  "Matching": {
    prizeEligible: false,
    type: "matching",
    questions: [
      {difficulty:"easy",q:"Match the movie terms.",pairs:[["Trailer","Preview"],["Genre","Type"],["Actor","Performer"],["Credits","Worker list"],["Scene","Movie section"]]},
      {difficulty:"easy",q:"Match the theater words.",pairs:[["Ticket","Entry pass"],["Screen","Movie display"],["Seat","Where you sit"],["Audience","People watching"],["Concession","Snack area"]]},
      {difficulty:"medium",q:"Match the production roles.",pairs:[["Director","Leads vision"],["Editor","Arranges footage"],["Composer","Creates music"],["Critic","Reviews movies"],["Producer","Manages project"]]},
      {difficulty:"medium",q:"Match the story words.",pairs:[["Hero","Main good character"],["Villain","Main bad character"],["Plot","Story events"],["Setting","Where/when story happens"],["Conflict","Main problem"]]},
      {difficulty:"medium",q:"Match the movie types.",pairs:[["Comedy","Funny"],["Horror","Scary"],["Romance","Love story"],["Action","Fast-paced"],["Mystery","Puzzle/story secret"]]},
      {difficulty:"hard",q:"Match movie sequence terms.",pairs:[["Sequel","Follow-up movie"],["Prequel","Story before original"],["Trilogy","Three related movies"],["Remake","New version"],["Spin-off","Related side story"]]},
      {difficulty:"hard",q:"Match film creation terms.",pairs:[["Script","Written story"],["Take","Recorded attempt"],["Casting","Choosing actors"],["Set","Filming location"],["Props","Objects used"]]},
      {difficulty:"championship",q:"Match story structure.",pairs:[["Beginning","Introduces story"],["Middle","Builds conflict"],["Climax","Big turning point"],["Ending","Wraps story"],["Theme","Main message"]]}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Redemption matching: Basic film terms.",pairs:[["Film","Movie"],["Actor","Performer"],["Plot","Story"],["Scene","Part"],["Poster","Advertisement"]]},
      {difficulty:"easy",q:"Redemption matching: Theater basics.",pairs:[["Aisle","Walkway"],["Matinee","Earlier showing"],["Ticket","Entry"],["Seat","Place to sit"],["Screen","Movie display"]]},
      {difficulty:"medium",q:"Redemption matching: Movie people.",pairs:[["Star","Main performer"],["Extra","Background performer"],["Stunt double","Risky action"],["Writer","Creates script"],["Voice actor","Voice role"]]},
      {difficulty:"medium",q:"Redemption matching: Story parts.",pairs:[["Character","Person in story"],["Setting","Place/time"],["Conflict","Problem"],["Resolution","Ending solution"],["Theme","Message"]]},
      {difficulty:"medium",q:"Redemption matching: Film jobs.",pairs:[["Composer","Music"],["Editor","Cuts footage"],["Director","Creative lead"],["Producer","Project manager"],["Cinematographer","Camera visuals"]]},
      {difficulty:"hard",q:"Redemption matching: Advanced terms.",pairs:[["Continuity","Consistency"],["Pacing","Story speed"],["Montage","Edited sequence"],["Foreshadowing","Hint of future"],["Climax","Turning point"]]},
      {difficulty:"hard",q:"Redemption matching: Adaptation terms.",pairs:[["Adaptation","Based on another work"],["Reboot","Fresh restart"],["Remake","New version"],["Spin-off","Side story"],["Franchise","Series brand"]]},
      {difficulty:"championship",q:"Redemption matching: Film analysis.",pairs:[["Tone","Overall feeling"],["Motif","Repeated element"],["Symbolism","Meaning through objects"],["Subtext","Hidden meaning"],["Arc","Character change"]]}
    ]
  },

  "Kahoot Practice": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"medium",q:"Kahoot: Which is a movie award?",a:["Oscar","Receipt","Stapler","Keyboard"],c:0},
      {difficulty:"medium",q:"Kahoot: Which is a movie job?",a:["Director","Dentist only","Bank teller only","Pilot only"],c:0},
      {difficulty:"medium",q:"Kahoot: Which means first showing?",a:["Premiere","Invoice","Spreadsheet","Receipt"],c:0},
      {difficulty:"hard",q:"Kahoot: Which role most directly shapes the final order of scenes?",a:["Editor","Composer","Extra","Ticket seller"],c:0},
      {difficulty:"hard",q:"Kahoot: Which term means a story set before the original?",a:["Prequel","Sequel","Cameo","Trailer"],c:0},
      {difficulty:"hard",q:"Kahoot: Which term describes consistent details across shots?",a:["Continuity","Concession","Casting","Matinee"],c:0},
      {difficulty:"championship",q:"Kahoot: Which term describes the speed and rhythm of a story?",a:["Pacing","Runtime only","Ticketing","Casting"],c:0},
      {difficulty:"championship",q:"Kahoot: Which term means hidden meaning beneath dialogue/actions?",a:["Subtext","Subtitle","Soundtrack","Synopsis"],c:0},
      {difficulty:"championship",q:"Kahoot: Which is a repeated image, phrase, or idea with meaning?",a:["Motif","Matinee","Montage only","Monologue only"],c:0},
      {difficulty:"championship",q:"Kahoot: Which term means a character’s change over the story?",a:["Character arc","Seat row","Box office","Credit roll"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"medium",q:"Kahoot redemption: Which is a movie genre?",a:["Drama","Printer","Pencil","Folder"],c:0},
      {difficulty:"medium",q:"Kahoot redemption: Which is part of a story?",a:["Plot","Keyboard","Stapler","Receipt"],c:0},
      {difficulty:"hard",q:"Kahoot redemption: Which person performs in a movie?",a:["Actor","Cash register","Spreadsheet","Calendar"],c:0},
      {difficulty:"hard",q:"Kahoot redemption: Which means music from a movie?",a:["Soundtrack","Invoice","Name tag","Mousepad"],c:0},
      {difficulty:"hard",q:"Kahoot redemption: Which is a follow-up movie?",a:["Sequel","Ticket booth","Seat row","Poster only"],c:0},
      {difficulty:"championship",q:"Kahoot redemption: Which term means a new version that restarts a series?",a:["Reboot","Cameo","Genre","Score"],c:0},
      {difficulty:"championship",q:"Kahoot redemption: Which term means a quick edited sequence showing time/action?",a:["Montage","Premiere","Aisle","Credit"],c:0}
    ]
  }
};
