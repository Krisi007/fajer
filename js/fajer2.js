const kartyak = ['Piros', 'Zöld', 'Tök', 'Makk'];
const ertekek = [7, 8, 9, 10, 'Alsó', 'Felső', 'Király', 'Ász'];

let pakli = [];
let jatekosok = [];
let tetek = [];
let bank = 0;

function initializeDeck() {
    pakli = [];
    for (const kartya of kartyak) {
        for (const ertek of ertekek) {
            pakli.push(`${ertek} (${kartya})`);
        }
    }
}

function shuffleDeck() {
    for (let i = pakli.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pakli[i], pakli[j]] = [pakli[j], pakli[i]];
    }
}

function dealCards() {
    jatekosok = [];
    for (let i = 0; i < 2; i++) { 
        const playerCards = [];
        for (let j = 0; j < 3; j++) { 
            playerCards.push(pakli.pop());
        }
        jatekosok.push(playerCards);
    }
    tetek = Array(2).fill(0); 
}

function renderPlayerCards() {
    const topRow = document.getElementById('top-row');
    const bottomRow = document.getElementById('bottom-row');
    topRow.innerHTML = '';
    bottomRow.innerHTML = '';

    jatekosok.forEach((jatekos, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        const playerTitle = document.createElement('div');
        playerTitle.textContent = `Játékos ${index + 1}`;
        playerDiv.appendChild(playerTitle);

        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'cards';
        jatekos.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.textContent = card;
            cardsDiv.appendChild(cardElement);
        });

        playerDiv.appendChild(cardsDiv);

        if (index === 0) {
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
    if (pakli.length < 6) { 
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
    tetek = jatekosok.map(() => Math.floor(Math.random() * 100) + 1); 
    const bidsContainer = document.getElementById('bids');
    bidsContainer.innerHTML = '<h3>Licitálás</h3>';
    tetek.forEach((tet, index) => {
        const bidDiv = document.createElement('div');
        bidDiv.textContent = `Játékos ${index + 1}: ${tet} $`;
        bidsContainer.appendChild(bidDiv);
        bank += tet;
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
    const handValues = jatekosok.map(calculateHandValue);
    const maxBid = Math.max(...tetek);
    const highestBidder = tetek.indexOf(maxBid);

    let winnerIndex = highestBidder;
    if (handValues.filter(value => value === handValues[highestBidder]).length > 1) {
        winnerIndex = jatekosok.length - 1; 
    }

    document.getElementById('winner').textContent = `A győztes: Játékos ${winnerIndex + 1}! Nyeremény: ${bank} $.`;
    document.getElementById('message').textContent = 'A játék véget ért!';
    bank = 0;
    document.getElementById('bank').textContent = bank;
}