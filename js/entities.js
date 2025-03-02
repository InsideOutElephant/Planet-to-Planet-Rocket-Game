/**
 * Game entities and their properties
 */

// Game state constants
const GAME_STATE = {
    INTRO: 'intro',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose'
};

// Canvas reference - will be set in main.js
let canvas;

// Game entities
let sun;
let planet1;
let planet2;
let rocket;
let stars = [];
let asteroids = []; // Array to hold asteroid objects

// Game state variables
let currentState = GAME_STATE.INTRO;
let introProgress = 0;
let winAnimProgress = 0;
let loseAnimProgress = 0;
let gameTime = 0;
let gameActive = true;
let gameWon = false;
let maxGameTime = 7; // Time limit in seconds - will be set by level config

/**
 * Initialize all game entities
 * @param {HTMLCanvasElement} canvasElement - The canvas element
 */
function initEntities(canvasElement) {
    canvas = canvasElement;
    
    // Initialize the sun
    sun = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 30,
        color: '#FDB813',
        introScale: 0
    };
    
    // Initialize planet 1 (blue planet) - will be overwritten by level config
    planet1 = {
        distance: 120, // Distance from sun
        angle: 0,      // Current angle in orbit
        orbitSpeed: 0.6, // Radians per second
        radius: 15,
        rotationAngle: 0,
        rotationSpeed: 1.2,
        color: '#3498db',
        introScale: 0
    };
    
    // Initialize planet 2 (red planet) - will be overwritten by level config
    planet2 = {
        distance: 240, // Distance from sun
        angle: Math.PI, // Start on opposite side
        orbitSpeed: 0.3, // Radians per second
        radius: 20,
        rotationAngle: 0,
        rotationSpeed: 0.9,
        color: '#e74c3c',
        introScale: 0
    };
    
    // Initialize the rocket
    rocket = {
        x: 0,
        y: 0,
        radius: 6,
        speed: 50, // Initial speed
        angle: 0,
        rocketAngle: 0, // Angle of the rocket itself (for rendering)
        orbitAngle: 0, // Angle around planet1 (for positioning before launch)
        velX: 0,
        velY: 0,
        active: false,
        color: '#f1c40f',
        particles: [],
        trail: [],
        fuel: 100,
        boosting: false
    };
    
    // Initialize asteroids array
    asteroids = [];
    
    // Generate background stars
    stars = generateStars(100, canvas.width, canvas.height);
}

/**
 * Load level configuration into the game
 * @param {Object} levelConfig - The level configuration object
 */
function loadLevelConfig(levelConfig) {
    // Set planet 1 properties
    planet1.distance = levelConfig.planet1.distance;
    planet1.angle = levelConfig.planet1.startAngle;
    planet1.orbitSpeed = levelConfig.planet1.orbitSpeed;
    planet1.radius = levelConfig.planet1.radius;
    
    // Set planet 2 properties
    planet2.distance = levelConfig.planet2.distance;
    planet2.angle = levelConfig.planet2.startAngle;
    planet2.orbitSpeed = levelConfig.planet2.orbitSpeed;
    planet2.radius = levelConfig.planet2.radius;
    
    // Set time limit
    maxGameTime = levelConfig.timeLimit;
    
    // Reset rocket orbit angle
    rocket.orbitAngle = Math.PI/2; // Start with perpendicular launch
    
    // Load asteroids if present in level config
    asteroids = [];
    if (levelConfig.asteroids && Array.isArray(levelConfig.asteroids)) {
        levelConfig.asteroids.forEach(asteroidConfig => {
            asteroids.push({
                distance: asteroidConfig.distance,
                angle: asteroidConfig.startAngle,
                orbitSpeed: asteroidConfig.orbitSpeed,
                radius: asteroidConfig.radius,
                color: asteroidConfig.color || getRandomAsteroidColor(),
                rotationAngle: 0,
                rotationSpeed: Math.random() * 0.3 - 0.15, // Slower rotation speed
            });
        });
    }
    
    // Update level indicator
    const levelIndicator = document.getElementById('levelIndicator');
    levelIndicator.textContent = `Level ${levelConfig.id}: ${levelConfig.name}`;
    levelIndicator.style.display = 'block';
}

