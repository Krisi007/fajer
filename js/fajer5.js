const suits = ['Piros', 'Zöld', 'Tök', 'Makk'];
const ranks = [7, 8, 9, 10, 'Alsó', 'Felső', 'Király', 'Ász'];

let deck = [];
let players = [];
let bids = [];
let bank = 0;

function initializeDeck() {
    deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank} (${suit})`);
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards() {
    players = [];
    for (let i = 0; i < 5; i++) { 
        const playerCards = [];
        for (let j = 0; j < 3; j++) { 
            playerCards.push(deck.pop());
        }
        players.push(playerCards);
    }
    bids = Array(5).fill(0); 
}

function renderPlayerCards() {
    const topRow = document.getElementById('top-row');
    const bottomRow = document.getElementById('bottom-row');
    topRow.innerHTML = '';
    bottomRow.innerHTML = '';

    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        const playerTitle = document.createElement('div');
        playerTitle.textContent = `Játékos ${index + 1}`;
        playerDiv.appendChild(playerTitle);

        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'cards';
        player.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.textContent = card;
            cardsDiv.appendChild(cardElement);
        });

        playerDiv.appendChild(cardsDiv);

        if (index < 3) {
            topRow.appendChild(playerDiv);
        } else {
            bottomRow.appendChild(playerDiv);
        }
    });
}

function startGame() {
    initializeDeck();
    shuffleDeck();
    dealCards();
    renderPlayerCards();
    document.getElementById('message').textContent = 'A játék elkezdődött!';
    document.getElementById('winner').textContent = '';
    document.getElementById('bids').innerHTML = '';
}

function nextRound() {
    if (deck.length < 15) { 
        document.getElementById('message').textContent = 'Nincs elég lap a következő körhöz!';
        return;
    }
    dealCards();
    renderPlayerCards();
    document.getElementById('message').textContent = 'Új kör kezdődött!';
    document.getElementById('winner').textContent = '';
    document.getElementById('bids').innerHTML = '';
}

function bidPhase() {
    bids = players.map(() => Math.floor(Math.random() * 100) + 1); 
    const bidsContainer = document.getElementById('bids');
    bidsContainer.innerHTML = '<h3>Licitálás</h3>';
    bids.forEach((bid, index) => {
        const bidDiv = document.createElement('div');
        bidDiv.textContent = `Játékos ${index + 1}: ${bid} pont`;
        bidsContainer.appendChild(bidDiv);
        bank += bid; 
    });
    document.getElementById('bank').textContent = bank;
    document.getElementById('message').textContent = 'Licitálás lezárult!';
}

function calculateHandValue(cards) {
    const cardValues = {
        '7': 7, '8': 8, '9': 9, '10': 10,
        'Alsó': 10, 'Felső': 10, 'Király': 10, 'Ász': 11
    };
    return cards.reduce((sum, card) => {
        const rank = card.split(' ')[0];
        return sum + (cardValues[rank] || 0);
    }, 0);
}

function Winner() {
    const handValues = players.map(calculateHandValue);
    const maxBid = Math.max(...bids);
    const highestBidder = bids.indexOf(maxBid);

    let winnerIndex = highestBidder;
    if (handValues.filter(value => value === handValues[highestBidder]).length > 1) {
        winnerIndex = players.length - 1; 
    }

    document.getElementById('winner').textContent = `A győztes: Játékos ${winnerIndex + 1}! Nyeremény: ${bank} $.`;
    document.getElementById('message').textContent = 'A játék véget ért!';
    bank = 0; 
    document.getElementById('bank').textContent = bank;
}