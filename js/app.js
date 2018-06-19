/*
 * List that holds all of your cards
 */

let cards = [
  "diamond",
  "paper-plane-o",
  "anchor",
  "bolt",
  "cube",
  "leaf",
  "bicycle",
  "bomb",
  "diamond",
  "paper-plane-o",
  "anchor",
  "bolt",
  "cube",
  "leaf",
  "bicycle",
  "bomb"
];

let openedCards = [];
let blockedCards = [];
let failedAttempts = 0;
let gameStarted = false;
let min, sec, intervalId, minString, secString;
let currentSeconds;
let currentMinutes;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Get a randomized list of icons, assigne them to cards and add event listeners to them
 */

function shuffleCards() {
  cards = shuffle(cards);

  let allCards = document.getElementsByClassName("card");
  allCards = Array.prototype.slice.call(allCards);

  // Loop over the card elements, add icons and events listeners

  allCards.forEach((cardElement, index) => {
    cardElement.innerHTML = `<i class="fa fa-${cards[index]}"
        data-name="${cards[index]}"></i>`;
    cardElement.addEventListener("click", handleCardClick);
  });
}

/**
 * Check whether the player won
 *
 * @return bool
 */
function checkIfWon() {
  return blockedCards.length === cards.length;
}

/**
 * Opens a card on click (if closed)
 *
 * @param e
 * @return undefined
 */
function handleCardClick(e) {
  if (gameStarted === false) {
    gameStarted = true;
    startTimer();
  }
  if (openedCards.length === 2) {
    return;
  }

  let clickedCardElement = e.target; //returns a <li> element

  let clickedCardName = clickedCardElement.childNodes[0].dataset.name; //returns the name of the icon

  //if the same card is clicked twice, it just "waits" for another card to be clicked on
  if (clickedCardElement.classList.contains("clicked")) {
    return;
  }

  if (
    blockedCards.find(blockedCardElement => {
      return blockedCardElement.childNodes[0].dataset.name === clickedCardName;
    })
  ) {
    return;
  }

  e.target.classList.add("clicked");
  e.target.classList.add("open");
  e.target.classList.add("show");

  if (openedCards.length === 0) {
    // No cards were previously opened
    openedCards.push(clickedCardElement);
    return;
  }

  let indexOfOpenedCard = null;

  openedCards.forEach((openedCard, index) => {
    if (openedCard.childNodes[0].dataset.name === clickedCardName) {
      indexOfOpenedCard = index;
    }
  });

  openedCards.push(clickedCardElement);

  if (indexOfOpenedCard !== null) {
    // The other card with same icon had already been opened, we have a match!
    blockedCards.push(openedCards[indexOfOpenedCard]);

    openedCards.splice(indexOfOpenedCard, 1);
    blockedCards.push(clickedCardElement);

    setTimeout(() => {
      blockedCards.forEach(blockedCard => {
        blockedCard.classList.add("match");
      });
      raiseMoves();
      if (checkIfWon()) {
        stopTimer();
        //get current time
        let modalMovesCounter = document.getElementsByClassName(
          "modal-moves"
        )[0];
        let movesElement = document.getElementById("moves");
        modalMovesCounter.innerHTML = movesElement.innerText;

        let modalStarsCounter = document.getElementsByClassName(
          "modal-stars"
        )[0];

        modalStarsCounter.innerHTML = getCurrentStars();

        let modalMinutes = document.getElementsByClassName("minutes")[0];

        modalMinutes.innerHTML = currentMinutes;

        let modalSeconds = document.getElementsByClassName("seconds")[0];

        modalSeconds.innerHTML = currentSeconds;

        let modal = document.getElementsByClassName("modal")[0];
        modal.classList.remove("modal-hidden");
      }
    }, 1000);
  } else {
    // Check whether another icon had previously been opened
    if (openedCards.length === 2) {
      failedAttempts++;
      setTimeout(() => {
        openedCards.forEach(openCard => {
          removeOpenClasses(openCard);
        });
        openedCards = [];
      }, 1000);
      raiseMoves();
      checkRating(failedAttempts);
    }
  }
}

function raiseMoves() {
  let movesElement = document.getElementById("moves");
  movesElement.innerHTML = parseInt(movesElement.innerText) + 1;
}

function checkRating(failedAttempts) {
  if (failedAttempts === 4 || failedAttempts === 8) {
    let allStars = document.getElementsByClassName("stars");
    allStars = Array.prototype.slice.call(allStars);
    let allStarsElement = allStars[0];

    let element = allStarsElement.firstChild;
    allStarsElement.removeChild(element);
    element.remove();
  }
}

function resetMoves() {
  let movesElement = document.getElementById("moves");
  movesElement.innerHTML = 0;
}

/**
 * Reset the star counter
 */
function resetStars() {
  let allStars = document.getElementsByClassName("stars");
  allStars = Array.prototype.slice.call(allStars);
  let allStarsElement = allStars[0];

  const currentNodeNumber = allStarsElement.childNodes.length;

  for (let i = 0; i < 3 - currentNodeNumber; i++) {
    let element = allStarsElement.firstChild;
    allStarsElement.appendChild(element.cloneNode(true));
  }
}

function getCurrentStars() {
  let allStars = document.getElementsByClassName("stars");
  allStars = Array.prototype.slice.call(allStars);
  let allStarsElement = allStars[0];

  return allStarsElement.childNodes.length;
}

/**
 * Remove open classes from an open card element
 *
 * @param element
 */
function removeOpenClasses(element) {
  element.classList.remove("open");
  element.classList.remove("show");
  element.classList.remove("clicked");
}

/**
 * Restart the game
 */
function restartGame() {
  shuffleCards();
  openedCards.forEach(openedCard => {
    removeOpenClasses(openedCard);
  });

  blockedCards.forEach(blockedCard => {
    removeOpenClasses(blockedCard);
    blockedCard.classList.remove("match");
  });

  openedCards = [];
  blockedCards = [];
  failedAttempts = 0;
  gameStarted = false;

  resetMoves();
  resetStars();
  stopTimer();
  updateTimer("00:00");
  sec = 0;
  min = 0;
}

/**
 * Restart the game and close the modal
 */
function closeModal() {
  restartGame();

  let modal = document.getElementsByClassName("modal")[0];
  modal.classList.add("modal-hidden");
}

window.onload = function() {
  // Shuffle the cards
  shuffleCards();

  // Add event listeners to modal (restart game and close modal)

  let restartButton = document.getElementsByClassName("fa fa-repeat")[0];
  restartButton.addEventListener("click", restartGame);
  let modalButton = document.getElementsByClassName("modal-button")[0];
  modalButton.addEventListener("click", closeModal);
};

/**
 * Timer
 */

function startTimer() {
  sec = 0;
  min = 0;
  intervalId = setInterval(function() {
    if (sec == 60) {
      sec = 0;
      min++;
    } else {
      sec++;
    }

    minString = addZeroToTimer(min);
    secString = addZeroToTimer(sec);

    updateTimer(minString + ":" + secString);
  }, 1000);
}

function stopTimer() {
  currentSeconds = addZeroToTimer(min);
  currentMinutes = addZeroToTimer(sec);
  clearInterval(intervalId);
}

function updateTimer(text) {
  let timer = document.getElementsByClassName("timer")[0];
  timer.innerHTML = text;
}

function addZeroToTimer(time) {
  let zeroedTime;
  if (time < 10) {
    zeroedTime = "0" + time;
  } else {
    zeroedTime = time.toString();
  }
  return zeroedTime;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
