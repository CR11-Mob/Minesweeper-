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
  let arr = [];

  for (let i = 0; i < size; i++) {
    arr.push([]);
  }
  return arr;
};

let winCheckArray = dynamicArray(size);
let bombsArray = dynamicArray(size);

/*************** GRID RENDERING ***************/

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

/*************** CLICK EVENT LISTENER ***************/

const clickHandler = (e, i, j) => {
  // console.log("gridItem", i, j);
  if (bombsArray[i][j] === false) {
    winCheckArray[i][j] = false;

    let bombs = detectBombs(e, i, j);

    if (e.target.classList.contains("flag")) {
      e.target.classList.remove("flag");
    }

    if (bombs === 0) {
      e.target.style.backgroundColor = "rgb(79, 233, 79)";
      e.target.classList.add("emoji");
    } else if (bombs > 0) {
      e.target.style.backgroundColor = "rgb(233, 233, 54)";
      e.target.innerHTML = bombs;
    }
  } else if (bombsArray[i][j] === true) {
    findAllBombs();
    gameOver();
  }

  if (JSON.stringify(winCheckArray) == JSON.stringify(bombsArray)) {
    gameWin();
    endTimer();
  }
};

/********** FLAG **********/

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

/*************** GAME TIMER ***************/

let interval = null;

const startTimer = () => {
  let mins = 0;
  let secs = 0;

  interval = setInterval(() => {
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

const endTimer = () => clearInterval(interval);

/*************** GAME WINNER DISPLAY ***************/

const gameWin = () => {
  endTimer();

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
      overlay.remove();
      bombsDeploy();

      gameGrid.innerHTML = "";
      renderGrid();

      startTimer();
    }, 600);

    gameWinText.classList.add("return-top");
    playAgain.classList.add("return-bottom");
  });
};

/*************** GAME OVER DISPLAY ***************/

const gameOver = () => {
  endTimer();

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

/*************** BOMBS DEPLOYE ***************/

const bombsDeploy = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      bombsArray[i][j] = false;
      winCheckArray[i][j] = true;
    }
    let randomBombPosition = Math.trunc(Math.random() * size);
    bombsArray[i][randomBombPosition] = true;
  }
  console.log(bombsArray);
};
bombsDeploy();

/************** BOMBS DETECT **************/

const findAllBombs = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (bombsArray[i][j] === true) {
        document.getElementById(`gridItem-${i}-${j}`).classList.add("bomb");
      }
    }
  }
};

const detectBombs = (e, i, j) => {
  let bombCounter = 0;

  /*** UP ***/
  if (i - 1 >= 0 && bombsArray[i - 1][j] === true) bombCounter++;

  /*** DOWN ***/

  if (i + 1 < size && bombsArray[i + 1][j] === true) bombCounter++;

  /*** LEFT ***/

  if (j - 1 >= 0 && bombsArray[i][j - 1] === true) bombCounter++;

  /*** RIGHT ***/

  if (j + 1 < size && bombsArray[i][j + 1] === true) bombCounter++;

  /*** UP-LEFT ***/

  if (i - 1 >= 0 && j - 1 >= 0 && bombsArray[i - 1][j - 1] === true)
    bombCounter++;

  /*** UP-RIGHT ***/

  if (i - 1 >= 0 && j + 1 < size && bombsArray[i - 1][j + 1] === true)
    bombCounter++;

  /*** DOWN-LEFT ***/

  if (i + 1 < size && j - 1 >= 0 && bombsArray[i + 1][j - 1] === true)
    bombCounter++;

  /*** DOWN-RIGHT ***/

  if (i + 1 < size && j + 1 < size && bombsArray[i + 1][j + 1] === true)
    bombCounter++;

  return bombCounter;
};
