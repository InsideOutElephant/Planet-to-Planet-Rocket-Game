/**
 * Level editor functionality
 */

// Current edited level values
let editingLevel = {
    id: 0, // Special ID for custom level
    name: "Custom Level",
    planet1: {
        distance: 120,
        startAngle: 0,
        orbitSpeed: 0.6,
        radius: 15
    },
    planet2: {
        distance: 240,
        startAngle: Math.PI,
        orbitSpeed: 0.3,
        radius: 20
    },
    timeLimit: 7,
    icon: "✏️",
    description: "A custom level created in the level editor."
};

// Flag to indicate if we're currently testing a level
let testingCustomLevel = false;

/**
 * Show the level editor screen
 * @param {boolean} resetToDefaults - Whether to reset the editor to default values
 */
function showLevelEditor(resetToDefaults = true) {
    // Reset editing level to level 1 defaults if requested
    if (resetToDefaults) {
        resetEditorToDefault();
    }
    
    // Create the level editor screen if it doesn't exist
    let editorScreen = document.getElementById('levelEditorScreen');
    
    if (!editorScreen) {
        editorScreen = document.createElement('div');
        editorScreen.id = 'levelEditorScreen';
        document.body.appendChild(editorScreen);
        
        // Create header
        const header = document.createElement('h1');
        header.textContent = 'Level Editor';
        editorScreen.appendChild(header);
        
        // Create description
        const description = document.createElement('p');
        description.textContent = 'Customize your own level by adjusting the parameters below.';
        description.className = 'editor-description';
        editorScreen.appendChild(description);
        
        // Create main editor container
        const editorContainer = document.createElement('div');
        editorContainer.className = 'editor-container';
        editorScreen.appendChild(editorContainer);
        
        // Create form for level parameters
        const form = document.createElement('form');
        form.className = 'editor-form';
        form.onsubmit = (e) => e.preventDefault(); // Prevent form submission
        editorContainer.appendChild(form);
        
        // Level name input
        createInputGroup(form, 'text', 'levelName', 'Level Name:', 'Custom Level', (value) => {
            editingLevel.name = value;
        });
        
        // Time limit input
        createInputGroup(form, 'range', 'timeLimit', 'Time Limit (seconds):', 7, (value) => {
            editingLevel.timeLimit = parseFloat(value);
            document.getElementById('timeLimit-value').textContent = value;
        }, 3, 10, 0.5);
        
        // Create planet 1 section
        const planet1Section = document.createElement('fieldset');
        planet1Section.className = 'planet-section';
        const planet1Legend = document.createElement('legend');
        planet1Legend.textContent = 'Blue Planet (Starting)';
        planet1Legend.style.color = '#3498db';
        planet1Section.appendChild(planet1Legend);
        form.appendChild(planet1Section);
        
        createInputGroup(planet1Section, 'range', 'planet1Distance', 'Distance from Sun:', 120, (value) => {
            editingLevel.planet1.distance = parseInt(value);
            document.getElementById('planet1Distance-value').textContent = value;
        }, 80, 200, 5);
        
        createInputGroup(planet1Section, 'range', 'planet1StartAngle', 'Start Angle (0-360°):', 0, (value) => {
            editingLevel.planet1.startAngle = (parseInt(value) * Math.PI) / 180;
            document.getElementById('planet1StartAngle-value').textContent = value + '°';
        }, 0, 360, 15);
        
        createInputGroup(planet1Section, 'range', 'planet1OrbitSpeed', 'Orbit Speed:', 0.6, (value) => {
            editingLevel.planet1.orbitSpeed = parseFloat(value);
            document.getElementById('planet1OrbitSpeed-value').textContent = value;
        }, -1.5, 1.5, 0.1);
        
        createInputGroup(planet1Section, 'range', 'planet1Radius', 'Planet Size:', 15, (value) => {
            editingLevel.planet1.radius = parseInt(value);
            document.getElementById('planet1Radius-value').textContent = value;
        }, 8, 25, 1);
        
        // Create planet 2 section
        const planet2Section = document.createElement('fieldset');
        planet2Section.className = 'planet-section';
        const planet2Legend = document.createElement('legend');
        planet2Legend.textContent = 'Red Planet (Target)';
        planet2Legend.style.color = '#e74c3c';
        planet2Section.appendChild(planet2Legend);
        form.appendChild(planet2Section);
        
        createInputGroup(planet2Section, 'range', 'planet2Distance', 'Distance from Sun:', 240, (value) => {
            editingLevel.planet2.distance = parseInt(value);
            document.getElementById('planet2Distance-value').textContent = value;
        }, 180, 340, 5);
        
        createInputGroup(planet2Section, 'range', 'planet2StartAngle', 'Start Angle (0-360°):', 180, (value) => {
            editingLevel.planet2.startAngle = (parseInt(value) * Math.PI) / 180;
            document.getElementById('planet2StartAngle-value').textContent = value + '°';
        }, 0, 360, 15);
        
        createInputGroup(planet2Section, 'range', 'planet2OrbitSpeed', 'Orbit Speed:', 0.3, (value) => {
            editingLevel.planet2.orbitSpeed = parseFloat(value);
            document.getElementById('planet2OrbitSpeed-value').textContent = value;
        }, -1.5, 1.5, 0.1);
        
        createInputGroup(planet2Section, 'range', 'planet2Radius', 'Planet Size:', 20, (value) => {
            editingLevel.planet2.radius = parseInt(value);
            document.getElementById('planet2Radius-value').textContent = value;
        }, 8, 25, 1);
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'editor-buttons';
        editorScreen.appendChild(buttonsContainer);
        
        // Test level button
        const testButton = document.createElement('button');
        testButton.id = 'testLevelBtn';
        testButton.textContent = 'Test Level';
        testButton.className = 'editor-button test-button';
        testButton.addEventListener('click', testCustomLevel);
        buttonsContainer.appendChild(testButton);
        
        // Save level button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Level';
        saveButton.className = 'editor-button save-button';
        saveButton.addEventListener('click', saveLevelToFile);
        buttonsContainer.appendChild(saveButton);
        
        // Load level button
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load Level';
        loadButton.className = 'editor-button load-button';
        loadButton.addEventListener('click', loadLevelFromFile);
        buttonsContainer.appendChild(loadButton);
        
        // Reset to defaults button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Defaults';
        resetButton.className = 'editor-button reset-button';
        resetButton.addEventListener('click', resetEditorToDefault);
        buttonsContainer.appendChild(resetButton);
        
        // Back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Level Select';
        backButton.className = 'editor-button back-button';
        backButton.addEventListener('click', () => {
            editorScreen.style.display = 'none';
            showLevelSelectScreen();
        });
        buttonsContainer.appendChild(backButton);
    } else {
        // Update input values to match the reset editingLevel
        updateEditorInputs();
    }
    
    // Show the editor screen
    editorScreen.style.display = 'flex';
    
    // Hide other screens and game elements
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('levelSelectScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.game-info').style.display = 'none';
    document.getElementById('levelIndicator').style.display = 'none';
    
    // Pause the game if it's running
    pauseGame();
}

