const container = document.getElementById("container");

const mainContent = document.getElementById("mainContent");
const headArea = document.getElementById("headArea");

const gridArea = document.getElementById("gridArea");
const gameGrid = document.getElementById("gameGrid");

const gameStartText = document.getElementById("gameStartText");
const gameStart = document.getElementById("gameStart");
const gameStartBtn = document.getElementById("start");
const overlay = document.querySelector(".overlay");

const timer = document.getElementById("timer");

/*************** GAME START ***************/

gameStartBtn.addEventListener("click", () => {
  startTimer();
  setTimeout(() => {
    overlay.style.display = "none";
  }, 600);
  gameStartText.classList.add("return-top");
  gameStart.classList.add("return-bottom");
});

/*************** DYNAMIC ARRAY ***************/

let size = 6;

const dynamicArray = (size) => {
  arr = [];

  for (let i = 0; i < size; i++) {
    arr.push([]);
  }
  return arr;
};
let winCheckArray = dynamicArray(size);
let bombsArray = dynamicArray(size);

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

      gridItem.addEventListener("contextmenu", (e) => {
        flag(e, i, j);
        e.preventDefault();
      });

      row.append(gridItem);
    }
    gameGrid.append(row);
  }
};
renderGrid();

/*************** CLICK EVENT LISTENER FUNCTION ***************/

const clickHandler = (e, i, j) => {
  // console.log("gridItem", i, j);
  if (bombsArray[i][j] === false) {
    winCheckArray[i][j] = false;

    if (e.target.classList.contains("flag")) {
      e.target.classList.remove("flag");
    }

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

    if (e.target.innerHTML == "") {
      e.target.style.backgroundColor = "rgb(79, 233, 79)";
      e.target.classList.add("emoji");
    } else if (e.target.innerHTML !== null) {
      e.target.style.backgroundColor = "rgb(233, 233, 54)";
    }
  } else if (bombsArray[i][j] === true) {
    findAllBombs();
    gameOver();
  }

  if (JSON.stringify(winCheckArray) == JSON.stringify(bombsArray)) {
    gameWin();
  }
};

/*************** START GAME TIMER ***************/

let interval = null;
let mins = 0;
let secs = 0;

const startTimer = () => {
  interval = setInterval(() => {
    console.log("interval start");
    let time = ("00" + mins).substr(-2) + ":" + ("00" + secs).substr(-2);
    timer.innerText = time;
    secs++;

    if (secs >= 59) {
      secs = 0;
      mins++;
    }
    if (mins >= 60) {
      mins = 0;
      secs = 0;
      gameOver();
    }
  }, 1000);
};
let endTimer = () => clearInterval(interval);

/*************** GAME WINNER DISPLAY ***************/

const gameWin = () => {
  let overlay = document.createElement("div");
  overlay.className = "overlay";

  let content = document.createElement("div");
  content.id = "gameWinContent";
  content.className = "content";

  let gameWinText = document.createElement("div");
  gameWinText.className = "gameWin-text";

  gameWinText.innerHTML = `<h3>Great! You Win.</h3>`;

  let playAgain = document.createElement("div");
  playAgain.className = "play-again";

  playAgain.innerHTML = `<span id = "play">Play Again</span>`;

  overlay.append(content);
  content.append(gameWinText, playAgain);
  container.append(overlay);

  document.getElementById("play").addEventListener("click", () => {
    setTimeout(() => {
      // window.location.reload();
      overlay.remove();
      bombsDeploy();
      overlay.style.display = "none";
      gameGrid.innerHTML = "";
      renderGrid();
    }, 600);
    gameWinText.classList.add("return-top");
    playAgain.classList.add("return-bottom");
  });
};

/*************** GAME OVER DISPLAY ***************/

const gameOver = () => {
  let overlay = document.createElement("div");
  overlay.className = "overlay";

  let content = document.createElement("div");
  content.id = "gameOverContent";
  content.className = "content";

  let gameOverText = document.createElement("div");
  gameOverText.className = "gameOver-text";

  gameOverText.innerHTML = `<h3>Game Over</h3>`;

  let restart = document.createElement("div");
  restart.className = "game-restart";

  restart.innerHTML = `<span id = "restart">Restart</span>`;

  overlay.append(content);
  content.append(gameOverText, restart);
  container.append(overlay);

  document.getElementById("restart").addEventListener("click", () => {
    setTimeout(() => {
      window.location.reload();
    }, 600);
    gameOverText.classList.add("return-top");
    restart.classList.add("return-bottom");
  });
};

/*************** BOMBS DEPLOYE TO BOMBS ARRAY ***************/

