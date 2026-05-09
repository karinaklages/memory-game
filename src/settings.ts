// –------------------------
// Variables & Constants
// –------------------------

export const buttonPlay = document.getElementById('button-play') as HTMLButtonElement;
export const screenStart = document.getElementById('screen-start') as HTMLElement;
export const screenSettings = document.getElementById('screen-settings') as HTMLElement;
export const summaryTheme = document.getElementById('summary-theme') as HTMLElement;
export const summaryPlayer = document.getElementById('summary-player') as HTMLElement;
export const summaryBoard = document.getElementById('summary-board') as HTMLElement;
export const previewGaming = document.getElementById('preview-gaming') as HTMLElement;
export const previewCode = document.getElementById('preview-code') as HTMLElement;
export const buttonStart = document.getElementById('button-start') as HTMLButtonElement;

export const themeLabels: Record<string, string> = { code: 'Theme 1', gaming: 'Theme 2' };
export const boardLabels: Record<string, string> = { '16': '16', '24': '24', '36': '36' };

// –----------------------------
// Functions & Event Listeners
// –----------------------------

/** 
 * Reads and returns the selected theme, player and size from the settings form.
 */
export function getSettings(): { theme: string; player: string; size: number } {
    const theme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value;
    const player = (document.querySelector('input[name="player"]:checked') as HTMLInputElement).value;
    const size = parseInt((document.querySelector('input[name="size"]:checked') as HTMLInputElement).value);
    return { theme, player, size };
}

/**
 * Applies the selected theme to the body element.
 */
export function applyTheme(theme: string): void {
    document.body.classList.remove('theme-gaming', 'theme-code');
    document.body.classList.add(`theme-${theme}`);
}

/**
 * Enables the start button only when all three setting groups (theme, player, board size) have a selected value.
 */
export function checkAllSelected(): void {
    const theme = document.querySelector('input[name="theme"]:checked');
    const player = document.querySelector('input[name="player"]:checked');
    const size = document.querySelector('input[name="size"]:checked');
    buttonStart.disabled = !(theme && player && size);
}

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
 * Listens for changes on all radio inputs and re-evaluates whether the start button should be enabled.
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