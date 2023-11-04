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

async function addCards () {

  for (let i = 0; i < cardsInput.value; i++) {

    const newCard = document.createElement("div");
    newCard.classList.add("cards");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.innerText = `${i+1}`

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    // cardBack.style.backgroundImage = await setCardImages();
    // console.log(await setCardImages())
    // cardBack.style.backgroundImage = `url(http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Zac_0.jpg)`

    cardBack.innerText = `${i+1}`;

    gridContainer.appendChild(newCard);
    newCard.appendChild(cardFront);
    newCard.appendChild(cardBack);

  }
}

function cardsCanFlip() {

  const cards = Array.from(getCards);
  console.log(document.getElementsByClassName("cards"))

  cards.forEach((element) => {
    element.onclick = (event) => {
      console.log("aaaa")
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

const allChampions = [];

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
    console.log("entrou try")
    const singleChampionAPI = `http://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion/${e.name}.json`;
    const fetched = await fetch(singleChampionAPI)
    console.log("passou")
    const response = await fetched.json()
    const data = Object.keys(response.data)
    const skinsArray = response.data[data].skins

    const skinsId = skinsArray.map((e) => {
      return e.num
    })
    e.skinsId = skinsId;
  } catch (error) {
    e.skinsId = [0, 0, 0, 0, 0]
    console.log("aaaaaaa", error)
}

}

async function fetchChampionsData() {   // colocar essa func acima das outras que são chamadas?

  await fetchChampionName()

  const setSkins = allChampions.map((e) => {
    return fetchChampionSkins(e)
  })
  await Promise.all(setSkins)

}

async function setCardImages() {
    
  await fetchChampionsData()

  const randomChampion = Math.floor(Math.random() * (allChampions.length - 1))
  const randomSkin = Math.floor(Math.random() * (allChampions[randomChampion].skinsId.length - 1))

  const link = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${allChampions[randomChampion].name}_0.jpg`
  // const link = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${allChampions[randomChampion].name}_${randomSkin}.jpg`

  const cardUrl = `url(${link})`;
  console.log(cardUrl)

  return cardUrl;

}

// setCardImages()


// .then((data) => {
  



    // return allChampions;
  // })
  // .then((response) => {

    // response.forEach((e) => {
      
      // const championAPI = `http://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/champion/${e.name}.json`;
      
      // fetch(championAPI)
      // .then((response) => {
      //   return response.json()
      // })
      // .then((data) => {

      //   const championName = Object.keys(data.data)[0];
      //   const skinsArray = data.data[championName].skins;

      //   const skinsId = skinsArray.map((e) => {
      //     return e.num;
      //   })

      //   e.skins = skinsId;

      // })
    // })
    // return response;
  // })
  // .then((response) => {
    // console.log(response)
    // console.log(response[0])
    // console.log(Object.keys(response[0]))
    // console.log(response[0].name)
    // console.log(response[0].skins)
  // })
// }

// fetchChampionData()



  // then((response) => {
  //   fetch(response)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     const championName = Object.keys(data.data)[0]
  //     const skinsArray = data.data[championName].skins;
          
  //     const skinsIndex = skinsArray.map((e) => {
  //       return e.num;
  //     })
    
  //     const randomIndex = Math.floor(Math.random() * skinsIndex.length);
  //     const randomSkin = skinsIndex[randomIndex];

  //     const randomCS = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_${randomSkin}.jpg`

  //     const image = `url(${randomCS})`;
  //     return image;

  //   })
  //   .then((response) => {
  //     setImage(element, response)
  //   })
  // })


function setImage(element, image) {
    
    element.style.backgroundImage = image;
    
  }

// const ragCards = `https://static.divine-pride.net/images/items/cards/${randomInteger(4001, 4699)}.png`
// const ragSprites = `https://static.divine-pride.net/images/mobs/png/${randomInteger(1001, 3998)}.png`
// function randomInteger(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
