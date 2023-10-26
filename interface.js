const gridContainer = document.getElementById("grid-container");
const startButton = document.getElementById("start-button");

startButton.onclick = () => {
  addCards();
}

function addCards() {

  const cardsInput = document.getElementById("cards-input");
  const gridContainer = document.getElementById("grid-container");

  gridContainer.style.gridTemplateColumns = 
  `repeat(${Math.ceil(cardsInput.value / 4)}, 1fr)`;
  
  for (let i = 0; i < cardsInput.value; i++) {

    const newCard = document.createElement("div");
    newCard.classList.add("cards");
    gridContainer.appendChild(newCard);

  }

}

