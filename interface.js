const cardsInput = document.getElementById("cards-input");
const startButton = document.getElementById("start-button");
const gridContainer = document.getElementById("grid-container");
const getCards = document.getElementsByClassName("cards");
const cardsWidth = getComputedStyle(document.documentElement).getPropertyValue("--cards-width");
const cardsHeight = getComputedStyle(document.documentElement).getPropertyValue("--cards-height");

const kat = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Katarina_10.jpg";
gridContainer.style.backgroundImage = `url(${kat})`


startButton.onclick = () => {
  setUpGrid();
  addCards();
  cardsCanFlip();
  fetchImages();
}

function setUpGrid () {

  gridContainer.style.gridTemplateColumns =
  `repeat(${Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 10)}, ${cardsWidth})`;
  
  gridContainer.style.gridTemplateRows =
  `repeat(${Math.ceil(cardsInput.value / Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 10))}, ${cardsHeight})`;

  if (cardsInput.value > 16) {
    gridContainer.style.alignContent = "stretch";
  }
}

function addCards () {

  for (let i = 0; i < cardsInput.value; i++) {

    const newCard = document.createElement("div");
    newCard.classList.add("cards");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.innerText = `${i+1}`

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.innerText = `${i+1}`

    gridContainer.appendChild(newCard);
    newCard.appendChild(cardFront);
    newCard.appendChild(cardBack);

  }
}

function cardsCanFlip() {

  const cards = Array.from(getCards);

  cards.forEach((element) => {
    element.onclick = (event) => {
      addFlipClassToParent(event.target);
    }
  })
}

function addFlipClassToParent(element) {

  if(element.parentElement.classList.contains("flip")) {
    element.parentElement.classList.remove("flip");
  } else {
    element.parentElement.classList.add("flip");
  }
}

function fetchImages() {

  const getcardBack = document.getElementsByClassName("card-back");
  const cardBack = Array.from(getcardBack);

  const allChampionsAPI = "http://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion.json";

    fetch(allChampionsAPI)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      const championsArray = Object.keys(data.data);
      const randomIndex = Math.floor(Math.random() * championsArray.length);

      const championAPI = `http://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion/${championsArray[randomIndex]}.json`;
      console.log(championAPI)

      return championAPI;
    })
    .then((response) => {
      fetch(response)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // const skinsId = data.data.Lux.skins;

        const championName = Object.keys(response.data)[0]
        console.log(championName)
        const championId = response.data[championName];
        console.log(championId)
        const skinsId = championId.skins;
        console.log(skinsId);
        
        const skinsIndex = skinsId.map((e) => {
          return e.num;
        })

        console.log(skinsIndex)
  
      cardBack.forEach((element) => {
  
        const randomIndex = Math.floor(Math.random() * skinsIndex.length);
        const randomSkin = skinsIndex[randomIndex];
        
        const championArts = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_${randomSkin}.jpg`
        element.style.backgroundImage = `url(${championArts})`
  
        // const ragCards = `https://static.divine-pride.net/images/items/cards/${randomInteger(4001, 4699)}.png`
        // const ragSprites = `https://static.divine-pride.net/images/mobs/png/${randomInteger(1001, 3998)}.png`
      })
    })
    
    function randomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  )
}
