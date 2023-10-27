const startButton = document.getElementById("start-button");

startButton.onclick = () => {
  addCards();
}

function addCards() {

  const cardsInput = document.getElementById("cards-input");
  const flexContainer = document.getElementById("flex-container");

  for (let i = 0; i < cardsInput.value; i++) {

    const newCard = document.createElement("div");

    newCard.classList.add("cards");
    newCard.innerHTML = `${i+1}`;
    flexContainer.appendChild(newCard)
    
  }
}




