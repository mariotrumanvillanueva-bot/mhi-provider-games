/* MHI World Quest v42 - harder weekly game bank with different variations */
const GAME_BANK = {
  weeks: {
    week1: {
      title: "Week 1 — Flag & Country Challenge",
      style: "Variation: country, capital, and flag clue challenge. Starts harder with 10 questions.",
      questions: [
        { q: "Which country has a red flag with a large yellow star and four smaller yellow stars?", choices: ["China", "Vietnam", "Morocco", "Turkey"], answer: "China" },
        { q: "Which capital city sits near the Río de la Plata and belongs to Argentina?", choices: ["Buenos Aires", "Santiago", "Lima", "Montevideo"], answer: "Buenos Aires" },
        { q: "Which country is made up of four main islands: Honshu, Hokkaido, Kyushu, and Shikoku?", choices: ["Japan", "Indonesia", "Philippines", "New Zealand"], answer: "Japan" },
        { q: "Which country’s flag has a maple leaf in the center?", choices: ["Canada", "Switzerland", "Denmark", "Austria"], answer: "Canada" },
        { q: "Which African country uses the rand as currency and has three capital cities?", choices: ["South Africa", "Kenya", "Ghana", "Morocco"], answer: "South Africa" },
        { q: "Which country borders both Spain and the Atlantic Ocean and has Lisbon as its capital?", choices: ["Portugal", "France", "Italy", "Belgium"], answer: "Portugal" },
        { q: "Which country has the cities Mumbai, Delhi, and Kolkata?", choices: ["India", "Pakistan", "Nepal", "Bangladesh"], answer: "India" },
        { q: "Which country’s flag is a white cross on a red square?", choices: ["Switzerland", "Norway", "England", "Finland"], answer: "Switzerland" },
        { q: "Which country is known as the Land of Fire and Ice because of volcanoes and glaciers?", choices: ["Iceland", "Greenland", "Norway", "Ireland"], answer: "Iceland" },
        { q: "Which country has Ankara as its capital, even though Istanbul is its largest city?", choices: ["Turkey", "Greece", "Egypt", "Jordan"], answer: "Turkey" }
      ]
    },
    week2: {
      title: "Week 2 — Landmark Logic",
      style: "Variation: landmark clues and location matching. 12 questions, more detail-based.",
      questions: [
        { q: "The ancient city of Petra is famous for rock-cut architecture. Which country is it in?", choices: ["Jordan", "Egypt", "Saudi Arabia", "Israel"], answer: "Jordan" },
        { q: "Machu Picchu is located high in the Andes Mountains of which country?", choices: ["Peru", "Chile", "Bolivia", "Colombia"], answer: "Peru" },
        { q: "The Taj Mahal was built in which Indian city?", choices: ["Agra", "Mumbai", "New Delhi", "Jaipur"], answer: "Agra" },
        { q: "Which landmark was originally built as a Roman temple and later became a church in Rome?", choices: ["Pantheon", "Colosseum", "Trevi Fountain", "Leaning Tower"], answer: "Pantheon" },
        { q: "Angkor Wat, one of the largest religious monuments in the world, is in which country?", choices: ["Cambodia", "Thailand", "Vietnam", "Laos"], answer: "Cambodia" },
        { q: "The Hagia Sophia is located in which city?", choices: ["Istanbul", "Athens", "Cairo", "Jerusalem"], answer: "Istanbul" },
        { q: "Which U.S. landmark is carved into the Black Hills of South Dakota?", choices: ["Mount Rushmore", "Devils Tower", "Grand Canyon", "Gateway Arch"], answer: "Mount Rushmore" },
        { q: "The Acropolis overlooks which European capital city?", choices: ["Athens", "Rome", "Madrid", "Lisbon"], answer: "Athens" },
        { q: "Which landmark is a prehistoric stone circle in Wiltshire, England?", choices: ["Stonehenge", "Hadrian’s Wall", "Tower Bridge", "Windsor Castle"], answer: "Stonehenge" },
        { q: "Which city is home to the Sagrada Família basilica designed by Antoni Gaudí?", choices: ["Barcelona", "Madrid", "Seville", "Valencia"], answer: "Barcelona" },
        { q: "The Christ the Redeemer statue overlooks which city?", choices: ["Rio de Janeiro", "São Paulo", "Buenos Aires", "Lima"], answer: "Rio de Janeiro" },
        { q: "The Forbidden City is located in which capital?", choices: ["Beijing", "Tokyo", "Seoul", "Bangkok"], answer: "Beijing" }
      ]
    },
    week3: {
      title: "Week 3 — History & Explorer Sprint",
      style: "Variation: empire, explorer, and timeline clues. 14 questions, higher difficulty.",
      questions: [
        { q: "Which empire was ruled from Constantinople after the western Roman Empire fell?", choices: ["Byzantine Empire", "Ottoman Empire", "Mongol Empire", "Persian Empire"], answer: "Byzantine Empire" },
        { q: "Which explorer’s expedition completed the first circumnavigation of the globe, even though he died before it finished?", choices: ["Ferdinand Magellan", "Christopher Columbus", "Vasco da Gama", "James Cook"], answer: "Ferdinand Magellan" },
        { q: "Which civilization built Tenochtitlan on an island in Lake Texcoco?", choices: ["Aztec", "Maya", "Inca", "Olmec"], answer: "Aztec" },
        { q: "Which empire connected much of Eurasia through the Silk Road under leaders like Genghis Khan?", choices: ["Mongol Empire", "Roman Empire", "Ottoman Empire", "Mali Empire"], answer: "Mongol Empire" },
        { q: "Which West African empire was famous for wealth from gold and the pilgrimage of Mansa Musa?", choices: ["Mali Empire", "Songhai Empire", "Ghana Empire", "Aksum"], answer: "Mali Empire" },
        { q: "Which explorer reached India by sailing around the southern tip of Africa?", choices: ["Vasco da Gama", "Marco Polo", "Hernán Cortés", "Amerigo Vespucci"], answer: "Vasco da Gama" },
        { q: "Which ancient trade route connected China, Central Asia, the Middle East, and Europe?", choices: ["Silk Road", "Amber Road", "Trans-Saharan Route", "Spice Trail"], answer: "Silk Road" },
        { q: "Which empire was centered in modern-day Turkey and captured Constantinople in 1453?", choices: ["Ottoman Empire", "Byzantine Empire", "Roman Empire", "Safavid Empire"], answer: "Ottoman Empire" },
        { q: "Which Inca city is known for stone construction high in the Andes?", choices: ["Machu Picchu", "Chichén Itzá", "Teotihuacan", "Tikal"], answer: "Machu Picchu" },
        { q: "Which European power controlled Brazil during the colonial period?", choices: ["Portugal", "Spain", "France", "Netherlands"], answer: "Portugal" },
        { q: "Which explorer mapped parts of the Pacific and was killed in Hawaii in 1779?", choices: ["James Cook", "Henry Hudson", "John Cabot", "Francis Drake"], answer: "James Cook" },
        { q: "Which empire built extensive roads and used quipu for recordkeeping?", choices: ["Inca", "Aztec", "Maya", "Moche"], answer: "Inca" },
        { q: "Which ancient city was buried by the eruption of Mount Vesuvius in 79 CE?", choices: ["Pompeii", "Athens", "Carthage", "Alexandria"], answer: "Pompeii" },
        { q: "Which maritime route was heavily tied to cloves, nutmeg, cinnamon, and pepper trade?", choices: ["Spice Trade routes", "Amber Road", "Royal Road", "Appian Way"], answer: "Spice Trade routes" }
      ]
    },
    week4: {
      title: "Week 4 — Final World Quest Mix",
      style: "Variation: final mixed challenge. 16 questions with geography, history, culture, flags, and landmarks.",
      questions: [
        { q: "Which narrow waterway separates Europe and Africa near Spain and Morocco?", choices: ["Strait of Gibraltar", "Bosporus", "Suez Canal", "Dardanelles"], answer: "Strait of Gibraltar" },
        { q: "Which country contains the region of Transylvania and has Bucharest as its capital?", choices: ["Romania", "Hungary", "Bulgaria", "Serbia"], answer: "Romania" },
        { q: "Which river is generally considered the longest in South America?", choices: ["Amazon River", "Paraná River", "Orinoco River", "São Francisco River"], answer: "Amazon River" },
        { q: "Which country has the ancient city of Carthage near modern Tunis?", choices: ["Tunisia", "Morocco", "Algeria", "Libya"], answer: "Tunisia" },
        { q: "Which flag has a red circle centered on a white field?", choices: ["Japan", "Bangladesh", "South Korea", "Laos"], answer: "Japan" },
        { q: "Which mountain range separates much of Europe from Asia in Russia?", choices: ["Ural Mountains", "Alps", "Caucasus", "Carpathians"], answer: "Ural Mountains" },
        { q: "Which country is both a continent and a country?", choices: ["Australia", "Greenland", "Madagascar", "New Zealand"], answer: "Australia" },
        { q: "Which city is historically linked to the start of the Renaissance and the Medici family?", choices: ["Florence", "Venice", "Milan", "Naples"], answer: "Florence" },
        { q: "Which desert covers much of northern Africa?", choices: ["Sahara", "Kalahari", "Gobi", "Atacama"], answer: "Sahara" },
        { q: "Which country has both Māori culture and the city of Auckland?", choices: ["New Zealand", "Australia", "Fiji", "Samoa"], answer: "New Zealand" },
        { q: "Which sea lies between Saudi Arabia and northeast Africa?", choices: ["Red Sea", "Black Sea", "Caspian Sea", "Arabian Sea"], answer: "Red Sea" },
        { q: "Which European capital is split by the Danube into Buda and Pest?", choices: ["Budapest", "Vienna", "Prague", "Bratislava"], answer: "Budapest" },
        { q: "Which country is home to the temples of Bagan?", choices: ["Myanmar", "Cambodia", "Laos", "Nepal"], answer: "Myanmar" },
        { q: "Which empire used Janissaries as elite infantry?", choices: ["Ottoman Empire", "Roman Empire", "Mughal Empire", "British Empire"], answer: "Ottoman Empire" },
        { q: "Which country’s capital is Wellington?", choices: ["New Zealand", "Australia", "Canada", "Ireland"], answer: "New Zealand" },
        { q: "Which canal connects the Mediterranean Sea to the Red Sea?", choices: ["Suez Canal", "Panama Canal", "Erie Canal", "Kiel Canal"], answer: "Suez Canal" }
      ]
    }
  }
};
