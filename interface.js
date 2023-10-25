const gridContainer = document.getElementById("grid-container");
const startButton = document.getElementById("start-button");

startButton.onclick = () => {
  addCards();
}

function addCards() {

  const columnsInput = document.getElementById("columns-input");
  console.log(columnsInput.value)
  
  for (let i = 0; i <= columnsInput.value; i++) {

    const newCard = document.createElement("div");
    newCard.classList.add("cards");
    gridContainer.appendChild(newCard);

  }

}

