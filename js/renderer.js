/**
 * Game rendering functions
 */

// Canvas context - will be set in main.js
let ctx;

/**
 * Initialize the renderer
 * @param {CanvasRenderingContext2D} context - Canvas rendering context
 */
function initRenderer(context) {
    ctx = context;
}

/**
 * Draw the background stars
 */
function drawStars() {
    for (const star of stars) {
        ctx.beginPath();
        // Make stars twinkle
        const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.opacity + twinkle * 0.2;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Draw the intro animation
 * @param {number} progress - Animation progress from 0 to 1
 */
function drawIntroAnimation(progress) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    
    // Sun appears first
    const sunScale = Math.min(1, progress * 2);
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius * sunScale, 0, Math.PI * 2);
    ctx.fillStyle = sun.color;
    ctx.fill();
    
    if (progress > 0.3) {
        // Planet 1 appears
        const planet1Scale = Math.min(1, (progress - 0.3) * 2);
        const planet1X = sun.x + Math.cos(planet1.angle) * planet1.distance;
        const planet1Y = sun.y + Math.sin(planet1.angle) * planet1.distance;
        
        ctx.beginPath();
        ctx.arc(planet1X, planet1Y, planet1.radius * planet1Scale, 0, Math.PI * 2);
        ctx.fillStyle = planet1.color;
        ctx.fill();
        
        // Draw orbit for planet 1
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, planet1.distance, 0, Math.PI * 2 * planet1Scale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
    }
    
    if (progress > 0.6) {
        // Planet 2 appears
        const planet2Scale = Math.min(1, (progress - 0.6) * 2);
        const planet2X = sun.x + Math.cos(planet2.angle) * planet2.distance;
        const planet2Y = sun.y + Math.sin(planet2.angle) * planet2.distance;
        
        ctx.beginPath();
        ctx.arc(planet2X, planet2Y, planet2.radius * planet2Scale, 0, Math.PI * 2);
        ctx.fillStyle = planet2.color;
        ctx.fill();
        
        // Draw orbit for planet 2
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, planet2.distance, 0, Math.PI * 2 * planet2Scale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
    }
    
    if (progress > 0.85) {
        // Title appears
        ctx.fillStyle = `rgba(255, 255, 255, ${(progress - 0.85) * 6.67})`;
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Planet to Planet Rocket Game', canvas.width / 2, 100);
    }
}

/**
 * Draw the winning animation
 * @param {number} progress - Animation progress from 0 to 1
 */
