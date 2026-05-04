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