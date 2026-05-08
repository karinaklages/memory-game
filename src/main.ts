// –------------------------
// Variables & Constants
// –------------------------

import './styles/style.scss';

const buttonPlay = document.getElementById('button-play') as HTMLButtonElement;
const screenStart = document.getElementById('screen-start') as HTMLElement;
const screenSettings = document.getElementById('screen-settings') as HTMLElement;
const summaryTheme = document.getElementById('summary-theme') as HTMLElement;
const summaryPlayer = document.getElementById('summary-player') as HTMLElement;
const summaryBoard = document.getElementById('summary-board') as HTMLElement;
const previewGaming = document.getElementById('preview-gaming') as HTMLElement;
const previewCode = document.getElementById('preview-code') as HTMLElement;
const themeLabels: Record<string, string> = { code: 'Theme 1', gaming: 'Theme 2'};
const boardLabels: Record<string, string> = { '16': '16', '24': '24', '36': '36'};
const buttonStart = document.getElementById('button-start') as HTMLButtonElement;
const screenGame = document.getElementById('screen-game') as HTMLElement;

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

const cardCovers: Record<string, string> = {
    code: './img/code-design-theme-card.svg',
    gaming: './img/gaming-theme-card.svg'
};

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

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let lockBoard = false;
let currentPlayer: 'blue' | 'orange' = 'blue';
let blueScore = 0;
let orangeScore = 0;
let totalCards = 0;
const screenWinner = document.getElementById('screen-winner') as HTMLElement;
const screenDraw = document.getElementById('screen-draw') as HTMLElement;
const buttonBackToStart = document.querySelectorAll('#screen-winner button, #screen-draw button');
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
 * Reads and returns the selected theme, player and size from the settings form.
 */
function getSettings(): { theme: string; player: string; size: number } {
    const theme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value;
    const player = (document.querySelector('input[name="player"]:checked') as HTMLInputElement).value;
    const size = parseInt((document.querySelector('input[name="size"]:checked') as HTMLInputElement).value);
    return { theme, player, size };
}

/**
 * Applies the selected theme to the body element.
 */
function applyTheme(theme: string): void {
    document.body.classList.remove('theme-gaming', 'theme-code');
    document.body.classList.add(`theme-${theme}`);
}

/**
 * Enables the start button only when all three setting groups
 * (theme, player, board size) have a selected value.
 */
function checkAllSelected(): void {
    const theme = document.querySelector('input[name="theme"]:checked');
    const player = document.querySelector('input[name="player"]:checked');
    const size = document.querySelector('input[name="size"]:checked');
    buttonStart.disabled = !(theme && player && size);
}

/**
 * Listens for changes on all radio inputs and re-evaluates
 * whether the start button should be enabled.
 */
document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', checkAllSelected);
});

/**
 * Updates the theme preview image on hover over a theme label.
 * Shows the gaming or code design preview based on the hovered option.
 */
document.querySelectorAll('input[name="theme"]').forEach(input => {
    const label = input.closest('label');
    label?.addEventListener('mouseenter', () => {
        const value = (input as HTMLInputElement).value;
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
 * Resets all game state variables to their initial values.
 */
function resetGameState(player: string, size: number): void {
    currentPlayer = player as 'blue' | 'orange';
    blueScore = 0;
    orangeScore = 0;
    totalCards = size;
}

/**
 * Updates the current player image based on theme and player.
 */
function updateCurrentPlayerImg(theme: string, player: string): void {
    const img = document.querySelector('.current-player img') as HTMLImageElement;
    img.src = currentPlayerImages[theme][player];
}

/**
 * Navigates from the settings screen to the game screen.
 */
buttonStart.addEventListener('click', () => {
    const { theme, player, size } = getSettings();
    applyTheme(theme);
    resetGameState(player, size);
    updateScoreUI();
    updateCurrentPlayerUI();
    updateCurrentPlayerImg(theme, player);
    renderBoard(generateCards(theme, size), theme);
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
 * Returns the number of grid columns based on card count. 
 */
function getColumnCount(cardCount: number): number {
    return cardCount === 16 ? 4 : 6;
}

/**
 * Returns the card width based on theme and card count.
 */
function getCardWidth(theme: string, cardCount: number): string {
    const isGaming = theme === 'gaming';
    const isSmall = cardCount === 16;
    if (isGaming) return isSmall ? '110px' : '90px';
    return isSmall ? '120px' : '100px';
}

/**
 * Creates and returns a single card element.
 */
function createCardElement(imgSrc: string, theme: string): HTMLElement {
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
    return card;
}

/**
 * Renders the game board with the given cards.
 */
function renderBoard(cards: string[], theme: string): void {
    const board = document.querySelector('.game-board') as HTMLElement;
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${getColumnCount(cards.length)}, ${getCardWidth(theme, cards.length)})`;
    cards.forEach(imgSrc => board.appendChild(createCardElement(imgSrc, theme)));
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
 * Returns true if the card should not be processed.
 */
function shouldIgnoreClick(card: HTMLElement): boolean {
    return lockBoard || card === firstCard || card.classList.contains('matched');
}

/**
 * Handles card flip logic: flips cards, checks for match,
 * and either locks matched cards or flips them back.
 */
function handleCardClick(card: HTMLElement): void {
    if (shouldIgnoreClick(card)) return;
    card.classList.add('flipped');
    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    lockBoard = true;
    isMatch() ? lockMatchedCards() : flipBackUnmatched();
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
 * Checks if all cards have been matched.
 */
function isGameOver(): boolean {
    return document.querySelectorAll('.card.matched').length === totalCards;
}

/**
 * Hides the game screen and shows the appropriate end screen.
 */
function showEndScreen(): void {
    screenGame.classList.add('d-none');
    if (blueScore === orangeScore) {
        screenDraw.classList.remove('d-none');
    } else {
        showWinnerScreen();
    }
}

/**
 * Updates the winner screen with the correct player name, color and trophy.
 */
function showWinnerScreen(): void {
    screenWinner.classList.remove('d-none');
    const winnerText = screenWinner.querySelector('h1') as HTMLElement;
    const winnerTrophy = screenWinner.querySelector('.trophy') as HTMLImageElement;
    const blueWins = blueScore > orangeScore;
    winnerText.textContent = blueWins ? 'BLUE PLAYER' : 'ORANGE PLAYER';
    winnerText.classList.toggle('winner-blue', blueWins);
    winnerText.classList.toggle('winner-orange', !blueWins);
    winnerTrophy.src = blueWins ? './img/player-blue.svg' : './img/player-orange.svg';
}

/**
 * Checks if the game is over and triggers the end screen after a short delay.
 */
function checkGameOver(): void {
    if (!isGameOver()) return;
    setTimeout(showEndScreen, 800);
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