/**
 * Get a random color for asteroids
 * @returns {string} - A hex color code
 */
function getRandomAsteroidColor() {
    const colors = [
        '#8B5A00', // Brown
        '#9E9E9E', // Gray
        '#A0522D', // Sienna
        '#696969', // Dim Gray
        '#8B4513', // SaddleBrown
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Set rocket orbit angle from degrees
 * @param {number} degrees - Angle in degrees (0-360)
 */
function setRocketOrbitAngle(degrees) {
    rocket.orbitAngle = (degrees * Math.PI) / 180;
}

/**
 * Update positions of planets and asteroids
 * @param {number} deltaTime - Time elapsed since last update in seconds
 */
function updatePlanetPositions(deltaTime) {
    // Update planet 1 position
    planet1.angle += planet1.orbitSpeed * deltaTime;
    planet1.rotationAngle += planet1.rotationSpeed * deltaTime;
    
    // Update planet 2 position
    planet2.angle += planet2.orbitSpeed * deltaTime;
    planet2.rotationAngle += planet2.rotationSpeed * deltaTime;
    
    // Update asteroid positions
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        asteroid.angle += asteroid.orbitSpeed * deltaTime;
        asteroid.rotationAngle += asteroid.rotationSpeed * deltaTime;
    }
}

/**
 * Update rocket position and check for collisions
 * @param {number} deltaTime - Time elapsed since last update in seconds
 */
function updateRocket(deltaTime) {
    if (rocket.active) {
        // Apply sun's gravity
        const dx = sun.x - rocket.x;
        const dy = sun.y - rocket.y;
        const distSqToSun = dx * dx + dy * dy;
        const dist = Math.sqrt(distSqToSun);
        
        // Simple gravity implementation
        const gravity = 800 / distSqToSun;
        const gravityX = gravity * dx / dist;
        const gravityY = gravity * dy / dist;
        
        rocket.velX += gravityX * deltaTime;
        rocket.velY += gravityY * deltaTime;
        
        // Update rocket position
        rocket.x += rocket.velX * deltaTime;
        rocket.y += rocket.velY * deltaTime;
        
        // Update rocket angle (for rendering)
        rocket.rocketAngle = Math.atan2(rocket.velY, rocket.velX);
        
        // Add to trail
        if (gameActive) {
            rocket.trail.push({
                x: rocket.x,
                y: rocket.y,
                alpha: 1
            });
            
            // Limit trail length
            if (rocket.trail.length > 20) {
                rocket.trail.shift();
            }
            
            // Update trail alpha
            for (let i = 0; i < rocket.trail.length; i++) {
                rocket.trail[i].alpha -= deltaTime * 1.5;
                if (rocket.trail[i].alpha < 0) rocket.trail[i].alpha = 0;
            }
        }
        
        // Check for collision with planet 2
        const planet2X = sun.x + Math.cos(planet2.angle) * planet2.distance;
        const planet2Y = sun.y + Math.sin(planet2.angle) * planet2.distance;
        
        const dxP2 = planet2X - rocket.x;
        const dyP2 = planet2Y - rocket.y;
        const distToP2Sq = dxP2 * dxP2 + dyP2 * dyP2;
        
        if (distToP2Sq <= (planet2.radius + rocket.radius) * (planet2.radius + rocket.radius)) {
            // Collision with planet 2 - win!
            gameWon = true;
            gameActive = false;
            currentState = GAME_STATE.WIN;
            document.getElementById('gameStatus').textContent = 'Success! Planet reached!';
            document.getElementById('gameStatus').className = 'status win';
            
            // Create explosion particles
            const explosionParticles = createExplosion(rocket.x, rocket.y, 30, '#f1c40f');
            rocket.particles.push(...explosionParticles);
            
            // After a short delay, show level complete screen and unlock next level
            setTimeout(() => {
                // Calculate star rating
                const stars = calculateStarRating(currentLevel, gameTime, rocket.fuel);
                
                // Try to unlock the next level
                const newLevelUnlocked = unlockNextLevel(currentLevel, stars);
                
                // Show level complete screen
                showLevelCompleteScreen(newLevelUnlocked, stars);
            }, 1500);
        }
        
        // Check for collision with asteroids
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            const asteroidX = sun.x + Math.cos(asteroid.angle) * asteroid.distance;
            const asteroidY = sun.y + Math.sin(asteroid.angle) * asteroid.distance;
            
            const dxAsteroid = asteroidX - rocket.x;
            const dyAsteroid = asteroidY - rocket.y;
            const distToAsteroidSq = dxAsteroid * dxAsteroid + dyAsteroid * dyAsteroid;
            
            if (distToAsteroidSq <= (asteroid.radius + rocket.radius) * (asteroid.radius + rocket.radius)) {
                // Collision with asteroid - lose!
                gameActive = false;
                currentState = GAME_STATE.LOSE;
                document.getElementById('gameStatus').textContent = 'Crashed into an asteroid! Try again.';
                document.getElementById('gameStatus').className = 'status lose';
                
                // Create explosion particles
                const explosionParticles = createExplosion(rocket.x, rocket.y, 40, '#e74c3c');
                rocket.particles.push(...explosionParticles);
                
                // Add sound effect
                playSound(220, 0.3); // Low A note
                break;
            }
        }
        
        // Check for out of bounds or time's up
        const buffer = 50;
        if (rocket.x < -buffer || rocket.x > canvas.width + buffer || 
            rocket.y < -buffer || rocket.y > canvas.height + buffer) {
            gameActive = false;
            currentState = GAME_STATE.LOSE;
            document.getElementById('gameStatus').textContent = 'Rocket flew away. Try again!';
            document.getElementById('gameStatus').className = 'status lose';
        }
        
        if (gameTime >= maxGameTime && !gameWon && gameActive) {
            gameActive = false;
            currentState = GAME_STATE.LOSE;
            document.getElementById('gameStatus').textContent = 'Time\'s up! Try again.';
            document.getElementById('gameStatus').className = 'status lose';
        }
    } else {
        // Position rocket on planet 1's surface
        const planet1X = sun.x + Math.cos(planet1.angle) * planet1.distance;
        const planet1Y = sun.y + Math.sin(planet1.angle) * planet1.distance;
        
        // Position based on rocket.orbitAngle around planet1
        // Calculate the total angle (planet angle + orbit angle)
        const totalAngle = planet1.angle + rocket.orbitAngle;
        
        // Position rocket at this angle, offset from planet surface
        rocket.x = planet1X + Math.cos(totalAngle) * (planet1.radius + rocket.radius + 2);
        rocket.y = planet1Y + Math.sin(totalAngle) * (planet1.radius + rocket.radius + 2);
        
        // Update rocket angle for rendering to point in direction of movement
        rocket.rocketAngle = totalAngle;
    }
}

