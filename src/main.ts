// –------------------------
// Variables & Constants
// –------------------------

import './styles/style.scss';

// Start screen elements
const buttonPlay = document.getElementById('button-play') as HTMLButtonElement;
const screenStart = document.getElementById('screen-start') as HTMLElement;
const screenSettings = document.getElementById('screen-settings') as HTMLElement;

// Settings screen elements
const summaryTheme = document.getElementById('summary-theme') as HTMLElement;
const summaryPlayer = document.getElementById('summary-player') as HTMLElement;
const summaryBoard = document.getElementById('summary-board') as HTMLElement;
const previewGaming = document.getElementById('preview-gaming') as HTMLElement;
const previewCode = document.getElementById('preview-code') as HTMLElement;
const themeLabels: Record<string, string> = { code: 'Theme 1', gaming: 'Theme 2'};
const boardLabels: Record<string, string> = { '16': '16', '24': '24', '36': '36'};
const buttonStart = document.getElementById('button-start') as HTMLButtonElement;
const screenGame = document.getElementById('screen-game') as HTMLElement;

// Current player images for each theme and player color
const currentPlayerImages: Record<string, Record<string, string>> = {
    code: {
        blue: './img/player-blue-arrow.svg',
        orange: './img/player-orange-arrow.svg'
    },
    gaming: {
        blue: './img/player-blue-square.svg',
        orange: './img/player-orange-square.svg'
    }
};

// Card cover images for each theme
const cardCovers: Record<string, string> = {
    code: './img/code-design-theme-card.svg',
    gaming: './img/gaming-theme-card.svg'
};

// Card images for each theme
const cardImages: Record<string, string[]> = {
    code: [
        './img/code-design-theme-angular.svg',
        './img/code-design-theme-apple.svg',
        './img/code-design-theme-bootstrap.svg',
        './img/code-design-theme-css.svg',
        './img/code-design-theme-django.svg',
        './img/code-design-theme-figma.svg',
        './img/code-design-theme-firebase.svg',
        './img/code-design-theme-git.svg',
        './img/code-design-theme-github.svg',
        './img/code-design-theme-html.svg',
        './img/code-design-theme-illustrator.svg',
        './img/code-design-theme-indesign.svg',
        './img/code-design-theme-javascript.svg',
        './img/code-design-theme-lightroom.svg',
        './img/code-design-theme-photoshop.svg',
        './img/code-design-theme-python.svg',
        './img/code-design-theme-typescript.svg',
        './img/code-design-theme-vscode.svg'
    ],
    gaming: [
        './img/gaming-theme-controller.svg',
        './img/gaming-theme-peach.svg',
        './img/gaming-theme-invador-coral.svg',
        './img/gaming-theme-diskette.svg',
        './img/gaming-theme-invador-green.svg',
        './img/gaming-theme-pacman-blue.svg',
        './img/gaming-theme-invador-darkblue.svg',
        './img/gaming-theme-invador-pink.svg',
        './img/gaming-theme-cassette.svg',
        './img/gaming-theme-cherry.svg',
        './img/gaming-theme-invador-greyblue.svg',
        './img/gaming-theme-invador-lilac.svg',
        './img/gaming-theme-invador-ocher.svg',
        './img/gaming-theme-invador-orange.svg',
        './img/gaming-theme-pacman-green.svg',
        './img/gaming-theme-invador-blue.svg',
        './img/gaming-theme-invador-sage.svg',
        './img/gaming-theme-invador-peach.svg'
    ]
};

// Game state variables
let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let lockBoard = false;

// Score and player tracking
let currentPlayer: 'blue' | 'orange' = 'blue';
let blueScore = 0;
let orangeScore = 0;
let totalCards = 0;
const screenWinner = document.getElementById('screen-winner') as HTMLElement;
const screenDraw = document.getElementById('screen-draw') as HTMLElement;
const buttonBackToStart = document.querySelectorAll('#screen-winner button, #screen-draw button');

