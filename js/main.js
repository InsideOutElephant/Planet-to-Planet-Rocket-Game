/**
 * Main entry point for the game
 */

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Hide game elements initially
    document.getElementById('gameCanvas').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.game-info').style.display = 'none';
    document.getElementById('levelIndicator').style.display = 'none';
    
    // Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Initialize game components
    initEntities(canvas);
    initRenderer(ctx);
    setupInputHandlers();
    
    // Load saved progress
    initLevelProgress();
    
    // Setup main menu buttons
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('startScreen').style.display = 'none';
        
        // Show game elements
        document.getElementById('gameCanvas').style.display = 'block';
        document.querySelector('.controls').style.display = 'flex';
        document.querySelector('.game-info').style.display = 'block';
        
        startLevel(1); // Start with level 1
    });
    
    document.getElementById('levelSelectButton').addEventListener('click', () => {
        showLevelSelectScreen();
    });
    
    // Load the first level configuration
    loadLevelConfig(getLevel(1));
    
    // Reset the game to initial state
    resetGame();
    
    // Start with intro animation
    currentState = GAME_STATE.INTRO;
    
    // Start the game loop
    let lastTime = 0;
    
    function gameLoop(timestamp) {
        // Calculate delta time (in seconds)
        const deltaTime = Math.min(0.05, (timestamp - lastTime) / 1000); // Cap at 50ms
        lastTime = timestamp;
        
        // Update game state
        updateGame(deltaTime);
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
});