/**
 * Update all particles (explosion and boost)
 * @param {number} deltaTime - Time elapsed since last update in seconds
 */
function updateParticles(deltaTime) {
    for (let i = rocket.particles.length - 1; i >= 0; i--) {
        const p = rocket.particles[i];
        p.x += p.velX * deltaTime;
        p.y += p.velY * deltaTime;
        p.alpha -= p.decay * deltaTime;
        
        if (p.alpha <= 0) {
            rocket.particles.splice(i, 1);
        }
    }
}

/**
 * Launch the rocket from the blue planet
 */
function launchRocket() {
    if (!rocket.active && gameActive) {
        rocket.active = true;
        
        // Use the total angle for launch direction (planet angle + orbit angle)
        // Launch in the direction the rocket is pointing
        const launchAngle = planet1.angle + rocket.orbitAngle;
        
        // Set initial velocity based on rocket speed and direction
        rocket.velX = Math.cos(launchAngle) * rocket.speed;
        rocket.velY = Math.sin(launchAngle) * rocket.speed;
        
        document.getElementById('actionBtn').textContent = 'Boost Rocket 🔥';
        document.getElementById('speedInput').disabled = true;
        
        // Add launch sound
        playSound(440, 0.2); // A4 note
    }
}

/**
 * Apply boost to the rocket
 */
