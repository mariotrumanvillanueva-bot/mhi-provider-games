const SCORE_RULES = {
  correctAnswer: 10,
  completion: 5,
  finalCorrectAnswer: 12,
  finalCompletion: 10,
  tieBreakerCorrectAnswer: 15,
  tieBreakerCompletion: 10
};

const MONTH_THEME = {
  month: "July",
  theme: "World Quest",
  tagline: "Compete across continents. Conquer the globe.",
  subtitle: "Explore. Discover. Compete."
};

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
  let selected = [];

  if (diff === "easy") selected = pool.filter(q => ["easy", "medium"].includes(q.difficulty));
  else if (diff === "medium") selected = pool.filter(q => ["medium", "hard"].includes(q.difficulty));
  else if (diff === "hard") selected = pool.filter(q => ["hard", "championship"].includes(q.difficulty));
  else selected = pool.filter(q => ["medium", "hard", "championship"].includes(q.difficulty));

  if (selected.length < 5) selected = pool.slice();
  return selected.slice(0, 10);
}

const BADGE_RULES = {
  "Flag Finder": "Flag Finder",
  "Landmark Legends": "Landmark Legend",
  "Map Quest": "Map Master",
  "Culture Clues": "Culture Explorer",
  "Empire Explorer": "History Voyager",
  "World Scramble": "Word Traveler",
  "Passport Matching": "Passport Pro",
  "Global Showdown Kahoot": "Global Champion",
  "World Quest Tie-Breaker": "Tie-Breaker Champion"
};

