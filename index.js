const container = document.getElementById("container");

const mainContent = document.getElementById("mainContent");
const headArea = document.getElementById("headArea");

const gridArea = document.getElementById("gridArea");
const gameGrid = document.getElementById("gameGrid");

let size = 6;

const dynamicArray = (size) => {
  arr = [];

  for (let i = 0; i < size; i++) {
    arr.push([]);
  }
  return arr;
};

let emptyBombArr = dynamicArray(size);
console.log(emptyBombArr);

const renderGrid = () => {
  for (let i = 0; i < size; i++) {
    let row = document.createElement("div");

    row.id = `gridRow-${i}`;
    row.className = "grid-row";

    row.style.height = `${(100 / size).toFixed(2)}%`;

    for (let j = 0; j < size; j++) {
      let gridItem = document.createElement("div");

      gridItem.id = `gridItem-${i}-${j}`;
      gridItem.className = "grid-item";

      gridItem.style.width = `${(100 / size).toFixed(2)}%`;

      row.append(gridItem);
    }
    gameGrid.append(row);
  }
};
renderGrid();

const bombsDeploy = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      emptyBombArr[i][j] = false;
    }
    randomBombPosition = Math.trunc(Math.random() * size);
    emptyBombArr[i][randomBombPosition] = true;
  }
};
bombsDeploy();
