const container = document.getElementById("container");

const mainContent = document.getElementById("mainContent");
const headArea = document.getElementById("headArea");

const gridArea = document.getElementById("gridArea");
const gameGrid = document.getElementById("gameGrid");

let size = 6;

/*************** DYNAMIC ARRAY ***************/

const dynamicArray = (size) => {
  arr = [];

  for (let i = 0; i < size; i++) {
    arr.push([]);
  }
  return arr;
};

let bombsArray = dynamicArray(size);
console.log(bombsArray);

/*************** DYNAMIC GRID RENDERING ***************/

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

      gridItem.addEventListener("click", (e) => {
        clickHandler(e, i, j, gridItem);
      });

      row.append(gridItem);
    }
    gameGrid.append(row);
  }
};
renderGrid();

/*************** CLICK EVENT LISTENER FUNCTION ***************/

let bombsCounter = 0;

const clickHandler = (e, i, j) => {
  console.log("gridItem", i, j);
  if (bombsArray[i][j] === false) {
    e.target.style.backgroundColor = "green";

    // detectEmptyBombArea(e, i, j);

    if (bombsArray[i - 1] === undefined) {
      detectTopRowBombs(e, i, j);
    } else if (bombsArray[i + 1] === undefined) {
      detectBottomRowBombs(e, i, j);
    } else if (
      bombsArray[i][j + 1] !== undefined &&
      bombsArray[i][j - 1] !== undefined
    ) {
      detectClosestBomb(e, i, j);
    } else if (bombsArray[i][j - 1] === undefined) {
      detectLeftColBombs(e, i, j);
    } else if (bombsArray[i][j + 1] === undefined) {
      detectRightColBombs(e, i, j);
    }
  } else if (bombsArray[i][j] === true) {
    // e.target.style.backgroundColor = "red";
    findAllBombs();
  }
};

/*************** BOMBS DEPLOYE TO BOMBS ARRAY ***************/

const bombsDeploy = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      bombsArray[i][j] = false;
    }
    randomBombPosition = Math.trunc(Math.random() * size);
    bombsArray[i][randomBombPosition] = true;
  }
};
bombsDeploy();

/************** BOMBS DETECT FUNCTIONS **************/

const findAllBombs = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // console.log(i,j);
      if (bombsArray[i][j] === true) {
        // console.log(`row${i}-${j}${bombsArray[i][j]}`);
        document.getElementById(`gridItem-${i}-${j}`).classList.add("color");
      }
    }
  }
};

const detectEmptyBombArea = (e, i, j) => {
  if (
    bombsArray[i][j + 1] === bombsArray[i][j - 1] &&
    bombsArray[i + 1][j] === bombsArray[i - 1][j] &&
    bombsArray[i + 1][j + 1] === bombsArray[i + 1][j - 1] &&
    bombsArray[i - 1][j + 1] === bombsArray[i - 1][j - 1]
  ) {
    console.log("all gridItems are False");
  }
};

const detectClosestBomb = (e, i, j) => {
  if (bombsArray[i][j + 1] !== bombsArray[i][j - 1]) {
    bombsCounter++;
    console.log("Right-Left Check:", bombsCounter);
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j] !== bombsArray[i - 1][j]) {
    bombsCounter++;
    console.log("Up-Down Check:", bombsCounter);
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j + 1] !== bombsArray[i + 1][j - 1]) {
    bombsCounter++;
    console.log("Down Right-Left Check:", bombsCounter);
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
  if (bombsArray[i - 1][j + 1] !== bombsArray[i - 1][j - 1]) {
    bombsCounter++;
    console.log("Up Right-Left Check:", bombsCounter);
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
};

const detectLeftColBombs = (e, i, j) => {
  if (bombsArray[i][j + 1] === true) {
    bombsCounter++;
    console.log(`gridItem${i}-${j + 1}`, bombsCounter);
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j] !== bombsArray[i - 1][j]) {
    bombsCounter++;
    console.log(`gridItem${i}-${j + 1}`, bombsCounter);
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j + 1] !== bombsArray[i - 1][j + 1]) {
    bombsCounter++;
    console.log(`gridItem${i}-${j + 1}`, bombsCounter);
    e.target.innerHTML = bombsCounter;
  }
};

