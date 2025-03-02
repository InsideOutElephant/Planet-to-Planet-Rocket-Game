/**
 * Input handling for the game
 */

/**
 * Setup event listeners for user input
 */
function setupInputHandlers() {
    // Start button 
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('startScreen').style.display = 'none';
        currentState = GAME_STATE.PLAYING;
    });
    
    // Speed input slider
    document.getElementById('speedInput').addEventListener('input', () => {
        rocket.speed = parseInt(document.getElementById('speedInput').value);
        document.getElementById('speedValue').textContent = rocket.speed;
    });
    
    // Combined launch/boost button
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.addEventListener('click', handleActionButton);
    
    // Reset/retry button
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // Keyboard controls - modified to check if we're in the editor or typing in an input
    document.addEventListener('keydown', (e) => {
        // Don't process keyboard shortcuts if typing in an input field
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' ||
            document.getElementById('levelEditorScreen').style.display === 'flex') {
            return;
        }
        
        if (e.code === 'Space') {
            handleActionButton();
        } else if (e.code === 'KeyR') {
            resetGame();
        }
    });
}

/**
 * Handle the combined launch/boost action button
 */
function handleActionButton() {
    const actionBtn = document.getElementById('actionBtn');
    
    if (!rocket.active && gameActive) {
        // Launch the rocket
        launchRocket();
        // Update button text
        actionBtn.textContent = 'Boost Rocket 🔥';
    } else if (rocket.active && gameActive && rocket.fuel > 0) {
        // Boost the rocket
        boostRocket();
    }
}