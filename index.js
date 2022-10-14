/** Constants */
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6],
];

/** State variables */
let humanPlayer = "O";
let aiPlayer = "X";
let gameBoard;
let chooseSymbolContainer = document.querySelector(".chooseSymbol");
let endgameContainer = document.querySelector(".endgame");

/** Bindings */
document
  .querySelector("#btnSelectX")
  .addEventListener("click", chooseSymbol.bind(this, "X"), false);
document
  .querySelector("#btnSelect0")
  .addEventListener("click", chooseSymbol.bind(this, "O"), false);
document
  .querySelector("#btnRestart")
  .addEventListener("click", restartGame, false);

const squares = document.querySelectorAll(".square > button");
startGame();

function disableBoard() {
  document.querySelector(".grid").classList.add("unselected");
  return this;
}

function restartGame() {
  disableBoard().startGame();
}

function chooseSymbol(sym) {
  document.querySelector(".grid").classList.remove("unselected");
  humanPlayer = sym;
  aiPlayer = sym === "O" ? "X" : "O";
  gameBoard = Array.from(Array(9).keys());

  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", turnClick, false);
  }

  if (aiPlayer === "X") {
    turn(bestSpot(), aiPlayer);
  }
  chooseSymbolContainer.style.display = "none";
}

function startGame() {
  endgameContainer.style.display = "none";
  endgameContainer.querySelector(".text").innerText = "";
  chooseSymbolContainer.style.display = "flex";
  for (let i = 0; i < squares.length; i++) {
    squares[i].innerText = "";
  }
}

function turnClick(square) {
  if (typeof gameBoard[square.target.id] === "number") {
    turn(square.target.id, humanPlayer);

    if (!checkForWin(gameBoard, humanPlayer) && !checkForTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  gameBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkForWin(gameBoard, player);
  if (gameWon) gameOver(gameWon);
  checkForTie();
}

function checkForWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? [...a, i] : a), []);
  let gameWon = null;

  for (let [index, win] of winningCombinations.entries()) {
    if (win.every((elem) => plays.includes(elem))) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let i = 0; i < squares.length; i++) {
    squares[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(
    gameWon.player === humanPlayer ? "You win!" : "Sorry, you lost"
  );
}

function declareWinner(winner) {
  endgameContainer.style.display = "flex";
  endgameContainer.querySelector(".text").innerText = winner;
  disableBoard();
}

function emptySquares() {
  return gameBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
  return minimax(gameBoard, aiPlayer).index;
}

function checkForTie() {
  if (emptySquares().length === 0) {
    for (let square of squares) {
      square.removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie game");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  const availSpots = emptySquares(newBoard);

  if (checkForWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkForWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) move.score = minimax(newBoard, humanPlayer).score;
    else move.score = minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if (
      (player === aiPlayer && move.score === 10) ||
      (player === humanPlayer && move.score === -10)
    )
      return move;
    else moves.push(move);
  }

  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