/**
 * Update all the input values in the editor to match the current editingLevel
 */
function updateEditorInputs() {
    // Update level name
    const nameInput = document.getElementById('levelName');
    if (nameInput) nameInput.value = editingLevel.name;
    
    // Update time limit
    const timeLimitInput = document.getElementById('timeLimit');
    if (timeLimitInput) {
        timeLimitInput.value = editingLevel.timeLimit;
        document.getElementById('timeLimit-value').textContent = editingLevel.timeLimit;
    }
    
    // Update planet 1 values
    const p1DistanceInput = document.getElementById('planet1Distance');
    if (p1DistanceInput) {
        p1DistanceInput.value = editingLevel.planet1.distance;
        document.getElementById('planet1Distance-value').textContent = editingLevel.planet1.distance;
    }
    
    const p1AngleInput = document.getElementById('planet1StartAngle');
    if (p1AngleInput) {
        const angleDegrees = Math.round((editingLevel.planet1.startAngle * 180) / Math.PI);
        p1AngleInput.value = angleDegrees;
        document.getElementById('planet1StartAngle-value').textContent = angleDegrees + '°';
    }
    
    const p1SpeedInput = document.getElementById('planet1OrbitSpeed');
    if (p1SpeedInput) {
        p1SpeedInput.value = editingLevel.planet1.orbitSpeed;
        document.getElementById('planet1OrbitSpeed-value').textContent = editingLevel.planet1.orbitSpeed;
    }
    
    const p1RadiusInput = document.getElementById('planet1Radius');
    if (p1RadiusInput) {
        p1RadiusInput.value = editingLevel.planet1.radius;
        document.getElementById('planet1Radius-value').textContent = editingLevel.planet1.radius;
    }
    
    // Update planet 2 values
    const p2DistanceInput = document.getElementById('planet2Distance');
    if (p2DistanceInput) {
        p2DistanceInput.value = editingLevel.planet2.distance;
        document.getElementById('planet2Distance-value').textContent = editingLevel.planet2.distance;
    }
    
    const p2AngleInput = document.getElementById('planet2StartAngle');
    if (p2AngleInput) {
        const angleDegrees = Math.round((editingLevel.planet2.startAngle * 180) / Math.PI);
        p2AngleInput.value = angleDegrees;
        document.getElementById('planet2StartAngle-value').textContent = angleDegrees + '°';
    }
    
    const p2SpeedInput = document.getElementById('planet2OrbitSpeed');
    if (p2SpeedInput) {
        p2SpeedInput.value = editingLevel.planet2.orbitSpeed;
        document.getElementById('planet2OrbitSpeed-value').textContent = editingLevel.planet2.orbitSpeed;
    }
    
    const p2RadiusInput = document.getElementById('planet2Radius');
    if (p2RadiusInput) {
        p2RadiusInput.value = editingLevel.planet2.radius;
        document.getElementById('planet2Radius-value').textContent = editingLevel.planet2.radius;
    }
}

