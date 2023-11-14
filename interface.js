const cardsInput = document.getElementById("cards-input");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button")
const gridContainer = document.getElementById("grid-container");
const getCards = document.getElementsByClassName("cards");
const allChampions = [];
let theme = sessionStorage.getItem("theme") ?? "rag";

function setTheme() {
  if(theme === "rag") {
    document.getElementById("container").classList.add("theme-rag");
    document.getElementById("theme-button").classList.add("theme-button-lol");
  } else {
    document.getElementById("container").classList.add("theme-lol");
    document.getElementById("theme-button").classList.add("theme-button-rag");
  }
}

setTheme()

document.getElementById("theme-button").onclick = () => {
  changeTheme();
}

function changeTheme() {
  if(theme === "rag") {
    theme = "lol";
    document.getElementById("container").classList.remove("theme-rag");
    document.getElementById("container").classList.add("theme-lol");
    document.getElementById("theme-button").classList.remove("theme-button-lol");
    document.getElementById("theme-button").classList.add("theme-button-rag");
    sessionStorage.setItem("theme", theme);
  } else {
    theme = "rag";
    document.getElementById("container").classList.remove("theme-lol")
    document.getElementById("container").classList.add("theme-rag");
    document.getElementById("theme-button").classList.remove("theme-button-rag");
    document.getElementById("theme-button").classList.add("theme-button-lol");
    sessionStorage.setItem("theme", theme)
  }
}

document.getElementById("music").volume = 0.0;

document.getElementById("mute-button").onclick = () => {
  document.getElementById("music").play();
  if(document.getElementById("music").volume == 0.1) {
    document.getElementById("music").volume = 0;
  } else {
    document.getElementById("music").volume += 0.1;
  }
}

function easyGame() {
  cardsInput.value = 16;
}

function mediumGame() {
  cardsInput.value = 32;
}

function hardGame() {
  cardsInput.value = 48;
}

cardsInput.onchange = () => {
  const currentValue = parseInt(cardsInput.value);
  const minValue = parseInt(cardsInput.min);
  const maxValue = parseInt(cardsInput.max);

  if (currentValue < minValue) {
    cardsInput.value = minValue;
  } else if (currentValue > maxValue) {
    cardsInput.value = maxValue;
  }
};

startButton.onclick = () => {
  document.getElementById("menu").style.display = "none";
  document.getElementById("theme-button").style.display = "none";
  document.getElementById("music").volume = 0.1;
  document.getElementById("music").play();
  inputAlwaysEven();
  setGridSize();
  addCards();
  setImageOnCards();
  compareTwoCards();
}

restartButton.onclick = () => {
  location.reload();
}

async function fetchChampionName() {

  try {
    const allChampionsAPI = "https://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion.json";
    const fetched = await fetch(allChampionsAPI);
    const response = await fetched.json();
    const data = Object.keys(response.data);
    
    data.forEach((e) => {
      allChampions.push({name: e});
    })
  } catch(error) {
    console.log("entrou catch", error);
  }
}

async function fetchChampionSkins(e) { 

  try {
    const singleChampionAPI = `https://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion/${e.name}.json`;
    const fetched = await fetch(singleChampionAPI);
    const response = await fetched.json();
    const championName = Object.keys(response.data);
    const skinsArray = response.data[championName].skins;

    const skinsId = skinsArray.map((e) => {
      return e.num;
    })

    e.skinsId = skinsId;
  
  } catch (error) {
    console.log("entrou catch", error)
  }
}

async function callFetchFunctions() {

  await fetchChampionName()

  const setSkins = allChampions.map((e) => {
    return fetchChampionSkins(e);
  })
  await Promise.all(setSkins);
  
}

callFetchFunctions()

