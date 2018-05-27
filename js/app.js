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
    let clickedCard = e.target.childNodes[0].dataset.name;

    if (blockedCards.includes(clickedCard)) {
        return;
    }

    console.log('WE MUST OPEN IT');
    e.target.classList.add('open');
    e.target.classList.add('show');

    if (openedCards.length === 0) {
        // No cards were previously open
        openedCards.push(clickedCard);
        return;
    }

    let indexOfOpenedCard = openedCards.indexOf(clickedCard);
    if (indexOfOpenedCard > -1) {
        // The other card with same icon had already been opened, we have a match!
        openedCards.splice(indexOfOpenedCard, 1);
        blockedCards.push(clickedCard);

        setTimeout(() => {
            // 1. TODO ADD MATCH CLASS TO BOTH CARDS WITH SAME ICON
            // 2. TODO CHECK IF THE USER WON
        }, 1000);
    } else {
        // Another icon had previously been opened
        setTimeout(() => {
            // TODO Also the other icon must be closed
            removeClasses(e.target);
        }, 1000);
    }
    console.log('Blocked ', blockedCards);
}

function removeClasses(element) {
    element.classList.remove('open');
    element.classList.remove('show');
}

window.onload = function() {
    // Shuffle the cards

    cards = shuffle(cards);

    let selectedCards = document.getElementsByClassName('card');
    selectedCards = Array.prototype.slice.call(selectedCards);
    console.log(selectedCards);

    // Loop over the card elements, add icons and events listeners

    selectedCards.forEach((selectedCard, index) => {
        selectedCard.innerHTML = `<i class="fa fa-${cards[index]}"
        data-name="${cards[index]}"></i>`;
        selectedCard.addEventListener('click', handleCardClick);
    });
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