function boostRocket() {
    if (rocket.active && gameActive) {
        // Check if there's enough fuel
        if (rocket.fuel < 25) {
            // Play a "out of fuel" sound effect - lower pitch and shorter
            playSound(220, 0.1); // Low A note, shorter duration
            
            // Visual feedback that boost failed
            const actionBtn = document.getElementById('actionBtn');
            actionBtn.classList.add('boost-error');
            setTimeout(() => {
                actionBtn.classList.remove('boost-error');
            }, 300);
            
            return; // Exit without applying boost
        }
        
        // We have enough fuel, apply the boost
        // Calculate current direction of travel
        const direction = Math.atan2(rocket.velY, rocket.velX);
        
        // Add boost in that direction
        const boostPower = 20;
        rocket.velX += Math.cos(direction) * boostPower;
        rocket.velY += Math.sin(direction) * boostPower;
        
        // Use fuel
        rocket.fuel -= 25;
        rocket.boosting = true;
        
        // Update button appearance if out of fuel
        if (rocket.fuel <= 0) {
            document.getElementById('actionBtn').style.opacity = '0.5';
        }
        
        // Create boost particles
        const boostParticles = createBoostParticles(rocket.x, rocket.y, direction);
        rocket.particles.push(...boostParticles);
        
        // Play boost sound
        playSound(880, 0.1); // A5 note
        
        // Disable boost button temporarily to prevent spamming
        const actionBtn = document.getElementById('actionBtn');
        actionBtn.style.opacity = '0.5';
        actionBtn.disabled = true;
        setTimeout(() => {
            if (rocket.active && gameActive && rocket.fuel > 0) {
                actionBtn.style.opacity = '1';
                actionBtn.disabled = false;
            }
        }, 1000);
    }
}

/**
 * Reset the game to initial state
 */
function resetGame() {
    // If a level is currently loaded, use its configuration for planet angles
    const levelConfig = getLevel(currentLevel);
    
    // Reset planet angles based on level config
    planet1.angle = levelConfig.planet1.startAngle;
    planet2.angle = levelConfig.planet2.startAngle;
    planet1.rotationAngle = 0;
    planet2.rotationAngle = 0;
    
    // Reset asteroid angles
    for (let i = 0; i < asteroids.length; i++) {
        if (levelConfig.asteroids && levelConfig.asteroids[i]) {
            asteroids[i].angle = levelConfig.asteroids[i].startAngle;
        }
        asteroids[i].rotationAngle = 0;
    }
    
    rocket.active = false;
    rocket.x = 0;
    rocket.y = 0;
    rocket.particles = [];
    rocket.trail = [];
    rocket.fuel = 100;
    rocket.boosting = false;
    rocket.orbitAngle = Math.PI/2; // Reset to perpendicular launch
    
    gameTime = 0;
    gameActive = true;
    gameWon = false;
    currentState = GAME_STATE.PLAYING;
    winAnimProgress = 0;
    loseAnimProgress = 0;
    
    // Reset UI
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.textContent = 'Launch Rocket';
    actionBtn.disabled = false;
    actionBtn.style.opacity = '1';
    document.getElementById('speedInput').disabled = false;
    document.getElementById('gameStatus').textContent = '';
    document.getElementById('gameStatus').className = 'status';
    document.getElementById('timer').textContent = '0.0';
    document.getElementById('timer').style.color = 'white';
    
    // Show level indicator
    document.getElementById('levelIndicator').style.display = 'block';
}

/**
 * Add a new asteroid to the game at specified position
 * @param {number} distance - Distance from sun
 * @param {number} angle - Angle in radians
 * @param {number} radius - Radius of the asteroid
 * @param {number} orbitSpeed - Speed of orbit in radians per second
 * @param {string} color - Color of the asteroid (optional)
 */
function addAsteroid(distance, angle, radius, orbitSpeed, color) {
    asteroids.push({
        distance: distance,
        angle: angle,
        orbitSpeed: orbitSpeed,
        radius: radius,
        color: color || getRandomAsteroidColor(),
        rotationAngle: 0,
        rotationSpeed: Math.random() * 0.3 - 0.15, // Slower rotation speed
    });
}

/**
 * Remove an asteroid from the game
 * @param {number} index - Index of the asteroid to remove
 */
function removeAsteroid(index) {
    if (index >= 0 && index < asteroids.length) {
        asteroids.splice(index, 1);
    }
}