const GAME_BANK = {
  "Flag Finder": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"easy",q:"Which country has a red circle on a white flag?",a:["Japan","Canada","Brazil","Greece"],c:0},
      {difficulty:"easy",q:"Which country’s flag is red and white with a maple leaf?",a:["Canada","Mexico","Norway","Kenya"],c:0},
      {difficulty:"easy",q:"Which country’s flag is green, white, and red vertical stripes?",a:["Italy","Sweden","Argentina","Thailand"],c:0},
      {difficulty:"medium",q:"Which country’s flag includes a Union Jack and stars?",a:["Australia","France","Egypt","Peru"],c:0},
      {difficulty:"medium",q:"Which flag is known for blue and white stripes with a sun?",a:["Argentina","Morocco","Portugal","India"],c:0},
      {difficulty:"medium",q:"Which country’s flag has a cedar tree?",a:["Lebanon","Spain","Turkey","South Korea"],c:0},
      {difficulty:"hard",q:"Which country has a red flag with a white cross that does not reach the edges?",a:["Switzerland","Denmark","Finland","Georgia"],c:0},
      {difficulty:"hard",q:"Which country’s flag includes a dragon?",a:["Bhutan","Nepal","Sri Lanka","Mongolia"],c:0},
      {difficulty:"championship",q:"Which country has the only non-rectangular national flag?",a:["Nepal","Bhutan","Qatar","Maldives"],c:0},
      {difficulty:"championship",q:"Which country’s flag features a large yellow five-pointed star on red?",a:["Vietnam","China","Morocco","Ghana"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Make-Up: Which country’s flag is blue and yellow?",a:["Ukraine","Japan","Italy","Brazil"],c:0},
      {difficulty:"easy",q:"Make-Up: Which country’s flag has red, white, and blue horizontal stripes?",a:["Netherlands","Portugal","India","Kenya"],c:0},
      {difficulty:"medium",q:"Make-Up: Which country’s flag has a red maple leaf?",a:["Canada","Norway","Mexico","Chile"],c:0},
      {difficulty:"medium",q:"Make-Up: Which country’s flag has a white crescent and star on red?",a:["Turkey","Greece","Egypt","Ireland"],c:0},
      {difficulty:"hard",q:"Make-Up: Which country’s flag has a yellow cross on blue?",a:["Sweden","Finland","Iceland","Denmark"],c:0},
      {difficulty:"hard",q:"Make-Up: Which country has a green pentagram on a red flag?",a:["Morocco","Vietnam","Turkey","Pakistan"],c:0},
      {difficulty:"championship",q:"Make-Up: Which country’s flag includes a temple symbol?",a:["Cambodia","Laos","Thailand","Malaysia"],c:0}
    ]
  },

  "Landmark Legends": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"easy",q:"The Eiffel Tower is located in which city?",a:["Paris","Rome","Berlin","Madrid"],c:0},
      {difficulty:"easy",q:"The Great Pyramid of Giza is located in which country?",a:["Egypt","Peru","India","Greece"],c:0},
      {difficulty:"easy",q:"The Colosseum is in which city?",a:["Rome","Athens","Cairo","London"],c:0},
      {difficulty:"medium",q:"Machu Picchu is located in which country?",a:["Peru","Mexico","Chile","Spain"],c:0},
      {difficulty:"medium",q:"The Taj Mahal is in which country?",a:["India","Iran","Turkey","Thailand"],c:0},
      {difficulty:"medium",q:"The Acropolis is a famous landmark in which country?",a:["Greece","Italy","Egypt","Jordan"],c:0},
      {difficulty:"hard",q:"Petra, famous for rock-cut architecture, is in which country?",a:["Jordan","Morocco","Egypt","Turkey"],c:0},
      {difficulty:"hard",q:"Angkor Wat is located in which country?",a:["Cambodia","Vietnam","Thailand","Laos"],c:0},
      {difficulty:"championship",q:"Chichén Itzá is associated with which civilization?",a:["Maya","Inca","Roman","Mongol"],c:0},
      {difficulty:"championship",q:"The ancient city of Ephesus is in modern-day...",a:["Turkey","Greece","Italy","Lebanon"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Make-Up: The Statue of Liberty is in which U.S. city?",a:["New York City","Chicago","Miami","Boston"],c:0},
      {difficulty:"easy",q:"Make-Up: The Leaning Tower is in which Italian city?",a:["Pisa","Rome","Milan","Venice"],c:0},
      {difficulty:"medium",q:"Make-Up: Stonehenge is located in which country?",a:["England","Ireland","France","Germany"],c:0},
      {difficulty:"medium",q:"Make-Up: The Sydney Opera House is in which country?",a:["Australia","New Zealand","Canada","South Africa"],c:0},
      {difficulty:"hard",q:"Make-Up: The Forbidden City is in which city?",a:["Beijing","Shanghai","Seoul","Tokyo"],c:0},
      {difficulty:"hard",q:"Make-Up: The Alhambra is located in which country?",a:["Spain","Portugal","Morocco","Italy"],c:0},
      {difficulty:"championship",q:"Make-Up: The Moai statues are on which island?",a:["Easter Island","Bali","Sicily","Crete"],c:0}
    ]
  },

  "Map Quest": {
    prizeEligible: false,
    type: "choice",
    questions: [
      {difficulty:"easy",q:"Which continent is Brazil located in?",a:["South America","Europe","Africa","Asia"],c:0},
      {difficulty:"easy",q:"Which ocean is east of the United States?",a:["Atlantic Ocean","Pacific Ocean","Indian Ocean","Arctic Ocean"],c:0},
      {difficulty:"easy",q:"Which country is both a country and a continent?",a:["Australia","Greenland","India","Egypt"],c:0},
      {difficulty:"medium",q:"Which sea lies between Europe and North Africa?",a:["Mediterranean Sea","Caribbean Sea","Red Sea","Baltic Sea"],c:0},
      {difficulty:"medium",q:"Which river is commonly associated with ancient Egypt?",a:["Nile River","Amazon River","Danube River","Ganges River"],c:0},
      {difficulty:"medium",q:"Which mountain range separates France and Spain?",a:["Pyrenees","Andes","Himalayas","Alps"],c:0},
      {difficulty:"hard",q:"Which country borders both Germany and Spain?",a:["France","Italy","Poland","Austria"],c:0},
      {difficulty:"hard",q:"Which desert spans much of North Africa?",a:["Sahara","Gobi","Kalahari","Atacama"],c:0},
      {difficulty:"championship",q:"Which strait separates Spain and Morocco?",a:["Strait of Gibraltar","Bering Strait","Bosporus","Strait of Malacca"],c:0},
      {difficulty:"championship",q:"Which country is an archipelago in Southeast Asia?",a:["Indonesia","Mongolia","Bolivia","Nepal"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Make-Up: Which continent is Kenya located in?",a:["Africa","Asia","Europe","South America"],c:0},
      {difficulty:"easy",q:"Make-Up: Which ocean borders California?",a:["Pacific Ocean","Atlantic Ocean","Indian Ocean","Arctic Ocean"],c:0},
      {difficulty:"medium",q:"Make-Up: The Amazon Rainforest is mostly in which country?",a:["Brazil","Egypt","China","Greece"],c:0},
      {difficulty:"medium",q:"Make-Up: Which continent contains the Alps?",a:["Europe","Africa","Australia","North America"],c:0},
      {difficulty:"hard",q:"Make-Up: Which country is directly south of the United States?",a:["Mexico","Canada","Cuba","Panama"],c:0},
      {difficulty:"hard",q:"Make-Up: Which mountain range includes Mount Everest?",a:["Himalayas","Rockies","Andes","Atlas"],c:0},
      {difficulty:"championship",q:"Make-Up: Which canal connects the Mediterranean Sea and Red Sea?",a:["Suez Canal","Panama Canal","Erie Canal","Grand Canal"],c:0}
    ]
  },

  "Culture Clues": {
    prizeEligible: true,
    type: "selectAll",
    questions: [
      {difficulty:"easy",q:"Select all languages commonly associated with Europe.",a:["French","German","Spanish","Swahili"],c:[0,1,2]},
      {difficulty:"easy",q:"Select all foods strongly associated with Italy.",a:["Pizza","Pasta","Risotto","Sushi"],c:[0,1,2]},
      {difficulty:"medium",q:"Select all items commonly associated with Japanese culture.",a:["Kimono","Sushi","Cherry blossoms","Pyramids of Giza"],c:[0,1,2]},
      {difficulty:"medium",q:"Select all cultural items often associated with Mexico.",a:["Mariachi","Day of the Dead","Tacos","Eiffel Tower"],c:[0,1,2]},
      {difficulty:"medium",q:"Select all religions that began in South Asia.",a:["Hinduism","Buddhism","Sikhism","Shinto"],c:[0,1,2]},
      {difficulty:"hard",q:"Select all cities known for major historic trade routes or crossroads.",a:["Istanbul","Venice","Samarkand","Honolulu"],c:[0,1,2]},
      {difficulty:"hard",q:"Select all writing systems historically tied to ancient civilizations.",a:["Hieroglyphs","Cuneiform","Maya glyphs","Morse code"],c:[0,1,2]},
      {difficulty:"championship",q:"Select all terms tied to cultural exchange.",a:["Trade routes","Migration","Exploration","Latitude only"],c:[0,1,2]}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Make-Up: Select all common world celebrations.",a:["Lunar New Year","Diwali","Carnival","Spreadsheet Day"],c:[0,1,2]},
      {difficulty:"easy",q:"Make-Up: Select all foods associated with Japan.",a:["Sushi","Ramen","Tempura","Tacos"],c:[0,1,2]},
      {difficulty:"medium",q:"Make-Up: Select all examples of cultural landmarks.",a:["Temples","Museums","Historic plazas","Printer paper"],c:[0,1,2]},
      {difficulty:"medium",q:"Make-Up: Select all ways culture can be shared.",a:["Food","Music","Language","Keyboard shortcuts"],c:[0,1,2]},
      {difficulty:"hard",q:"Make-Up: Select all historic centers of learning or culture.",a:["Alexandria","Athens","Baghdad","Las Vegas Strip"],c:[0,1,2]},
      {difficulty:"championship",q:"Make-Up: Select all factors that can shape culture.",a:["Geography","Religion","Trade","Random font size"],c:[0,1,2]}
    ]
  },

  "Empire Explorer": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"easy",q:"Which ancient civilization built pyramids at Giza?",a:["Egyptians","Romans","Vikings","Aztecs"],c:0},
      {difficulty:"easy",q:"Which empire was centered in Rome?",a:["Roman Empire","Mali Empire","Inca Empire","Mongol Empire"],c:0},
      {difficulty:"medium",q:"Which civilization is associated with Machu Picchu?",a:["Inca","Maya","Greek","Persian"],c:0},
      {difficulty:"medium",q:"Which empire was founded by Genghis Khan?",a:["Mongol Empire","Ottoman Empire","Roman Empire","British Empire"],c:0},
      {difficulty:"medium",q:"Which empire ruled from Constantinople for centuries?",a:["Byzantine Empire","Aztec Empire","Mali Empire","Qing Dynasty"],c:0},
      {difficulty:"hard",q:"Which empire was known for Mansa Musa and wealth from gold?",a:["Mali Empire","Roman Empire","Inca Empire","Viking Kingdoms"],c:0},
      {difficulty:"hard",q:"Which civilization is associated with city-states like Athens and Sparta?",a:["Ancient Greece","Ancient Egypt","Maya","Mongols"],c:0},
      {difficulty:"championship",q:"Which empire controlled large parts of the Silk Road under its peak?",a:["Mongol Empire","Aztec Empire","Portuguese Empire","Zulu Kingdom"],c:0},
      {difficulty:"championship",q:"Which empire was centered in present-day Turkey and lasted into the early 20th century?",a:["Ottoman Empire","Roman Empire","Inca Empire","Gupta Empire"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Make-Up: Which empire built many roads across Europe?",a:["Roman Empire","Inca Empire","Maya","Egyptians"],c:0},
      {difficulty:"easy",q:"Make-Up: Cleopatra is strongly associated with which civilization?",a:["Egypt","Greece","Mongolia","Peru"],c:0},
      {difficulty:"medium",q:"Make-Up: Which empire built an extensive road system in the Andes?",a:["Inca Empire","Roman Empire","Ottoman Empire","Persian Empire"],c:0},
      {difficulty:"medium",q:"Make-Up: Which civilization used cuneiform in Mesopotamia?",a:["Sumerians","Vikings","Inca","Aztecs"],c:0},
      {difficulty:"hard",q:"Make-Up: Which empire connected Europe and Asia through Constantinople?",a:["Byzantine Empire","Mali Empire","Maya","Qing Dynasty"],c:0},
      {difficulty:"hard",q:"Make-Up: Which empire was known for Janissaries and sultans?",a:["Ottoman Empire","Roman Empire","Inca Empire","Mali Empire"],c:0},
      {difficulty:"championship",q:"Make-Up: Which ruler is linked to the spread of Hellenistic culture?",a:["Alexander the Great","Julius Caesar","Mansa Musa","Kublai Khan"],c:0}
    ]
  },

  "World Scramble": {
    prizeEligible: false,
    type: "typed",
    questions: [
      {difficulty:"easy",q:"Unscramble: ANPAJ",answer:"japan"},
      {difficulty:"easy",q:"Unscramble: YGEPt",answer:"egypt"},
      {difficulty:"easy",q:"Unscramble: RZEABLI",answer:"brazil"},
      {difficulty:"medium",q:"Unscramble: FALGS",answer:"flags"},
      {difficulty:"medium",q:"Unscramble: DLAMKARN",answer:"landmark"},
      {difficulty:"medium",q:"Unscramble: GRYHOGPAE",answer:"geography"},
      {difficulty:"hard",q:"Unscramble: AITNIOVZILIC",answer:"civilization"},
      {difficulty:"hard",q:"Unscramble: TREEXRPLO",answer:"explorer"},
      {difficulty:"championship",q:"Unscramble: TNEITNONC",answer:"continent"},
      {difficulty:"championship",q:"Unscramble: POCRIALT",answer:"tropical"}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Make-Up: Unscramble: INDAI",answer:"india"},
      {difficulty:"easy",q:"Make-Up: Unscramble: APSNI",answer:"spain"},
      {difficulty:"medium",q:"Make-Up: Unscramble: MCUERLTU",answer:"culture"},
      {difficulty:"medium",q:"Make-Up: Unscramble: KIGNDOM",answer:"kingdom"},
      {difficulty:"hard",q:"Make-Up: Unscramble: RMOIPE",answer:"empire"},
      {difficulty:"hard",q:"Make-Up: Unscramble: GSINATCRIT",answer:"stratgic"},
      {difficulty:"championship",q:"Make-Up: Unscramble: EERHITAG",answer:"heritage"}
    ]
  },

  "Passport Matching": {
    prizeEligible: false,
    type: "matching",
    questions: [
      {difficulty:"easy",q:"Match the country to the landmark.",pairs:[["France","Eiffel Tower"],["Egypt","Great Pyramid"],["Italy","Colosseum"],["India","Taj Mahal"],["Peru","Machu Picchu"]]},
      {difficulty:"easy",q:"Match the country to the continent.",pairs:[["Brazil","South America"],["Kenya","Africa"],["Japan","Asia"],["France","Europe"],["Canada","North America"]]},
      {difficulty:"medium",q:"Match the civilization to a clue.",pairs:[["Roman","Colosseum"],["Inca","Andes"],["Maya","Chichén Itzá"],["Egyptian","Hieroglyphs"],["Greek","Athens"]]},
      {difficulty:"medium",q:"Match the waterway to location.",pairs:[["Nile","Egypt"],["Amazon","South America"],["Mediterranean","Europe/North Africa"],["Ganges","India"],["Pacific","West Coast U.S."]]},
      {difficulty:"hard",q:"Match the empire to a figure.",pairs:[["Mongol","Genghis Khan"],["Mali","Mansa Musa"],["Macedonian","Alexander the Great"],["Roman","Julius Caesar"],["Ottoman","Suleiman"]]},
      {difficulty:"hard",q:"Match the term to meaning.",pairs:[["Archipelago","Group of islands"],["Peninsula","Land with water on three sides"],["Strait","Narrow water passage"],["Delta","River mouth landform"],["Equator","0° latitude"]]},
      {difficulty:"championship",q:"Match the ancient route or region.",pairs:[["Silk Road","Eurasian trade"],["Sahara","North Africa"],["Andes","South America"],["Mesopotamia","Tigris/Euphrates"],["Polynesia","Pacific islands"]]}
    ],
    redemptionQuestions: [
      {difficulty:"easy",q:"Make-Up: Match the country to capital.",pairs:[["France","Paris"],["Japan","Tokyo"],["Italy","Rome"],["Egypt","Cairo"],["Spain","Madrid"]]},
      {difficulty:"easy",q:"Make-Up: Match landmark to country.",pairs:[["Great Wall","China"],["Acropolis","Greece"],["Petra","Jordan"],["Angkor Wat","Cambodia"],["Stonehenge","England"]]},
      {difficulty:"medium",q:"Make-Up: Match culture clue.",pairs:[["Kimono","Japan"],["Mariachi","Mexico"],["Pasta","Italy"],["Samba","Brazil"],["Maple leaf","Canada"]]},
      {difficulty:"medium",q:"Make-Up: Match explorer or route.",pairs:[["Magellan","Circumnavigation"],["Zheng He","Treasure voyages"],["Marco Polo","Asia travel"],["Ibn Battuta","Wide travels"],["Leif Erikson","Norse exploration"]]},
      {difficulty:"hard",q:"Make-Up: Match historical region.",pairs:[["Mesopotamia","Modern Iraq region"],["Mesoamerica","Mexico/Central America"],["Nubia","Nile region"],["Anatolia","Modern Turkey region"],["Gaul","Ancient France region"]]},
      {difficulty:"championship",q:"Make-Up: Match geography term.",pairs:[["Isthmus","Narrow land bridge"],["Plateau","High flat land"],["Steppe","Grassland plain"],["Fjord","Glacial inlet"],["Tundra","Cold treeless region"]]}
    ]
  },

  "Global Showdown Kahoot": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"medium",q:"Which country is home to the Taj Mahal?",a:["India","Egypt","Turkey","China"],c:0},
      {difficulty:"medium",q:"Which civilization is linked to Machu Picchu?",a:["Inca","Maya","Roman","Greek"],c:0},
      {difficulty:"hard",q:"Which empire was founded by Genghis Khan?",a:["Mongol Empire","Roman Empire","Mali Empire","Ottoman Empire"],c:0},
      {difficulty:"hard",q:"Which country has the only non-rectangular national flag?",a:["Nepal","Japan","Brazil","Canada"],c:0},
      {difficulty:"hard",q:"Which sea lies between Europe and North Africa?",a:["Mediterranean Sea","Red Sea","Baltic Sea","Caribbean Sea"],c:0},
      {difficulty:"championship",q:"Which strait separates Spain and Morocco?",a:["Strait of Gibraltar","Bering Strait","Bosporus","Strait of Malacca"],c:0},
      {difficulty:"championship",q:"Which ruler is associated with the Mali Empire’s wealth and pilgrimage?",a:["Mansa Musa","Julius Caesar","Genghis Khan","Cleopatra"],c:0},
      {difficulty:"championship",q:"Which term means a group of islands?",a:["Archipelago","Peninsula","Delta","Plateau"],c:0},
      {difficulty:"championship",q:"Which ancient trade network connected Europe and Asia?",a:["Silk Road","Appian Way","Route 66","Inca Trail"],c:0},
      {difficulty:"championship",q:"Which landmark is associated with the Maya civilization?",a:["Chichén Itzá","Colosseum","Eiffel Tower","Taj Mahal"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"medium",q:"Make-Up: Which country contains Petra?",a:["Jordan","Egypt","Peru","Italy"],c:0},
      {difficulty:"medium",q:"Make-Up: Which continent is Brazil in?",a:["South America","Africa","Europe","Asia"],c:0},
      {difficulty:"hard",q:"Make-Up: Which civilization used hieroglyphs?",a:["Ancient Egyptians","Romans","Vikings","Mongols"],c:0},
      {difficulty:"hard",q:"Make-Up: Which canal connects the Mediterranean and Red Sea?",a:["Suez Canal","Panama Canal","Erie Canal","Grand Canal"],c:0},
      {difficulty:"championship",q:"Make-Up: Which city was formerly Constantinople?",a:["Istanbul","Athens","Rome","Cairo"],c:0},
      {difficulty:"championship",q:"Make-Up: Which empire controlled large parts of Eurasia at its height?",a:["Mongol Empire","Aztec Empire","Mali Empire","Inca Empire"],c:0}
    ]
  },

  "World Quest Tie-Breaker": {
    prizeEligible: true,
    type: "choice",
    questions: [
      {difficulty:"championship",q:"Which country is both transcontinental and historically linked to Constantinople?",a:["Turkey","Egypt","Spain","India"],c:0},
      {difficulty:"championship",q:"Which empire connected large portions of Eurasia and helped protect trade along the Silk Road?",a:["Mongol Empire","Roman Empire","Aztec Empire","Mali Empire"],c:0},
      {difficulty:"championship",q:"Which landmark is directly tied to the ancient Maya civilization?",a:["Chichén Itzá","Taj Mahal","Colosseum","Petra"],c:0},
      {difficulty:"championship",q:"Which geographic term describes a narrow water passage connecting two larger bodies of water?",a:["Strait","Delta","Plateau","Archipelago"],c:0},
      {difficulty:"championship",q:"Which civilization is most associated with city-states such as Athens and Sparta?",a:["Ancient Greece","Ancient Egypt","Inca","Mongol"],c:0}
    ],
    redemptionQuestions: [
      {difficulty:"championship",q:"Make-Up: Which ruler is strongly associated with the Mali Empire and a famous pilgrimage?",a:["Mansa Musa","Julius Caesar","Genghis Khan","Cleopatra"],c:0},
      {difficulty:"championship",q:"Make-Up: Which canal connects the Mediterranean Sea and Red Sea?",a:["Suez Canal","Panama Canal","Erie Canal","Grand Canal"],c:0},
      {difficulty:"championship",q:"Make-Up: Which flag is the only non-rectangular national flag?",a:["Nepal","Bhutan","Qatar","Maldives"],c:0},
      {difficulty:"championship",q:"Make-Up: Which ancient trade route connected Europe and Asia?",a:["Silk Road","Route 66","Appian Way","Inca Trail"],c:0},
      {difficulty:"championship",q:"Make-Up: Which city is historically known as Constantinople?",a:["Istanbul","Athens","Rome","Cairo"],c:0}
    ]
  }
};