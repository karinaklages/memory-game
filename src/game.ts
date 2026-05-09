// –------------------------
// Variables & Constants
// –------------------------

import { screenSettings } from './settings';

export const screenGame = document.getElementById('screen-game') as HTMLElement;
export const screenGameover = document.getElementById('screen-gameover') as HTMLElement;
export const screenWinner = document.getElementById('screen-winner') as HTMLElement;
export const screenDraw = document.getElementById('screen-draw') as HTMLElement;
export const buttonBackToStart = document.querySelectorAll('#screen-winner button, #screen-draw button');
export const dialogExit = document.getElementById('dialog-exit') as HTMLDialogElement;
export const buttonBackToGame = document.getElementById('button-back-to-game') as HTMLButtonElement;
export const buttonExitGame = document.getElementById('button-exit-game') as HTMLButtonElement;

export const currentPlayerImages: Record<string, Record<string, string>> = {
    code: {
        blue: './img/player-blue-arrow.svg',
        orange: './img/player-orange-arrow.svg'
    },
    gaming: {
        blue: './img/player-blue-square.svg',
        orange: './img/player-orange-square.svg'
    }
};

export const cardCovers: Record<string, string> = {
    code: './img/code-design-theme-card.svg',
    gaming: './img/gaming-theme-card.svg'
};

export const cardImages: Record<string, string[]> = {
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

export let firstCard: HTMLElement | null = null;
export let secondCard: HTMLElement | null = null;
export let lockBoard = false;
export let currentPlayer: 'blue' | 'orange' = 'blue';
export let selectedPlayer: 'blue' | 'orange' = 'blue';
export let blueScore = 0;
export let orangeScore = 0;
export let totalCards = 0;

// –----------------------------
// Functions & Event Listeners
// –----------------------------

/** 
 * Resets all game state variables to their initial values.
 */
export function resetGameState(player: string, size: number): void {
    currentPlayer = player as 'blue' | 'orange';
    selectedPlayer = player as 'blue' | 'orange';
    blueScore = 0;
    orangeScore = 0;
    totalCards = size;
}

/**
 * Updates the current player image based on theme and player.
 */
export function updateCurrentPlayerImg(theme: string, player: string): void {
    const img = document.querySelector('.current-player img') as HTMLImageElement;
    img.src = currentPlayerImages[theme][player];
}

/**
 * Generates a shuffled array of card pairs based on the selected theme and board size.
 */
export function generateCards(theme: string, size: number): string[] {
    const needed = size / 2;
    const images = cardImages[theme].slice(0, needed);
    const pairs = [...images, ...images];
    return pairs.sort(() => Math.random() - 0.5);
}

/**
 * Returns the number of grid columns based on card count. 
 */
export function getColumnCount(cardCount: number): number {
    return cardCount === 16 ? 4 : 6;
}

/**
 * Returns the card width based on theme and card count.
 */
export function getCardWidth(theme: string, cardCount: number): string {
    const isGaming = theme === 'gaming';
    const isSmall = cardCount === 16;
    if (isGaming) return isSmall ? '110px' : '90px';
    return isSmall ? '120px' : '100px';
}

/**
 * Creates and returns a single card element.
 */
export function createCardElement(imgSrc: string, theme: string): HTMLElement {
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
export function renderBoard(cards: string[], theme: string): void {
    const board = document.querySelector('.game-board') as HTMLElement;
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${getColumnCount(cards.length)}, ${getCardWidth(theme, cards.length)})`;
    cards.forEach(imgSrc => board.appendChild(createCardElement(imgSrc, theme)));
}

/**
 * Checks whether the two flipped cards are a matching pair.
 */
export function isMatch(): boolean {
    const firstImg = firstCard!.querySelector('.card-back img') as HTMLImageElement;
    const secondImg = secondCard!.querySelector('.card-back img') as HTMLImageElement;
    return firstImg.src === secondImg.src;
}

/**
 * Locks matched cards in place and adds the matched style.
 */
export function lockMatchedCards(): void {
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
export function flipBackUnmatched(): void {
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
export function resetSelection(): void {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

/**
 * Returns true if the card should not be processed.
 */
export function shouldIgnoreClick(card: HTMLElement): boolean {
    return lockBoard || card === firstCard || card.classList.contains('matched');
}

/**
 * Handles card flip logic: flips cards, checks for match, and either locks matched cards or flips them back.
 */
export function handleCardClick(card: HTMLElement): void {
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
export function updateScoreUI(): void {
    document.querySelector('.score-player.blue .player-score')!.textContent = blueScore.toString();
    document.querySelector('.score-player.orange .player-score')!.textContent = orangeScore.toString();
}

/**
 * Updates the current player indicator based on active player and theme.
 */
export function updateCurrentPlayerUI(): void {
    const img = document.querySelector('.current-player img') as HTMLImageElement;
    const theme = document.body.classList.contains('theme-gaming') ? 'gaming' : 'code';
    img.src = currentPlayerImages[theme][currentPlayer];
}

/**
 * Switches the active player and updates the UI.
 */
export function switchPlayer(): void {
    currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayerUI();
}

/**
 * Checks if all cards have been matched.
 */
export function isGameOver(): boolean {
    return document.querySelectorAll('.card.matched').length === totalCards;
}

/**
 * Hides the game screen and shows the appropriate end screen.
 * Shows the draw screen on a tie, the winner screen if the selected player won, or the game over screen if the selected player lost.
 */
export function showEndScreen(): void {
    screenGame.classList.add('d-none');
    updateGameoverScore();
    if (blueScore === orangeScore) {
        screenDraw.classList.remove('d-none');
    } else {
        const selectedPlayerWins =
            (selectedPlayer === 'blue' && blueScore > orangeScore) ||
            (selectedPlayer === 'orange' && orangeScore > blueScore);
        if (selectedPlayerWins) {
            showWinnerScreen();
        } else {
            screenGameover.classList.remove('d-none');
            setTimeout(() => showWinnerScreen(), 2000);
        }
    }
}

/**
 * Transfers the final scores of both players to the game over screen.
 */
export function updateGameoverScore(): void {
    const blueScoreEl = document.getElementById('gameover-score-blue') as HTMLElement;
    const orangeScoreEl = document.getElementById('gameover-score-orange') as HTMLElement;
    blueScoreEl.textContent = blueScore.toString();
    orangeScoreEl.textContent = orangeScore.toString();
}

/**
 * Updates the winner screen with the correct player name, color and trophy.
 */
export function showWinnerScreen(): void {
    screenWinner.classList.remove('d-none');
    screenWinner.style.animation = 'none';
    screenWinner.offsetHeight;
    screenWinner.style.animation = '';
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
export function checkGameOver(): void {
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