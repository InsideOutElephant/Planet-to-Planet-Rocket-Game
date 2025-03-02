/**
 * Level selection screen functionality
 */

let currentLevel = 1;
let unlockedLevels = 1; // Start with only level 1 unlocked
let levelStars = {}; // Object to store star ratings for each level

/**
 * Initialize level progress from localStorage if available
 */
function initLevelProgress() {
    const savedProgress = localStorage.getItem('rocketGameProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            unlockedLevels = progress.unlockedLevels || 1;
            levelStars = progress.stars || {};
        } catch (e) {
            console.error('Error loading saved progress:', e);
            unlockedLevels = 1;
            levelStars = {};
        }
    }
}

/**
 * Save level progress to localStorage
 */
function saveLevelProgress() {
    try {
        const progress = {
            unlockedLevels: unlockedLevels,
            stars: levelStars
        };
        localStorage.setItem('rocketGameProgress', JSON.stringify(progress));
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

/**
 * Unlock the next level
 * @param {number} completedLevel - The level that was just completed
 * @param {number} stars - Star rating earned (1-3)
 * @returns {boolean} - Whether a new level was unlocked
 */
function unlockNextLevel(completedLevel, stars) {
    // Save star rating
    levelStars[completedLevel] = Math.max(stars, levelStars[completedLevel] || 0);
    
    let newUnlock = false;
    if (completedLevel >= unlockedLevels && completedLevel < getMaxLevel()) {
        unlockedLevels = completedLevel + 1;
        newUnlock = true;
    }
    
    saveLevelProgress();
    return newUnlock;
}

/**
 * Get the star rating for a specific level
 * @param {number} levelId - The level ID
 * @returns {number} - Star rating (0-3), 0 if level not completed
 */
function getLevelStars(levelId) {
    return levelStars[levelId] || 0;
}

/**
 * Create star rating HTML elements
 * @param {number} stars - Number of stars (0-3)
 * @param {boolean} large - Whether to use large stars
 * @returns {HTMLElement} - Star rating container
 */
function createStarRating(stars, large = false) {
    const container = document.createElement('div');
    container.className = 'star-rating';
    
    for (let i = 1; i <= 3; i++) {
        const star = document.createElement('span');
        if (i <= stars) {
            star.className = 'star-filled';
            star.textContent = '★';
        } else {
            star.className = 'star-empty';
            star.textContent = '☆';
        }
        container.appendChild(star);
    }
    
    return container;
}

/**
 * Create and show the level selection screen
 */
function showLevelSelectScreen() {
    // First, make sure we've loaded any saved progress
    initLevelProgress();
    
    // Create the level select container if it doesn't exist
    let levelSelectScreen = document.getElementById('levelSelectScreen');
    
    if (!levelSelectScreen) {
        levelSelectScreen = document.createElement('div');
        levelSelectScreen.id = 'levelSelectScreen';
        document.body.appendChild(levelSelectScreen);
        
        // Create header
        const header = document.createElement('h1');
        header.textContent = 'Select Level';
        levelSelectScreen.appendChild(header);
        
        // Create level grid container
        const levelGrid = document.createElement('div');
        levelGrid.className = 'level-grid';
        levelSelectScreen.appendChild(levelGrid);
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'level-select-buttons';
        levelSelectScreen.appendChild(buttonContainer);
        
        // Create level editor button
        const editorButton = document.createElement('button');
        editorButton.textContent = 'Level Editor';
        editorButton.id = 'levelEditorButton';
        editorButton.addEventListener('click', () => {
            levelSelectScreen.style.display = 'none';
            // Call the level editor function
            showLevelEditor();
        });
        buttonContainer.appendChild(editorButton);
        
        // Create back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Main Menu';
        backButton.id = 'backToMainButton';
        backButton.addEventListener('click', () => {
            levelSelectScreen.style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
        });
        buttonContainer.appendChild(backButton);
        
        // Create level buttons
        for (let i = 0; i < levels.length; i++) {
            const level = levels[i];
            const levelButton = document.createElement('div');
            levelButton.className = 'level-button';
            levelButton.dataset.level = level.id;
            
            // Level icon
            const levelIcon = document.createElement('div');
            levelIcon.className = 'level-icon';
            levelIcon.textContent = level.icon || `L${level.id}`;
            
            // Level number
            const levelNumber = document.createElement('div');
            levelNumber.className = 'level-number';
            levelNumber.textContent = level.id;
            
            // Level name
            const levelName = document.createElement('div');
            levelName.className = 'level-name';
            levelName.textContent = level.name;
            
            // Stars container
            const starsContainer = createStarRating(getLevelStars(level.id));
            
            levelButton.appendChild(levelIcon);
            levelButton.appendChild(levelNumber);
            levelButton.appendChild(levelName);
            levelButton.appendChild(starsContainer);
            
            // Add click event only if level is unlocked
            if (level.id <= unlockedLevels) {
                levelButton.classList.add('unlocked');
                levelButton.addEventListener('click', () => {
                    currentLevel = level.id;
                    startLevel(level.id);
                    levelSelectScreen.style.display = 'none';
                });
            } else {
                levelButton.classList.add('locked');
                const lockIcon = document.createElement('div');
                lockIcon.className = 'lock-icon';
                lockIcon.textContent = '🔒';
                levelButton.appendChild(lockIcon);
            }
            
            levelGrid.appendChild(levelButton);
        }
    } else {
        // Update which levels are unlocked and their star ratings
        const levelButtons = levelSelectScreen.querySelectorAll('.level-button');
        levelButtons.forEach(button => {
            const levelId = parseInt(button.dataset.level);
            
            // Update star rating
            const starsContainer = button.querySelector('.star-rating');
            if (starsContainer) {
                button.removeChild(starsContainer);
            }
            button.appendChild(createStarRating(getLevelStars(levelId)));
            
            if (levelId <= unlockedLevels) {
                button.classList.add('unlocked');
                button.classList.remove('locked');
                
                // Remove lock icon if it exists
                const lockIcon = button.querySelector('.lock-icon');
                if (lockIcon) {
                    button.removeChild(lockIcon);
                }
                
                // Add click event if it doesn't have one
                if (!button.onclick) {
                    button.addEventListener('click', () => {
                        currentLevel = levelId;
                        startLevel(levelId);
                        levelSelectScreen.style.display = 'none';
                    });
                }
            }
        });
    }
    
    // Show the level select screen and hide the game canvas
    levelSelectScreen.style.display = 'flex';
    document.getElementById('startScreen').style.display = 'none';
    
    // Hide game elements
    document.getElementById('gameCanvas').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.game-info').style.display = 'none';
    document.getElementById('levelIndicator').style.display = 'none';
    
    // Pause the game if it's running
    pauseGame();
}

/**
 * Start a specific level
 * @param {number} levelId - The level ID to start
 */
function startLevel(levelId) {
    // Set current level
    currentLevel = levelId;
    
    // Load level configuration
    const levelConfig = getLevel(levelId);
    
    // Apply level configuration
    loadLevelConfig(levelConfig);
    
    // Reset and start the game
    resetGame();
    
    // Hide level select screen and start screen
    document.getElementById('levelSelectScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'none';
    
    // Show game elements
    document.getElementById('gameCanvas').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    document.querySelector('.game-info').style.display = 'block';
    document.getElementById('levelIndicator').style.display = 'block';
    
    // Resume the game
    resumeGame();
}

/**
 * Show level complete screen with option to continue to next level
 * @param {boolean} newLevelUnlocked - Whether a new level was unlocked
 * @param {number} stars - Star rating (1-3)
 */
function showLevelCompleteScreen(newLevelUnlocked, stars) {
    // Check if we're in a custom level from the editor
    if (typeof handleLevelCompleteForEditor === 'function' && handleLevelCompleteForEditor(stars)) {
        return; // Custom handling for editor levels
    }
    
    // Create level complete screen if it doesn't exist
    let levelCompleteScreen = document.getElementById('levelCompleteScreen');
    
    if (!levelCompleteScreen) {
        levelCompleteScreen = document.createElement('div');
        levelCompleteScreen.id = 'levelCompleteScreen';
        document.body.appendChild(levelCompleteScreen);
        
        // Create header
        const header = document.createElement('h2');
        header.textContent = 'Level Complete!';
        levelCompleteScreen.appendChild(header);
        
        // Create level info
        const levelInfo = document.createElement('p');
        levelInfo.id = 'levelCompleteInfo';
        levelCompleteScreen.appendChild(levelInfo);
        
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        starsContainer.id = 'levelCompleteStars';
        levelCompleteScreen.appendChild(starsContainer);
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        levelCompleteScreen.appendChild(buttonsContainer);
        
        // Next level button
        const nextLevelBtn = document.createElement('button');
        nextLevelBtn.id = 'nextLevelBtn';
        nextLevelBtn.textContent = 'Next Level';
        buttonsContainer.appendChild(nextLevelBtn);
        
        // Level select button
        const selectLevelBtn = document.createElement('button');
        selectLevelBtn.textContent = 'Level Select';
        selectLevelBtn.addEventListener('click', () => {
            levelCompleteScreen.style.display = 'none';
            showLevelSelectScreen();
        });
        buttonsContainer.appendChild(selectLevelBtn);
        
        // Replay button
        const replayBtn = document.createElement('button');
        replayBtn.textContent = 'Replay Level';
        replayBtn.addEventListener('click', () => {
            levelCompleteScreen.style.display = 'none';
            startLevel(currentLevel);
        });
        buttonsContainer.appendChild(replayBtn);
    }
    
    // Update level info
    const levelInfo = document.getElementById('levelCompleteInfo');
    levelInfo.textContent = `You completed Level ${currentLevel}: ${getLevel(currentLevel).name}`;
    
    // Update stars display
    const starsContainer = document.getElementById('levelCompleteStars');
    starsContainer.innerHTML = '';
    starsContainer.appendChild(createStarRating(stars, true));
    
    // Update next level button
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    
    if (currentLevel < getMaxLevel()) {
        nextLevelBtn.style.display = 'block';
        
        if (currentLevel + 1 <= unlockedLevels) {
            nextLevelBtn.textContent = 'Next Level';
            nextLevelBtn.disabled = false;
        } else {
            nextLevelBtn.textContent = 'Level Locked';
            nextLevelBtn.disabled = true;
        }
        
        // Update next level button click event
        nextLevelBtn.onclick = () => {
            levelCompleteScreen.style.display = 'none';
            startLevel(currentLevel + 1);
        };
    } else {
        // No more levels
        nextLevelBtn.style.display = 'none';
    }
    
    // Show unlock message if a new level was unlocked
    if (newLevelUnlocked && currentLevel < getMaxLevel()) {
        const unlockMessage = document.createElement('p');
        unlockMessage.className = 'unlock-message';
        unlockMessage.textContent = `🎉 Level ${currentLevel + 1} Unlocked! 🎉`;
        
        // Remove any existing unlock message
        const existingMessage = levelCompleteScreen.querySelector('.unlock-message');
        if (existingMessage) {
            levelCompleteScreen.removeChild(existingMessage);
        }
        
        // Add the new message before the stars
        levelCompleteScreen.insertBefore(unlockMessage, document.getElementById('levelCompleteStars'));
    }
    
    // Show the level complete screen
    levelCompleteScreen.style.display = 'flex';
}