import './settings';
import './game';

// –--------------------
// Event Listeners
// –--------------------

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