const bombsDeploy = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      bombsArray[i][j] = false;
      winCheckArray[i][j] = true;
    }
    randomBombPosition = Math.trunc(Math.random() * size);
    bombsArray[i][randomBombPosition] = true;
  }
  console.log(bombsArray);
};
bombsDeploy();

/************** BOMBS DETECT FUNCTIONS **************/

const findAllBombs = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (bombsArray[i][j] === true) {
        document.getElementById(`gridItem-${i}-${j}`).classList.add("bomb");
      }
    }
  }
};

const flag = (e, i, j) => {
  if (
    e.target.classList.contains("emoji") ||
    e.target.style.backgroundColor == "rgb(233, 233, 54)"
  ) {
    return;
  } else {
    e.target.classList.add("flag");
  }
};

const detectAllEmptyBombArea = (e, i, j) => {
  if (
    bombsArray[i][j + 1] === bombsArray[i][j - 1] &&
    bombsArray[i + 1][j] === bombsArray[i - 1][j] &&
    bombsArray[i + 1][j + 1] === bombsArray[i + 1][j - 1] &&
    bombsArray[i - 1][j + 1] === bombsArray[i - 1][j - 1]
  ) {
    console.log("all gridItems are False");
    e.target.classList.add("emoji");
  }
};

const detectClosestBomb = (e, i, j) => {
  let bombsCounter = 0;
  if (bombsArray[i][j + 1] !== bombsArray[i][j - 1]) {
    bombsCounter++;
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j] !== bombsArray[i - 1][j]) {
    bombsCounter++;
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j + 1] !== bombsArray[i + 1][j - 1]) {
    bombsCounter++;
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
  if (bombsArray[i - 1][j + 1] !== bombsArray[i - 1][j - 1]) {
    bombsCounter++;
    document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
  }
};

const detectLeftColBombs = (e, i, j) => {
  let bombsCounter = 0;
  if (bombsArray[i][j + 1] === true) {
    bombsCounter++;
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j] !== bombsArray[i - 1][j]) {
    bombsCounter++;
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j + 1] !== bombsArray[i - 1][j + 1]) {
    bombsCounter++;
    e.target.innerHTML = bombsCounter;
  }
};

const detectRightColBombs = (e, i, j) => {
  let bombsCounter = 0;
  if (bombsArray[i][j - 1] === true) {
    bombsCounter++;
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j] !== bombsArray[i - 1][j]) {
    bombsCounter++;
    e.target.innerHTML = bombsCounter;
  }
  if (bombsArray[i + 1][j - 1] !== bombsArray[i - 1][j - 1]) {
    bombsCounter++;
    e.target.innerHTML = bombsCounter;
  }
};

const detectTopRowBombs = (e, i, j) => {
  let bombsCounter = 0;
  if (bombsArray[i][j - 1] === undefined) {
    if (bombsArray[i][j + 1] === true) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i + 1][j] !== bombsArray[i + 1][j + 1]) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
  } else if (bombsArray[i][j + 1] === undefined) {
    if (bombsArray[i][j - 1] === true) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i + 1][j] !== bombsArray[i + 1][j - 1]) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
  }
  if (
    bombsArray[i][j - 1] !== undefined &&
    bombsArray[i][j + 1] !== undefined
  ) {
    if (bombsArray[i + 1][j] === true) {
      bombsCounter++;
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i][j + 1] !== bombsArray[i][j - 1]) {
      bombsCounter++;
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i + 1][j + 1] !== bombsArray[i + 1][j - 1]) {
      bombsCounter++;
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }
  }
};

const detectBottomRowBombs = (e, i, j) => {
  let bombsCounter = 0;
  if (bombsArray[i][j - 1] === undefined) {
    if (bombsArray[i][j + 1] === true) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i - 1][j] !== bombsArray[i - 1][j + 1]) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
  } else if (bombsArray[i][j + 1] === undefined) {
    if (bombsArray[i][j - 1] === true) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
    if (bombsArray[i - 1][j] !== bombsArray[i - 1][j - 1]) {
      bombsCounter++;
      e.target.innerHTML = bombsCounter;
    }
  }

  if (
    bombsArray[i][j - 1] !== undefined &&
    bombsArray[i][j + 1] !== undefined
  ) {
    if (bombsArray[i - 1][j] === true) {
      bombsCounter++;
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i][j + 1] !== bombsArray[i][j - 1]) {
      bombsCounter++;
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }

    if (bombsArray[i - 1][j + 1] !== bombsArray[i - 1][j - 1]) {
      bombsCounter++;
      document.getElementById(`gridItem-${i}-${j}`).innerHTML = bombsCounter;
    }
  }
};
