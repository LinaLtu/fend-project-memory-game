/*
 * Create a list that holds all of your cards
 */

let cards = [
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb',
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb'
];

let openedCards = [];
let blockedCards = [];
let failedAttempts = 0;

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

// Opens a card on click (if closed)

function handleCardClick(e) {
    if (openedCards.length === 2) {
        return;
    }

    let clickedCardElement = e.target;
    let clickedCardName = clickedCardElement.childNodes[0].dataset.name;

    if (
        blockedCards.find(blockedCardElement => {
            return (
                blockedCardElement.childNodes[0].dataset.name ===
                clickedCardName
            );
        })
    ) {
        return;
    }

    e.target.classList.add('open');
    e.target.classList.add('show');

    if (openedCards.length === 0) {
        // No cards were previously open
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
                blockedCard.classList.add('match');
            });
            raiseMoves();
            // 2. TODO CHECK IF THE USER WON
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
    let movesElement = document.getElementById('moves');
    movesElement.innerHTML = parseInt(movesElement.innerText) + 1;
}

function checkRating(failedAttempts) {
    if (failedAttempts === 4 || failedAttempts === 8) {
        let allStars = document.getElementsByClassName('stars');
        allStars = Array.prototype.slice.call(allStars);
        let allStarsElement = allStars[0];

        let element = allStarsElement.firstChild;
        allStarsElement.removeChild(element);
        element.remove();
    }
}

function resetMoves() {
    let movesElement = document.getElementById('moves');
    movesElement.innerHTML = 0;
}

/**
 * Reset the star counter
 */
function resetStars() {
    let allStars = document.getElementsByClassName('stars');
    allStars = Array.prototype.slice.call(allStars);
    let allStarsElement = allStars[0];

    const currentNodeNumber = allStarsElement.childNodes.length;

    for (let i = 0; i < 3 - currentNodeNumber; i++) {
        let element = allStarsElement.firstChild;
        allStarsElement.appendChild(element.cloneNode(true));
    }
}

/**
 * Remove open classes from an open card element
 *
 * @param element
 */
function removeOpenClasses(element) {
    element.classList.remove('open');
    element.classList.remove('show');
}

/**
 * Restart the game
 */
function restartGame() {
    openedCards.forEach(openedCard => {
        removeOpenClasses(openedCard);
    });

    blockedCards.forEach(blockedCard => {
        removeOpenClasses(blockedCard);
        blockedCard.classList.remove('match');
    });

    openedCards = [];
    blockedCards = [];
    failedAttempts = 0;

    shuffle(cards);

    resetMoves();
    resetStars();
}

window.onload = function() {
    // Shuffle the cards
    cards = shuffle(cards);

    let allCards = document.getElementsByClassName('card');
    allCards = Array.prototype.slice.call(allCards);

    // Loop over the card elements, add icons and events listeners

    allCards.forEach((cardElement, index) => {
        cardElement.innerHTML = `<i class="fa fa-${cards[index]}"
        data-name="${cards[index]}"></i>`;
        cardElement.addEventListener('click', handleCardClick);
    });

    let restartButton = document.getElementsByClassName('fa fa-repeat')[0];
    restartButton.addEventListener('click', restartGame);
};

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
