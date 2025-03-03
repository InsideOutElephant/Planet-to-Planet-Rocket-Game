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
    
    // Add rotation buttons to the controls
    addRotationButtons();
    
    // Keyboard controls - modified to check if we're in the editor or typing in an input
    document.addEventListener('keydown', (e) => {
        // Don't process keyboard shortcuts if typing in an input field
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' ||
            (document.getElementById('levelEditorScreen') && document.getElementById('levelEditorScreen').style.display === 'flex')) {
            return;
        }
        
        // Only process game controls if not in WIN state
        if (currentState !== GAME_STATE.WIN) {
            if (e.code === 'Space') {
                handleActionButton();
            } else if (e.code === 'KeyR') {
                resetGame();
            } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA')) {
                // Rotate rocket counterclockwise (before or after launch)
                if (!rocket.active && gameActive) {
                    rotateRocket(-10);
                } else if (gameActive) {
                    rotateRocketInFlight(-15);
                }
            } else if ((e.code === 'ArrowRight' || e.code === 'KeyD')) {
                // Rotate rocket clockwise (before or after launch)
                if (!rocket.active && gameActive) {
                    rotateRocket(10);
                } else if (gameActive) {
                    rotateRocketInFlight(15);
                }
            }
        }
    });

    // Add instructions about controls
    addRotationInstructions();
}

/**
 * Add rotation buttons to the game controls
 */
function addRotationButtons() {
    // Create a container for rotation buttons
    const rotationControls = document.createElement('div');
    rotationControls.className = 'rotation-controls';
    rotationControls.style.display = 'flex';
    rotationControls.style.alignItems = 'center';
    rotationControls.style.gap = '8px';
    
    // Create the rotate left button
    const rotateLeftBtn = document.createElement('button');
    rotateLeftBtn.innerHTML = '&#8634;'; // Counter-clockwise arrow
    rotateLeftBtn.title = 'Rotate Left';
    rotateLeftBtn.id = 'rotateLeftBtn';
    rotateLeftBtn.addEventListener('click', () => {
        if (currentState !== GAME_STATE.WIN) {
            if (!rocket.active && gameActive) {
                rotateRocket(-15);
            } else if (gameActive) {
                rotateRocketInFlight(-15);
            }
        }
    });
    
    // Create a label
    const rotateLabel = document.createElement('span');
    rotateLabel.textContent = 'Rotate';
    rotateLabel.style.color = 'white';
    
    // Create the rotate right button
    const rotateRightBtn = document.createElement('button');
    rotateRightBtn.innerHTML = '&#8635;'; // Clockwise arrow
    rotateRightBtn.title = 'Rotate Right';
    rotateRightBtn.id = 'rotateRightBtn';
    rotateRightBtn.addEventListener('click', () => {
        if (currentState !== GAME_STATE.WIN) {
            if (!rocket.active && gameActive) {
                rotateRocket(15);
            } else if (gameActive) {
                rotateRocketInFlight(15);
            }
        }
    });
    
    // Add the buttons to the container
    rotationControls.appendChild(rotateLeftBtn);
    rotationControls.appendChild(rotateLabel);
    rotationControls.appendChild(rotateRightBtn);
    
    // Add the container to the controls
    const controls = document.querySelector('.controls');
    controls.insertBefore(rotationControls, document.getElementById('actionBtn'));
}

/**
 * Add rotation instructions to the game
 */
function addRotationInstructions() {
    // Create an instruction element for rotation controls
    const instructionEl = document.createElement('div');
    instructionEl.className = 'rotation-instructions';
    instructionEl.innerHTML = 'Use <strong>Left/Right arrow keys</strong>, <strong>A/D keys</strong>, or <strong>Rotate buttons</strong> to aim the rocket before and during flight';
    
    // Add to the game info container
    const gameInfo = document.querySelector('.game-info');
    gameInfo.appendChild(instructionEl);
}

/**
 * Rotate the rocket by the specified angle before launch
 * @param {number} degrees - Amount to rotate in degrees
 */
function rotateRocket(degrees) {
    // Get current angle in degrees
    let currentDegrees = Math.round((rocket.orbitAngle * 180) / Math.PI) % 360;
    
    // Add the rotation
    currentDegrees = (currentDegrees + degrees + 360) % 360;
    
    // Update rocket angle
    setRocketOrbitAngle(currentDegrees);
}

/**
 * Rotate the rocket while in flight
 * @param {number} degrees - Amount to rotate velocity vector in degrees
 */
function rotateRocketInFlight(degrees) {
    if (!rocket.active || !gameActive) return;
    
    // Check if there's enough fuel
    if (rocket.fuel < 2) {
        // Play a warning sound
        playSound(220, 0.1); // A4 note

        return;
    }

    // Calculate current angle of velocity
    const currentAngle = Math.atan2(rocket.velY, rocket.velX);
    
    // Calculate new angle
    const newAngle = currentAngle + (degrees * Math.PI / 180);
    
    // Get current speed
    const speed = Math.sqrt(rocket.velX * rocket.velX + rocket.velY * rocket.velY);
    
    // Update velocity components
    rocket.velX = Math.cos(newAngle) * speed;
    rocket.velY = Math.sin(newAngle) * speed;
    
    // Use some fuel for the maneuver
    rocket.fuel = Math.max(0, rocket.fuel - 2);
    
    // Update button appearance if out of fuel
    if (rocket.fuel <= 0) {
        document.getElementById('actionBtn').style.opacity = '0.5';
    }
    
    // Visual feedback - add some particles
    const particles = createBoostParticles(rocket.x, rocket.y, newAngle + Math.PI);
    rocket.particles.push(...particles);
    
    // Play a rotation sound
    playSound(660, 0.05); // E5 note, shorter duration
}

/**
 * Handle the combined launch/boost action button
 */
function handleActionButton() {
    const actionBtn = document.getElementById('actionBtn');
    
    if (currentState !== GAME_STATE.WIN) {
        if (!rocket.active && gameActive) {
            // Launch the rocket
            launchRocket();
            // Update button text
            actionBtn.textContent = 'Boost Rocket 🔥';
        } else if (rocket.active && gameActive) {
            // Boost the rocket
            boostRocket();
        }
    }
}