// Exit dialog elements
const dialogExit = document.getElementById('dialog-exit') as HTMLDialogElement;
const buttonBackToGame = document.getElementById('button-back-to-game') as HTMLButtonElement;
const buttonExitGame = document.getElementById('button-exit-game') as HTMLButtonElement;

// –----------------------------
// Event Listeners & Functions
// –----------------------------

/**
 * Navigates from the start screen to the settings screen.
 * Hides the start screen and reveals the settings screen.
 */
buttonPlay.addEventListener('click', () => {
    screenStart.classList.add('d-none');
    screenSettings.classList.remove('d-none');
});

/**
 * Updates the theme preview image and summary label when a theme radio is selected.
 */
document.querySelectorAll('input[name="theme"]').forEach(input => {
    input.addEventListener('change', (e) => {
        const value = (e.target as HTMLInputElement).value;
        summaryTheme.textContent = themeLabels[value];
        if (value === 'gaming') {
            previewGaming.classList.remove('d-none');
            previewCode.classList.add('d-none');
        } else {
            previewGaming.classList.add('d-none');
            previewCode.classList.remove('d-none');
        }
    });
});

/**
 * Updates the player summary label when a player radio is selected.
 */
document.querySelectorAll('input[name="player"]').forEach(input => {
    input.addEventListener('change', (e) => {
        summaryPlayer.textContent = (e.target as HTMLInputElement).value === 'blue' ? 'Blue' : 'Orange';
    });
});

/**
 * Updates the board size summary label when a size radio is selected.
 */
document.querySelectorAll('input[name="size"]').forEach(input => {
    input.addEventListener('change', (e) => {
        summaryBoard.textContent = boardLabels[(e.target as HTMLInputElement).value];
    });
});

/**
 * Navigates from the settings screen to the game screen.
 * Hides the settings screen and reveals the game screen.
 */
buttonStart.addEventListener('click', () => {
    const theme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value;
    const player = (document.querySelector('input[name="player"]:checked') as HTMLInputElement).value;
    const size = parseInt((document.querySelector('input[name="size"]:checked') as HTMLInputElement).value);
    document.body.classList.remove('theme-gaming', 'theme-code');
    document.body.classList.add(`theme-${theme}`);
    currentPlayer = player as 'blue' | 'orange';
    blueScore = 0;
    orangeScore = 0;
    totalCards = size;
    updateScoreUI();
    updateCurrentPlayerUI();
    const currentPlayerImg = document.querySelector('.current-player img') as HTMLImageElement;
    currentPlayerImg.src = currentPlayerImages[theme][player];
    const cards = generateCards(theme, size);
    renderBoard(cards, theme);
    screenSettings.classList.add('d-none');
    screenGame.classList.remove('d-none');
});

/**
 * Generates a shuffled array of card pairs based on the selected theme and board size.
 */
function generateCards(theme: string, size: number): string[] {
    const needed = size / 2;
    const images = cardImages[theme].slice(0, needed);
    const pairs = [...images, ...images];
    return pairs.sort(() => Math.random() - 0.5);
}

/**
 * Renders the game board with the given cards.
 */