/**
 * Reset the editor to default level 1 values
 */
function resetEditorToDefault() {
    const level1 = getLevel(1);
    
    // Deep copy the level 1 configuration
    editingLevel = {
        id: 0, // Special ID for custom level
        name: "Custom Level",
        planet1: {
            distance: level1.planet1.distance,
            startAngle: level1.planet1.startAngle,
            orbitSpeed: level1.planet1.orbitSpeed,
            radius: level1.planet1.radius
        },
        planet2: {
            distance: level1.planet2.distance,
            startAngle: level1.planet2.startAngle,
            orbitSpeed: level1.planet2.orbitSpeed,
            radius: level1.planet2.radius
        },
        timeLimit: level1.timeLimit,
        icon: "✏️",
        description: "A custom level created in the level editor."
    };
    
    // Update the UI if it exists
    updateEditorInputs();
}

/**
 * Helper function to create input groups for the editor
 */
function createInputGroup(parent, type, id, label, defaultValue, onChangeHandler, min, max, step) {
    const group = document.createElement('div');
    group.className = 'input-group';
    
    const labelElem = document.createElement('label');
    labelElem.htmlFor = id;
    labelElem.textContent = label;
    group.appendChild(labelElem);
    
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.value = defaultValue;
    
    if (type === 'range') {
        input.min = min;
        input.max = max;
        input.step = step;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.id = `${id}-value`;
        valueDisplay.className = 'range-value';
        valueDisplay.textContent = type === 'range' && id.includes('StartAngle') 
            ? defaultValue + '°' 
            : defaultValue;
        
        input.addEventListener('input', () => {
            onChangeHandler(input.value);
            valueDisplay.textContent = type === 'range' && id.includes('StartAngle') 
                ? input.value + '°' 
                : input.value;
        });
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(valueDisplay);
    } else {
        input.addEventListener('input', () => {
            onChangeHandler(input.value);
        });
        inputContainer.appendChild(input);
    }
    
    group.appendChild(inputContainer);
    parent.appendChild(group);
}

/**
 * Test the custom level
 */
function testCustomLevel() {
    // Hide the editor screen
    document.getElementById('levelEditorScreen').style.display = 'none';
    
    // Set the testing flag
    testingCustomLevel = true;
    
    // Show game elements
    document.getElementById('gameCanvas').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    document.querySelector('.game-info').style.display = 'block';
    document.getElementById('levelIndicator').style.display = 'block';
    
    // Load our custom level
    loadLevelConfig(editingLevel);
    
    // Reset and start game
    resetGame();
    
    // Resume the game
    resumeGame();
    
    // Add a return button to the game UI
    addReturnToEditorButton();
}

/**
 * Add a button to return to the editor while testing
 */
function addReturnToEditorButton() {
    // Check if the button already exists
    if (document.getElementById('returnToEditorBtn')) {
        document.getElementById('returnToEditorBtn').style.display = 'inline-block';
        return;
    }
    
    // Create a return button
    const returnButton = document.createElement('button');
    returnButton.id = 'returnToEditorBtn';
    returnButton.textContent = 'Back to Editor';
    returnButton.style.backgroundColor = '#3498db';
    
    returnButton.addEventListener('click', () => {
        // Hide the return button
        returnButton.style.display = 'none';
        
        // Reset testing flag
        testingCustomLevel = false;
        
        // Show the editor again but don't reset to defaults (keep current settings)
        showLevelEditor(false);
    });
    
    // Add the button to the controls
    const controls = document.querySelector('.controls');
    controls.appendChild(returnButton);
}