const detectRightColBombs = () => {
  if (bombsArray[i][j - 1] === true) {
    bombsCounter++;
    console.log(`gridItem${i}-${j + 1}`, bombsCounter);
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j] !== bombsArray[i - 1][j]) {
    bombsCounter++;
    console.log(`gridItem${i}-${j + 1}`, bombsCounter);
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j - 1] !== bombsArray[i - 1][j - 1]) {
    bombsCounter++;
    console.log(`gridItem${i}-${j + 1}`, bombsCounter);
    e.target.innerHTML = bombsCounter;
  }
};

const detectTopRowBombs = (e, i, j) => {
  if (bombsArray[i][j - 1] === undefined) {
    if (bombsArray[i][j + 1] === true) {
      bombsCounter++;
      console.log(`gridItem${i}-${j + 1}`, bombsCounter);
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i + 1][j] !== bombsArray[i + 1][j + 1]) {
      bombsCounter++;
      console.log(
        `gridItem${i + 1}-${j} & gridItem${i + 1}${j + 1}`,
        bombsCounter
      );
      e.target.innerHTML = bombsCounter;
    }
  } else if (bombsArray[i][j + 1] === undefined) {
    if (bombsArray[i][j - 1] === true) {
      bombsCounter++;
      console.log(`gridItem${i}${j - 1}`, bombsCounter);
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i + 1][j] !== bombsArray[i + 1][j - 1]) {
      bombsCounter++;
      console.log(
        `gridItem${i + 1}-${j} & gridItem${i + 1}${j - 1}`,
        bombsCounter
      );
      e.target.innerHTML = bombsCounter;
    }
  }
  if (
    bombsArray[i][j - 1] !== undefined &&
    bombsArray[i][j + 1] !== undefined
  ) {
    if (bombsArray[i + 1][j] === true) {
      bombsCounter++;
      console.log(`gridItem${i + 1}${j}`, bombsCounter);
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i][j + 1] !== bombsArray[i][j - 1]) {
      bombsCounter++;
      console.log(`gridItem${i}-${j + 1} & gridItem${i}${j - 1}`, bombsCounter);
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i + 1][j + 1] !== bombsArray[i + 1][j - 1]) {
      bombsCounter++;
      console.log(
        `gridItem${i + 1}-${j + 1} & gridItem${i + 1}${j - 1}`,
        bombsCounter
      );
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }
  }
};

const detectBottomRowBombs = (e, i, j) => {
  if (bombsArray[i][j - 1] === undefined) {
    if (bombsArray[i][j + 1] === true) {
      bombsCounter++;
      console.log(`gridItem${i}-${j + 1}`, bombsCounter);
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i - 1][j] !== bombsArray[i - 1][j + 1]) {
      bombsCounter++;
      console.log(
        `gridItem${i - 1}-${j} & gridItem${i - 1}${j + 1}`,
        bombsCounter
      );
      e.target.innerHTML = bombsCounter;
    }
  } else if (bombsArray[i][j + 1] === undefined) {
    if (bombsArray[i][j - 1] === true) {
      bombsCounter++;
      console.log(`gridItem${i}-${j - 1}`, bombsCounter);
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i - 1][j] !== bombsArray[i - 1][j - 1]) {
      bombsCounter++;
      console.log(
        `gridItem${i - 1}-${j} & gridItem${i - 1}${j - 1}`,
        bombsCounter
      );
      e.target.innerHTML = bombsCounter;
    }
  }

  if (
    bombsArray[i][j - 1] !== undefined &&
    bombsArray[i][j + 1] !== undefined
  ) {
    if (bombsArray[i - 1][j] === true) {
      bombsCounter++;
      console.log(`gridItem${i - 1}${j}`, bombsCounter);
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i][j + 1] !== bombsArray[i][j - 1]) {
      bombsCounter++;
      console.log(
        `gridItem${i}-${j + 1} & gridItem${i}-${j - 1}`,
        bombsCounter
      );
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i - 1][j + 1] !== bombsArray[i - 1][j - 1]) {
      bombsCounter++;
      console.log(
        `gridItem${i - 1}-${j + 1} & gridItem${i - 1}${j - 1}`,
        bombsCounter
      );
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }
  }
};