function renderBoard(cards: string[], theme: string): void {
    const board = document.querySelector('.game-board') as HTMLElement;
    board.innerHTML = '';
    const cols = cards.length === 16 ? 4 : 6;
    const cardWidth = theme === 'gaming'
        ? (cards.length === 16 ? '110px' : '90px')
        : (cards.length === 16 ? '120px' : '100px');
    board.style.gridTemplateColumns = `repeat(${cols}, ${cardWidth})`;
    cards.forEach((imgSrc) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${cardCovers[theme]}" alt="">
                </div>
                <div class="card-back">
                    <img src="${imgSrc}" alt="">
                </div>
            </div>
        `;
        card.addEventListener('click', () => handleCardClick(card));
        board.appendChild(card);
    });
}

/**
 * Checks whether the two flipped cards are a matching pair.
 */
function isMatch(): boolean {
    const firstImg = firstCard!.querySelector('.card-back img') as HTMLImageElement;
    const secondImg = secondCard!.querySelector('.card-back img') as HTMLImageElement;
    return firstImg.src === secondImg.src;
}

/**
 * Locks matched cards in place and adds the matched style.
 */
function lockMatchedCards(): void {
    firstCard!.classList.add('matched');
    secondCard!.classList.add('matched');
    if (currentPlayer === 'blue') {
        blueScore++;
    } else {
        orangeScore++;
    }
    updateScoreUI();
    resetSelection();
    checkGameOver();
}

/**
 * Flips unmatched cards back after a short delay.
 */
function flipBackUnmatched(): void {
    setTimeout(() => {
        firstCard!.classList.remove('flipped');
        secondCard!.classList.remove('flipped');
        resetSelection();
        switchPlayer();
    }, 1000);
}

/**
 * Resets the current card selection and unlocks the board.
 */
function resetSelection(): void {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

/**
 * Handles card flip logic: flips cards, checks for match,
 * and either locks matched cards or flips them back.
 */
function handleCardClick(card: HTMLElement): void {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains('matched')) return;
    card.classList.add('flipped');
    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    lockBoard = true;
    if (isMatch()) {
        lockMatchedCards();
    } else {
        flipBackUnmatched();
    }
}

/**
 * Updates the score display for both players in the UI.
 */
function updateScoreUI(): void {
    document.querySelector('.score-player.blue .player-score')!.textContent = blueScore.toString();
    document.querySelector('.score-player.orange .player-score')!.textContent = orangeScore.toString();
}

/**
 * Updates the current player indicator based on active player and theme.
 */
function updateCurrentPlayerUI(): void {
    const img = document.querySelector('.current-player img') as HTMLImageElement;
    const theme = document.body.classList.contains('theme-gaming') ? 'gaming' : 'code';
    img.src = currentPlayerImages[theme][currentPlayer];
}

/**
 * Switches the active player and updates the UI.
 */
function switchPlayer(): void {
    currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayerUI();
}

/**
 * Checks if all cards are matched and displays the result screen (winner or draw) after a short delay.
 */
function checkGameOver(): void {
    const matchedCards = document.querySelectorAll('.card.matched').length;
    if (matchedCards !== totalCards) return;
    setTimeout(() => {
        screenGame.classList.add('d-none');
        if (blueScore === orangeScore) {
            screenDraw.classList.remove('d-none');
            return;
        }
        screenWinner.classList.remove('d-none');
        const winnerText = screenWinner.querySelector('h1') as HTMLElement;
        const winnerTrophy = screenWinner.querySelector('.trophy') as HTMLImageElement;
        if (blueScore > orangeScore) {
            winnerText.textContent = 'BLUE PLAYER';
            winnerText.classList.remove('winner-orange');
            winnerText.classList.add('winner-blue');
            winnerTrophy.src = './img/player-blue.svg';
        } else {
            winnerText.textContent = 'ORANGE PLAYER';
            winnerText.classList.remove('winner-blue');
            winnerText.classList.add('winner-orange');
            winnerTrophy.src = './img/player-orange.svg';
        }
    }, 800);
}

/**
 * Adds a click event listener to each "back to start" button.
 * When clicked, all game-related screens (winner, draw, game) are hidden and the settings screen is shown again.
 */
buttonBackToStart.forEach(button => {
    button.addEventListener('click', () => {
        screenWinner.classList.add('d-none');
        screenDraw.classList.add('d-none');
        screenGame.classList.add('d-none');
        screenSettings.classList.remove('d-none');
    });
});

/**
 * Exit Game button in header opens the dialog.
 */ 
document.querySelector('.button-exit')?.addEventListener('click', () => {
    dialogExit.showModal();
});

/**
 * Closes the exit dialog and returns to the game.
 */
buttonBackToGame.addEventListener('click', () => {
    dialogExit.close();
});

/**
 * Closes the dialog and navigates back to the settings screen.
 */
buttonExitGame.addEventListener('click', () => {
    dialogExit.close();
    screenGame.classList.add('d-none');
    screenSettings.classList.remove('d-none');
});