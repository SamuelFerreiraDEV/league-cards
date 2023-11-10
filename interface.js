const menu = document.getElementById("menu");
const cardsInput = document.getElementById("cards-input");
const startButton = document.getElementById("start-button");
const gridContainer = document.getElementById("grid-container");
const getCards = document.getElementsByClassName("cards");
const allChampions = [];

// gridContainer.style.backgroundImage = "url(http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Katarina_10.jpg)"

document.getElementById("music").volume = 0.1

function easyGame() {
  cardsInput.value = 16;
}

function mediumGame() {
  cardsInput.value = 32;
}

function hardGame() {
  cardsInput.value = 48;
}

startButton.onclick = () => {
  menu.style.display = "none"
  inputAlwaysEven()
  setGridSize();
  addCards();
  setImageOnCards();
  compareTwoCards();
}

async function fetchChampionName() {

  const allChampionsAPI = "http://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion.json";
  const fetched = await fetch(allChampionsAPI)
  const response = await fetched.json()
  const data = Object.keys(response.data)
  
  data.forEach((e) => {
    allChampions.push({name: e})
  })
}

async function fetchChampionSkins(e) { 
  try {
    const singleChampionAPI = `http://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion/${e.name}.json`;
    const fetched = await fetch(singleChampionAPI)
    const response = await fetched.json()
    const championName = Object.keys(response.data)
    const skinsArray = response.data[championName].skins

    const skinsId = skinsArray.map((e) => {
      return e.num
    })

    e.skinsId = skinsId;
  
  } catch (error) {
    e.skinsId = [0, 0, 0, 0, 0]
    console.log("entrou catch", error)
  }
}

async function callFetchFunctions() {

  await fetchChampionName()

  const setSkins = allChampions.map((e) => {
    return fetchChampionSkins(e)
  })
  await Promise.all(setSkins)
  
}

callFetchFunctions()

async function createImageLink() {

  const randomChampion = Math.floor(Math.random() * (allChampions.length - 1))
  const randomSkin = Math.floor(Math.random() * (allChampions[randomChampion].skinsId.length - 1))

  const championName = allChampions[randomChampion].name;
  const championSkin = allChampions[randomChampion].skinsId.splice(randomSkin, 1);

  if(allChampions[randomChampion].skinsId.length === 0) {
    allChampions.splice(randomChampion, 1);
  }

  const link = ragCards();
  // const link = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_${championSkin}.jpg`;

  const cardUrl = `url(${link})`;
  return cardUrl;

}

function inputAlwaysEven() {
  const value = Math.floor(cardsInput.value / 2) * 2;
  cardsInput.value = value;
}

function setGridSize() {

  const cardsWidth = getComputedStyle(document.documentElement).getPropertyValue("--cards-width");
  const cardsHeight = getComputedStyle(document.documentElement).getPropertyValue("--cards-height");

  
  gridContainer.style.gridTemplateColumns =
  `repeat(${Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 10)}, ${cardsWidth})`;
  
  gridContainer.style.gridTemplateRows =
  `repeat(${Math.ceil(cardsInput.value / Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 10))}, ${cardsHeight})`;

  if (cardsInput.value > 0) {
    gridContainer.style.alignContent = "stretch";
  }
}

async function addCards() {

  for (let i = 0; i < cardsInput.value; i++) {

    const newCard = document.createElement("div");
    newCard.classList.add("cards");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.innerText = `${i+1}`

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.innerText = `${i+1}`;

    gridContainer.appendChild(newCard);
    newCard.appendChild(cardFront);
    newCard.appendChild(cardBack);

  }
}

async function setImageOnCards() {

  const cards = Array.from(getCards);

  function randomIndex() {
    return Math.floor(Math.random() * (cards.length))
  }
    
  while(cards.length !== 0) {

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

        if(clickCount === 0) {
          cardCheck1 = card;
          cardCheck1.onclick = null;
          clickCount++;

        } else if (clickCount === 1){
          cardCheck2 = card;
          clickCount = 0;

           if (cardCheck1.lastChild.style.backgroundImage === cardCheck2.lastChild.style.backgroundImage) {
            cards.splice(cards.indexOf(cardCheck1), 1)
            cards.splice(cards.indexOf(cardCheck2), 1)
            cardCheck1.onclick = null;
            cardCheck2.onclick = null;
            cardCheck1 = null;
            cardCheck2 = null;

          } else {
            console.log("cartas diferentes")

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

  return `https://static.divine-pride.net/images/items/cards/${randomInteger(4001, 4699)}.png`

}

// const ragCards = `https://static.divine-pride.net/images/items/cards/${randomInteger(4001, 4699)}.png`
// const ragSprites = `https://static.divine-pride.net/images/mobs/png/${randomInteger(1001, 3998)}.png`

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