function drawWinAnimation(progress) {
    // Normal game drawing
    draw();
    
    // Celebratory effects
    if (progress < 1) {
        // Colorful fireworks effect
        const fireworkCount = 3;
        for (let i = 0; i < fireworkCount; i++) {
            const t = (progress + i / fireworkCount) % 1;
            if (t < 0.7) {
                const x = canvas.width * (0.3 + 0.4 * (i / fireworkCount));
                const y = canvas.height * (0.3 + 0.1 * Math.sin(progress * 10 + i));
                
                const size = 20 * Math.sin(Math.min(1, t * 1.4) * Math.PI);
                const hue = (i * 120) % 360;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.7 - t})`;
                ctx.fill();
                
                // Rays
                const rayCount = 12;
                for (let j = 0; j < rayCount; j++) {
                    const angle = j * (Math.PI * 2 / rayCount);
                    const rayLength = size * 2 * (0.5 + 0.5 * Math.sin(progress * 5));
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(
                        x + Math.cos(angle) * rayLength,
                        y + Math.sin(angle) * rayLength
                    );
                    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.5 - t * 0.5})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Victory text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 60, 300, 120);
    
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4CAF50';
    ctx.fillText('MISSION SUCCESS!', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('You reached the target planet!', canvas.width / 2, canvas.height / 2 + 40);
}

/**
 * Draw the losing animation
 * @param {number} progress - Animation progress from 0 to 1
 */
function drawLoseAnimation(progress) {
    // Normal game drawing
    draw();
    
    if (progress < 0.5) {
        // Screen shake effect
        ctx.save();
        const intensity = 10 * (0.5 - progress);
        ctx.translate(
            Math.random() * intensity - intensity / 2,
            Math.random() * intensity - intensity / 2
        );
    }
    
    // Fail text
    const alpha = Math.min(1, progress * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * alpha})`;
    ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 60, 300, 120);
    
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(244, 67, 54, ${alpha})`;
    ctx.fillText('MISSION FAILED', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillText('Try adjusting speed or timing', canvas.width / 2, canvas.height / 2 + 40);
    
    if (progress < 0.5) {
        ctx.restore();
    }
}

/**
 * Main drawing function for the game
 */
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    drawStars();
    
    // Display fuel gauge if rocket is active
    if (rocket.active && gameActive) {
        const gaugeWidth = 100;
        const gaugeHeight = 10;
        const gaugeX = 20;
        const gaugeY = 20;
        
        // Background
        ctx.fillStyle = '#444';
        ctx.fillRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);
        
        // Fill based on fuel level
        let fuelColor = '#4CAF50'; // Green
        if (rocket.fuel < 30) {
            fuelColor = '#f44336'; // Red
        } else if (rocket.fuel < 60) {
            fuelColor = '#ff9800'; // Orange
        }
        
        ctx.fillStyle = fuelColor;
        ctx.fillRect(gaugeX, gaugeY, gaugeWidth * (rocket.fuel / 100), gaugeHeight);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText('FUEL', gaugeX + gaugeWidth / 2 - 15, gaugeY + gaugeHeight + 12);
    }
    
    // Draw sun
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fillStyle = sun.color;
    ctx.fill();
    
    // Sun glow
    const gradient = ctx.createRadialGradient(
        sun.x, sun.y, sun.radius,
        sun.x, sun.y, sun.radius * 1.5
    );
    gradient.addColorStop(0, 'rgba(253, 184, 19, 0.5)');
    gradient.addColorStop(1, 'rgba(253, 184, 19, 0)');
    
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw orbit paths (as thin lines)
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, planet1.distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, planet2.distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
    
    // Draw asteroid orbit paths
    for (const asteroid of asteroids) {
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, asteroid.distance, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash([2, 4]); // Dashed line for asteroid orbits
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
    }
    
    // Calculate planet positions
    const planet1X = sun.x + Math.cos(planet1.angle) * planet1.distance;
    const planet1Y = sun.y + Math.sin(planet1.angle) * planet1.distance;
    
    const planet2X = sun.x + Math.cos(planet2.angle) * planet2.distance;
    const planet2Y = sun.y + Math.sin(planet2.angle) * planet2.distance;
    
    // Draw asteroids
    for (const asteroid of asteroids) {
        const asteroidX = sun.x + Math.cos(asteroid.angle) * asteroid.distance;
        const asteroidY = sun.y + Math.sin(asteroid.angle) * asteroid.distance;
        
        // Draw irregular asteroid shape
        ctx.save();
        ctx.translate(asteroidX, asteroidY);
        ctx.rotate(asteroid.rotationAngle);
        
        // Draw irregular asteroid
        ctx.beginPath();
        const segments = 8;
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radiusVariation = 0.7 + Math.sin(i * 3) * 0.3;
            const radius = asteroid.radius * radiusVariation;
            
            if (i === 0) {
                ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            } else {
                ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
        }
        ctx.closePath();
        
        // Create a gradient for the asteroid to give it dimension
        const gradientAsteroid = ctx.createRadialGradient(
            -asteroid.radius * 0.3, -asteroid.radius * 0.3, 0,
            0, 0, asteroid.radius * 1.2
        );
        gradientAsteroid.addColorStop(0, asteroid.color);
        gradientAsteroid.addColorStop(1, darkenColor(asteroid.color, 0.7));
        
        ctx.fillStyle = gradientAsteroid;
        ctx.fill();
        
        // Add some texture/details to the asteroid
        const craterCount = Math.floor(asteroid.radius / 3);
        for (let i = 0; i < craterCount; i++) {
            const craterAngle = Math.random() * Math.PI * 2;
            const craterDistance = Math.random() * asteroid.radius * 0.7;
            const craterX = Math.cos(craterAngle) * craterDistance;
            const craterY = Math.sin(craterAngle) * craterDistance;
            const craterRadius = Math.random() * asteroid.radius * 0.2 + asteroid.radius * 0.1;
            
            ctx.beginPath();
            ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
            ctx.fillStyle = darkenColor(asteroid.color, 0.5);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // Draw planet 1 with a feature to show rotation
    ctx.beginPath();
    ctx.arc(planet1X, planet1Y, planet1.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet1.color;
    ctx.fill();
    
    // Draw a marking on planet 1 to visualize rotation
    const markX = planet1X + Math.cos(planet1.rotationAngle) * (planet1.radius * 0.7);
    const markY = planet1Y + Math.sin(planet1.rotationAngle) * (planet1.radius * 0.7);
    ctx.beginPath();
    ctx.arc(markX, markY, planet1.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#1a5276';
    ctx.fill();
    
    // Draw planet 2 with a feature to show rotation
    ctx.beginPath();
    ctx.arc(planet2X, planet2Y, planet2.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet2.color;
    ctx.fill();
    
    // Draw a marking on planet 2 to visualize rotation
    const mark2X = planet2X + Math.cos(planet2.rotationAngle) * (planet2.radius * 0.7);
    const mark2Y = planet2Y + Math.sin(planet2.rotationAngle) * (planet2.radius * 0.7);
    ctx.beginPath();
    ctx.arc(mark2X, mark2Y, planet2.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#922b21';
    ctx.fill();
    
    // Draw rocket trail
    for (let i = 0; i < rocket.trail.length; i++) {
        ctx.beginPath();
        ctx.arc(
            rocket.trail[i].x,
            rocket.trail[i].y,
            rocket.radius * 0.7 * (i / rocket.trail.length),
            0,
            Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${rocket.trail[i].alpha * 0.7})`;
        ctx.fill();
    }
    
    // Draw rocket-shaped spacecraft instead of a circle
    const rocketLength = rocket.radius * 3;
    const rocketWidth = rocket.radius * 1.5;
    
    // Calculate rocket direction based on velocity or orbit
    let rocketAngle = rocket.rocketAngle;
    
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocketAngle);
    
    // Rocket body
    ctx.beginPath();
    ctx.moveTo(rocketLength, 0); // Nose
    ctx.lineTo(0, -rocketWidth/2); // Top corner
    ctx.lineTo(-rocketLength/3, 0); // Back middle
    ctx.lineTo(0, rocketWidth/2); // Bottom corner
    ctx.closePath();
    ctx.fillStyle = rocket.color;
    ctx.fill();
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Rocket window
    ctx.beginPath();
    ctx.arc(rocketLength/3, 0, rocketWidth/4, 0, Math.PI * 2);
    ctx.fillStyle = '#ecf0f1';
    ctx.fill();
    
    // Rocket flames only when active
    if (rocket.active) {
        const flameLength = rocketLength * (0.5 + Math.random() * 0.3);
        ctx.beginPath();
        ctx.moveTo(-rocketLength/3, 0);
        ctx.lineTo(-rocketLength/3 - flameLength, rocketWidth/3);
        ctx.lineTo(-rocketLength/3 - flameLength * 1.2, 0);
        ctx.lineTo(-rocketLength/3 - flameLength, -rocketWidth/3);
        ctx.closePath();
        
        // Gradient for flame
        const flameGradient = ctx.createLinearGradient(
            -rocketLength/3, 0,
            -rocketLength/3 - flameLength, 0
        );
        flameGradient.addColorStop(0, '#ff5722');
        flameGradient.addColorStop(0.6, '#ff9800');
        flameGradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
        
        ctx.fillStyle = flameGradient;
        ctx.fill();
    }
    
    ctx.restore();
    
    // Draw explosion particles
    for (const p of rocket.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 0, ${p.alpha})`;
        ctx.fill();
    }
}

/**
 * Darken a color by a given amount
 * @param {string} color - Hex color code
 * @param {number} amount - Amount to darken (0-1)
 * @returns {string} - Darkened color
 */
function darkenColor(color, amount) {
    // Remove # if present
    color = color.replace('#', '');
    
    // Parse the color
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // Darken
    r = Math.floor(r * amount);
    g = Math.floor(g * amount);
    b = Math.floor(b * amount);
    
    // Ensure values are in valid range
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}