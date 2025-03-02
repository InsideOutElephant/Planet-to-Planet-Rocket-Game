/**
 * Core game logic and state management
 */

/**
 * Update game state for a single frame
 * @param {number} deltaTime - Time elapsed since last update in seconds
 */
function updateGame(deltaTime) {
    switch (currentState) {
        case GAME_STATE.INTRO:
            introProgress += deltaTime * 0.4; // Control intro speed
            if (introProgress >= 1) {
                introProgress = 1;
                currentState = GAME_STATE.PLAYING;
            }
            drawIntroAnimation(introProgress);
            break;
            
        case GAME_STATE.PLAYING:
            if (gameActive) {
                // Update game time
                if (rocket.active) {
                    gameTime += deltaTime;
                    document.getElementById('timer').textContent = gameTime.toFixed(1);
                    
                    // Update time display color as time runs out
                    const timeElement = document.getElementById('timer');
                    const timeRatio = gameTime / maxGameTime;
                    
                    if (timeRatio > 0.75) {
                        timeElement.style.color = '#f44336'; // Red when < 25% time left
                    } else if (timeRatio > 0.5) {
                        timeElement.style.color = '#ff9800'; // Orange when < 50% time left
                    } else {
                        timeElement.style.color = 'white'; // Default color
                    }
                }
                
                // Update game objects
                updatePlanetPositions(deltaTime);
                updateRocket(deltaTime);
            }
            
            // Always update particles
            updateParticles(deltaTime);
            
            // Draw everything
            draw();
            break;
            
        case GAME_STATE.WIN:
            winAnimProgress += deltaTime * 0.5;
            if (winAnimProgress > 1) winAnimProgress = 1;
            
            updateParticles(deltaTime);
            drawWinAnimation(winAnimProgress);
            break;
            
        case GAME_STATE.LOSE:
            loseAnimProgress += deltaTime * 0.5;
            if (loseAnimProgress > 1) loseAnimProgress = 1;
            
            updateParticles(deltaTime);
            drawLoseAnimation(loseAnimProgress);
            break;
    }
}