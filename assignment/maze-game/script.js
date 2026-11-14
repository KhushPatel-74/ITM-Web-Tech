// =========================================================
// MEMORY MATCH - script.js (beginner friendly)
// =========================================================

// 1. DATA: 8 emojis. We need 2 of each, so we join the array with itself.
var emojis = ["🍎", "🚀", "🐱", "⚽", "🎧", "🌈", "🍕", "🎮"];
var cardValues = emojis.concat(emojis); // 16 values in total

// 2. GET HTML ELEMENTS (so JavaScript can change them)
var board = document.getElementById("board");
var movesText = document.getElementById("moves");
var matchesText = document.getElementById("matches");
var timeText = document.getElementById("time");
var bestText = document.getElementById("best");
var overlay = document.getElementById("overlay");
var winText = document.getElementById("win-text");

// 3. VARIABLES that remember the game state
var firstCard = null;   // the first card clicked in a turn
var secondCard = null;  // the second card clicked in a turn
var lockBoard = false;  // true = ignore clicks (while cards flip back)
var moves = 0;
var matches = 0;
var seconds = 0;
var timer = null;       // stores the timer so we can stop it

// 4. SHUFFLE: mix the array randomly (Fisher-Yates method)
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// 5. CREATE THE BOARD: build 16 cards and put them on the page
function createBoard() {
  board.innerHTML = ""; // remove old cards
  var shuffled = shuffle(cardValues.slice()); // slice() makes a copy

  for (var i = 0; i < shuffled.length; i++) {
    var card = document.createElement("button");
    card.className = "card";
    card.setAttribute("data-value", shuffled[i]);
    card.setAttribute("aria-label", "Card " + (i + 1));
    card.innerHTML =
      '<div class="card-inner">' +
        '<div class="card-back">?</div>' +
        '<div class="card-front">' + shuffled[i] + '</div>' +
      '</div>';

    card.addEventListener("click", flipCard); // run flipCard on click
    board.appendChild(card);
  }
}

// 6. FLIP A CARD when the player clicks it
function flipCard() {
  if (lockBoard) return;                         // wait if cards are flipping back
  if (this.classList.contains("flipped")) return; // ignore already open cards

  // start the timer on the very first click
  if (timer === null) {
    startTimer();
  }

  this.classList.add("flipped"); // CSS turns the card

  if (firstCard === null) {
    firstCard = this;        // this was the first card
  } else {
    secondCard = this;       // this was the second card
    moves++;
    movesText.textContent = moves;
    checkMatch();
  }
}

// 7. CHECK if the two flipped cards are the same
function checkMatch() {
  var value1 = firstCard.getAttribute("data-value");
  var value2 = secondCard.getAttribute("data-value");

  if (value1 === value2) {
    // MATCH: keep them open
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    matchesText.textContent = matches + " / 8";
    resetTurn();

    if (matches === 8) {
      winGame();
    }
  } else {
    // NO MATCH: flip both back after 1 second
    lockBoard = true;
    setTimeout(function () {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

// 8. RESET the turn so the player can pick 2 new cards
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// 9. TIMER: add 1 second every 1000 milliseconds
function startTimer() {
  timer = setInterval(function () {
    seconds++;
    timeText.textContent = seconds + "s";
  }, 1000);
}

// 10. WIN: stop the timer, save best score, show the message
function winGame() {
  clearInterval(timer);

  // localStorage keeps the best score even after closing the browser
  var best = localStorage.getItem("bestMoves");
  if (best === null || moves < Number(best)) {
    localStorage.setItem("bestMoves", moves);
    best = moves;
  }
  bestText.textContent = best;

  winText.textContent = "You finished in " + moves + " moves and " + seconds + " seconds.";
  overlay.classList.add("show");
}

// 11. RESTART: set everything back to the start
function restartGame() {
  clearInterval(timer);
  timer = null;
  moves = 0;
  matches = 0;
  seconds = 0;
  movesText.textContent = "0";
  matchesText.textContent = "0 / 8";
  timeText.textContent = "0s";
  overlay.classList.remove("show");
  resetTurn();
  createBoard();
}

// 12. BUTTONS
document.getElementById("restart").addEventListener("click", restartGame);
document.getElementById("play-again").addEventListener("click", restartGame);

// 13. START: show saved best score, then build the first board
var savedBest = localStorage.getItem("bestMoves");
if (savedBest !== null) {
  bestText.textContent = savedBest;
}
createBoard();
