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
const themeLabels: Record<string, string> = { gaming: 'Theme 1', code: 'Theme 2'};
const boardLabels: Record<string, string> = { '16': '16', '24': '24', '36': '36'};
const buttonStart = document.getElementById('button-start') as HTMLButtonElement;
const screenGame = document.getElementById('screen-game') as HTMLElement;

// Card images for each theme
const cardImages: Record<string, string[]> = {
    gaming: [
        '/img/code-design-theme-angular.svg',
        '/img/code-design-theme-apple.svg',
        '/img/code-design-theme-bootstrap.svg',
        '/img/code-design-theme-css.svg',
        '/img/code-design-theme-django.svg',
        '/img/code-design-theme-figma.svg',
        '/img/code-design-theme-firebase.svg',
        '/img/code-design-theme-git.svg',
        '/img/code-design-theme-github.svg',
        '/img/code-design-theme-html.svg',
        '/img/code-design-theme-illustrator.svg',
        '/img/code-design-theme-indesign.svg',
        '/img/code-design-theme-javascript.svg',
        '/img/code-design-theme-lightroom.svg',
        '/img/code-design-theme-photoshop.svg',
        '/img/code-design-theme-python.svg',
        '/img/code-design-theme-typescript.svg',
        '/img/code-design-theme-vscode.svg'
    ],
    code: [
        '/img/gaming-theme-controller.svg',
        '/img/gaming-theme-peach.svg',
        '/img/gaming-theme-invador-coral.svg',
        '/img/gaming-theme-invador-blue.svg',
        '/img/gaming-theme-invador-green.svg',
        '/img/gaming-theme-pacman-blue.svg',
        '/img/gaming-theme-invador-darkblue.svg',
        '/img/gaming-theme-invador-pink.svg',
        '/img/gaming-theme-cassette.svg',
        '/img/gaming-theme-cherry.svg',
        '/img/gaming-theme-invador-greyblue.svg',
        '/img/gaming-theme-invador-lilac.svg',
        '/img/gaming-theme-invador-ocher.svg',
        '/img/gaming-theme-invador-orange.svg',
        '/img/gaming-theme-pacman-green.svg',
        '/img/gaming-theme-diskette.svg',
        '/img/gaming-theme-invador-sage.svg',
        '/img/gaming-theme-invador-peach.svg'
    ]
};


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
// buttonStart.addEventListener('click', () => {
//     screenSettings.classList.add('d-none');
//     screenGame.classList.remove('d-none');
// });
buttonStart.addEventListener('click', () => {
    const theme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value;
    const size = parseInt((document.querySelector('input[name="size"]:checked') as HTMLInputElement).value);
    const cards = generateCards(theme, size);
    renderBoard(cards);
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
function renderBoard(cards: string[]): void {
    const board = document.querySelector('.game-board') as HTMLElement;
    board.innerHTML = '';
    const cols = cards.length === 16 ? 4 : 6;
    const cardSize = cards.length === 16 ? '120px' : '100px';
    board.style.gridTemplateColumns = `repeat(${cols}, ${cardSize})`;
    cards.forEach((imgSrc) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="/img/code-design-theme-card.svg" alt="">
                </div>
                <div class="card-back">
                    <img src="${imgSrc}" alt="">
                </div>
            </div>
        `;
        board.appendChild(card);
    });
}