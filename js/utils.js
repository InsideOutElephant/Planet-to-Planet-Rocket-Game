/**
 * Utility functions for the game
 */

/**
 * Play a sound effect at the specified frequency and duration
 * @param {number} frequency - Sound frequency in Hz
 * @param {number} duration - Sound duration in seconds
 */
function playSound(frequency, duration) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gainNode.gain.value = 0.2;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        // Fade out
        gainNode.gain.exponentialRampToValueAtTime(
            0.001, audioContext.currentTime + duration
        );
        
        // Stop after duration
        setTimeout(() => {
            oscillator.stop();
        }, duration * 1000);
    } catch (e) {
        console.log('Audio not supported');
    }
}

/**
 * Generate random background stars
 * @param {number} count - Number of stars to generate
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @returns {Array} Array of star objects
 */
function generateStars(count, canvasWidth, canvasHeight) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }
    return stars;
}

/**
 * Create an explosion particle effect
 * @param {number} x - X coordinate of explosion center
 * @param {number} y - Y coordinate of explosion center
 * @param {number} particleCount - Number of particles to create
 * @param {string} color - Color of particles
 * @returns {Array} Array of particle objects
 */
function createExplosion(x, y, particleCount, color) {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 50;
        particles.push({
            x: x,
            y: y,
            velX: Math.cos(angle) * speed,
            velY: Math.sin(angle) * speed,
            radius: Math.random() * 3 + 1,
            color: color,
            alpha: 1,
            decay: Math.random() * 0.5 + 0.5
        });
    }
    return particles;
}

/**
 * Create boost particles for the rocket
 * @param {number} x - X coordinate of rocket
 * @param {number} y - Y coordinate of rocket
 * @param {number} direction - Direction of movement in radians
 * @returns {Array} Array of particle objects
 */
function createBoostParticles(x, y, direction) {
    const particles = [];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        // Particles come out in the opposite direction of movement
        const spread = Math.PI / 4; // 45 degree spread
        const angle = direction + Math.PI + (Math.random() * spread - spread/2);
        const speed = Math.random() * 70 + 30;
        
        particles.push({
            x: x,
            y: y,
            velX: Math.cos(angle) * speed,
            velY: Math.sin(angle) * speed,
            radius: Math.random() * 2 + 1,
            color: '#ff9800',
            alpha: 1,
            decay: Math.random() * 1 + 1
        });
    }
    
    return particles;
}