async function createImageLink() {

  const randomChampion = Math.floor(Math.random() * (allChampions.length - 1));
  const randomSkin = Math.floor(Math.random() * (allChampions[randomChampion].skinsId.length - 1));

  const championName = allChampions[randomChampion].name;
  const championSkin = allChampions[randomChampion].skinsId.splice(randomSkin, 1);

  if(allChampions[randomChampion].skinsId.length === 0) {
    allChampions.splice(randomChampion, 1);
  }

  let link;
  
  if(theme === "rag") {
    link = ragCards();
  } else {
    link = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_${championSkin}.jpg`;
  }

  const cardUrl = `url(${link})`;
  return cardUrl;

}

function inputAlwaysEven() {
  let value = Math.floor(cardsInput.value / 2) * 2;

  if(value == 0) {
    value = 4;
  }

  cardsInput.value = value;
}

function setGridSize() {

  const cardsWidth = getComputedStyle(document.documentElement).getPropertyValue("--cards-width");
  const cardsHeight = getComputedStyle(document.documentElement).getPropertyValue("--cards-height");

  gridContainer.style.gridTemplateColumns =
  `repeat(${Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 8)}, ${cardsWidth})`;
  
  gridContainer.style.gridTemplateRows =
  `repeat(${Math.ceil(cardsInput.value / Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 8))}, ${cardsHeight})`;
}

async function addCards() {

  for (let i = 0; i < cardsInput.value; i++) {

    const newCard = document.createElement("div");
    newCard.classList.add("cards");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    if (theme === "lol") {
      cardFront.classList.add("card-front-lol");
    } else {
      cardFront.classList.add("card-front-rag");
    }

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    if (theme === "lol") {
      cardBack.classList.add("card-back-lol");
    } else {
      cardBack.classList.add("card-back-rag");
    }

    gridContainer.appendChild(newCard);
    newCard.appendChild(cardFront);
    newCard.appendChild(cardBack);
  }
}

async function setImageOnCards() {

  const cards = Array.from(getCards);

  function randomIndex() {
    return Math.floor(Math.random() * (cards.length));
  }
    
  while (cards.length !== 0) {

    const card1 = cards.splice(randomIndex(), 1);
    const card2 = cards.splice(randomIndex(), 1);

    const image = await createImageLink();

    card1[0].lastChild.style.backgroundImage = image;
    card2[0].lastChild.style.backgroundImage = image;
  }
}

function compareTwoCards() {
  
  let clickCount = 0;
  let cardCheck1;
  let cardCheck2;
  
  const cards = Array.from(getCards);

  function checkCards() {
    cards.forEach((card) => {
      card.onclick = (event) => {

        addOrRemoveFlipClassToParent(event.target);

        if (clickCount === 0) {
          cardCheck1 = card;
          cardCheck1.onclick = null;
          clickCount++;

        } else if (clickCount === 1) {
          cardCheck2 = card;
          clickCount = 0;

           if (cardCheck1.lastChild.style.backgroundImage === cardCheck2.lastChild.style.backgroundImage) {
            cards.splice(cards.indexOf(cardCheck1), 1);
            cards.splice(cards.indexOf(cardCheck2), 1);
            cardCheck1.onclick = null;
            cardCheck2.onclick = null;
            cardCheck1 = null;
            cardCheck2 = null;

            if (cards.length === 0) {
              setTimeout(() => {
                document.getElementById("end-text").style.display = "block";
                document.getElementById("restart-button").style.display = "block";
                document.getElementById("endgame-sfx").volume = 0.2;
                document.getElementById("endgame-sfx").play();
              }, 200);
            }

          } else {
            cards.forEach((card) => {
              card.onclick = null;
            })

            setTimeout(() => {
              addOrRemoveFlipClassToParent(cardCheck1.lastChild);
              addOrRemoveFlipClassToParent(cardCheck2.lastChild);
              cardCheck1 = null;
              cardCheck2 = null;
              cards.forEach((card) => {
                card.onclick = checkCards;
              })
            }, 700);
          }
        }
      }
    })
  }
  checkCards();
}

function addOrRemoveFlipClassToParent(element) {

  if(element.parentElement.classList.contains("flip")) {
    element.parentElement.classList.remove("flip");
  } else {
    element.parentElement.classList.add("flip");
  }
}

function ragCards () {
  return `https://static.divine-pride.net/images/items/cards/${randomInteger(4001, 4699)}.png`;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