/**
 * Check if we should intercept the level completion 
 */
function handleLevelCompleteForEditor(stars) {
    // If we're testing a custom level, we should return to the editor instead
    // of showing the level complete screen
    if (testingCustomLevel) {
        // Delay the return to editor to show the success animation
        setTimeout(() => {
            // Reset the testing flag
            testingCustomLevel = false;
            
            // Hide the return button
            const returnButton = document.getElementById('returnToEditorBtn');
            if (returnButton) {
                returnButton.style.display = 'none';
            }
            
            // Create a custom message
            const message = document.createElement('div');
            message.className = 'custom-level-message';
            message.innerHTML = `
                <h2>Level Completed!</h2>
                <p>Your custom level works! It might be challenging enough to add to the game.</p>
                <div class="buttons-container">
                    <button id="editAgainBtn">Edit Again</button>
                    <button id="levelSelectBtn">Level Select</button>
                </div>
            `;
            
            document.body.appendChild(message);
            
            document.getElementById('editAgainBtn').addEventListener('click', () => {
                document.body.removeChild(message);
                showLevelEditor(false); // Don't reset to defaults
            });
            
            document.getElementById('levelSelectBtn').addEventListener('click', () => {
                document.body.removeChild(message);
                showLevelSelectScreen();
            });
            
        }, 2000);
        
        return true; // We handled the completion
    }
    
    return false; // Let the game handle it normally
}

/**
 * Save the current level settings to a JSON file
 */
function saveLevelToFile() {
    // Create a clean copy of the level data without extra properties
    const levelToSave = {
        name: editingLevel.name,
        planet1: {
            distance: editingLevel.planet1.distance,
            startAngle: editingLevel.planet1.startAngle,
            orbitSpeed: editingLevel.planet1.orbitSpeed,
            radius: editingLevel.planet1.radius
        },
        planet2: {
            distance: editingLevel.planet2.distance,
            startAngle: editingLevel.planet2.startAngle,
            orbitSpeed: editingLevel.planet2.orbitSpeed,
            radius: editingLevel.planet2.radius
        },
        timeLimit: editingLevel.timeLimit
    };
    
    // Convert to JSON string
    const levelJson = JSON.stringify(levelToSave, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([levelJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editingLevel.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    // Show success message
    showNotification('Level saved successfully!');
}

/**
 * Load level settings from a JSON file
 */
function loadLevelFromFile() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedLevel = JSON.parse(event.target.result);
                
                // Validate the loaded data
                if (!loadedLevel.planet1 || !loadedLevel.planet2 || !loadedLevel.timeLimit) {
                    throw new Error('Invalid level file format');
                }
                
                // Apply the loaded settings to the current level
                editingLevel.name = loadedLevel.name || "Custom Level";
                editingLevel.timeLimit = loadedLevel.timeLimit;
                
                // Planet 1 settings
                editingLevel.planet1.distance = loadedLevel.planet1.distance;
                editingLevel.planet1.startAngle = loadedLevel.planet1.startAngle;
                editingLevel.planet1.orbitSpeed = loadedLevel.planet1.orbitSpeed;
                editingLevel.planet1.radius = loadedLevel.planet1.radius;
                
                // Planet 2 settings
                editingLevel.planet2.distance = loadedLevel.planet2.distance;
                editingLevel.planet2.startAngle = loadedLevel.planet2.startAngle;
                editingLevel.planet2.orbitSpeed = loadedLevel.planet2.orbitSpeed;
                editingLevel.planet2.radius = loadedLevel.planet2.radius;
                
                // Update the UI
                updateEditorInputs();
                
                showNotification('Level loaded successfully!');
            } catch (error) {
                console.error('Error loading level:', error);
                showNotification('Error loading level file', true);
            }
        };
        
        reader.readAsText(file);
    });
    
    // Trigger the file input dialog
    fileInput.click();
}

/**
 * Display a notification message in the editor
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showNotification(message, isError = false) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.editor-notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'editor-notification';
    notification.textContent = message;
    
    if (isError) {
        notification.classList.add('notification-error');
    }
    
    document.body.appendChild(notification);
    
    // Remove after a delay
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 2000);
}