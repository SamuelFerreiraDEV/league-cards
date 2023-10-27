const cardsInput = document.getElementById("cards-input");
const startButton = document.getElementById("start-button");
const gridContainer = document.getElementById("grid-container");
const cards = document.getElementsByClassName("cards");
const cardsWidth = window.getComputedStyle(cards[0]).width;
const cardsHeight = window.getComputedStyle(cards[0]).height;

startButton.onclick = () => {
  setUpGrid();
  addCards();
}

function setUpGrid () {
  gridContainer.style.gridTemplateColumns = 
  `repeat(${Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 10)}, ${cardsWidth})`;
  
  gridContainer.style.gridTemplateRows = 
  `repeat(${Math.min(Math.ceil(Math.sqrt(cardsInput.value)), 10)}, ${cardsHeight})`;

  if (cardsInput.value > 16) {
    gridContainer.style.alignContent = "stretch";
  }

}


function addCards () {

  for (let i = 0; i < cardsInput.value; i++) {

    const newCard = document.createElement("div");
    newCard.classList.add("cards");
    newCard.innerHTML = `${i+1}`
    gridContainer.appendChild(newCard);

  }
}

