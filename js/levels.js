/**
 * Level definitions for the game
 */

const levels = [
    // Level 1 - Original game settings
    {
        id: 1,
        name: "Orbital Basics",
        planet1: {
            distance: 120,
            startAngle: 0,
            orbitSpeed: 0.6,
            radius: 15
        },
        planet2: {
            distance: 240,
            startAngle: Math.PI, // Opposite side
            orbitSpeed: 0.3,
            radius: 20
        },
        timeLimit: 7,
        icon: "🚀",
        description: "Launch your rocket from the blue planet to the red planet. Mind the gravity!"
    },
    
    // Level 2 - Faster orbit
    {
        id: 2,
        name: "Picking Up Speed",
        planet1: {
            distance: 120,
            startAngle: Math.PI / 4, // Different starting position
            orbitSpeed: 0.8, // Faster orbit
            radius: 15
        },
        planet2: {
            distance: 240,
            startAngle: Math.PI + Math.PI / 4,
            orbitSpeed: 0.4, // Faster orbit
            radius: 20
        },
        timeLimit: 6.5, // Slightly less time
        icon: "⚡",
        description: "The planets are moving faster now. Time your launch carefully!"
    },
    
    // Level 3 - Closer orbits
    {
        id: 3,
        name: "Narrow Gap",
        planet1: {
            distance: 120,
            startAngle: Math.PI / 2,
            orbitSpeed: 0.7,
            radius: 15
        },
        planet2: {
            distance: 200, // Closer to inner planet
            startAngle: Math.PI + Math.PI / 2,
            orbitSpeed: 0.5,
            radius: 20
        },
        timeLimit: 6,
        icon: "🔍",
        description: "The gap between planets has narrowed. Navigate carefully!"
    },
    
    // Level 4 - Orthogonal orbits
    {
        id: 4,
        name: "Crossing Paths",
        planet1: {
            distance: 120,
            startAngle: 0,
            orbitSpeed: 0.7,
            radius: 15
        },
        planet2: {
            distance: 250,
            startAngle: Math.PI / 2, // Perpendicular position
            orbitSpeed: 0.6,
            radius: 20
        },
        timeLimit: 6,
        icon: "✂️",
        description: "The planets are moving in perpendicular positions. Watch their crossing paths!"
    },
    
    // Level 5 - Fast inner planet, slow outer planet
    {
        id: 5,
        name: "Speed Differential",
        planet1: {
            distance: 130,
            startAngle: Math.PI / 3,
            orbitSpeed: 1.0, // Very fast
            radius: 15
        },
        planet2: {
            distance: 260,
            startAngle: Math.PI + Math.PI / 3,
            orbitSpeed: 0.3, // Slow
            radius: 20
        },
        timeLimit: 5.5,
        icon: "⏱️",
        description: "Your starting planet is orbiting much faster than the target. Challenging trajectory!"
    },
    
    // Level 6 - Faster outer planet, inner planet slower
    {
        id: 6,
        name: "Orbital Chase",
        planet1: {
            distance: 140,
            startAngle: 0,
            orbitSpeed: 0.4, // Slow
            radius: 15
        },
        planet2: {
            distance: 270,
            startAngle: Math.PI / 4,
            orbitSpeed: 0.8, // Fast
            radius: 20
        },
        timeLimit: 5.5,
        icon: "🏁",
        description: "The target planet is moving much faster than yours. Can you catch up?"
    },
    
    // Level 7 - Reversed orbits
    {
        id: 7,
        name: "Orbital Collision",
        planet1: {
            distance: 150,
            startAngle: Math.PI / 6,
            orbitSpeed: 0.7, // Normal direction
            radius: 15
        },
        planet2: {
            distance: 280,
            startAngle: Math.PI + Math.PI / 6,
            orbitSpeed: -0.5, // Opposite direction
            radius: 20
        },
        timeLimit: 5,
        icon: "💥",
        description: "The planets are orbiting in opposite directions. Intercept course required!"
    },
    
    // Level 8 - Very fast both planets
    {
        id: 8,
        name: "Rapid Transit",
        planet1: {
            distance: 160,
            startAngle: Math.PI / 2,
            orbitSpeed: 1.2, // Very fast
            radius: 15
        },
        planet2: {
            distance: 290,
            startAngle: Math.PI + Math.PI / 2,
            orbitSpeed: 0.9, // Very fast
            radius: 20
        },
        timeLimit: 5,
        icon: "⚡",
        description: "Both planets are in rapid orbit. You'll need precise timing!"
    },
    
    // Level 9 - Far distance
    {
        id: 9,
        name: "Long Shot",
        planet1: {
            distance: 120,
            startAngle: 0,
            orbitSpeed: 0.6,
            radius: 15
        },
        planet2: {
            distance: 340, // Very far
            startAngle: Math.PI,
            orbitSpeed: 0.25, // Slower due to distance
            radius: 20
        },
        timeLimit: 7, // More time for the distance
        icon: "🎯",
        description: "The target planet is far away. Use the sun's gravity to slingshot your rocket!"
    },
    
    // Level 10 - The ultimate challenge
    {
        id: 10,
        name: "Master Pilot",
        planet1: {
            distance: 130,
            startAngle: Math.PI / 8,
            orbitSpeed: 1.3, // Extremely fast
            radius: 15
        },
        planet2: {
            distance: 320,
            startAngle: Math.PI + Math.PI / 3,
            orbitSpeed: -0.8, // Fast in opposite direction
            radius: 18 // Slightly smaller target
        },
        timeLimit: 4.5, // Very little time
        icon: "👨‍✈️",
        description: "The ultimate test of your piloting skills. Good luck!"
    },
    
    // Level 11 - Tiny target
    {
        id: 11,
        name: "Needle Thread",
        planet1: {
            distance: 140,
            startAngle: Math.PI / 4,
            orbitSpeed: 0.9,
            radius: 15
        },
        planet2: {
            distance: 280,
            startAngle: Math.PI + Math.PI / 4,
            orbitSpeed: 0.6,
            radius: 12, // Much smaller target
        },
        timeLimit: 6,
        icon: "🧵",
        description: "The target planet is smaller and harder to hit. Precision is key!"
    },
    
    // Level 12 - Dual challenge
    {
        id: 12,
        name: "Cosmic Dance",
        planet1: {
            distance: 170,
            startAngle: 0,
            orbitSpeed: 1.1,
            radius: 15
        },
        planet2: {
            distance: 300,
            startAngle: 0, // Same angle - planets aligned
            orbitSpeed: -0.7, // Opposite direction
            radius: 20
        },
        timeLimit: 4, // Very tight time limit
        icon: "💃",
        description: "The planets start aligned but move in opposite directions. Perfect timing required!"
    }
];

// Function to get a specific level
function getLevel(levelId) {
    return levels.find(level => level.id === levelId) || levels[0];
}

// Function to get the max level
function getMaxLevel() {
    return levels.length;
}

/**
 * Calculate star rating based on completion time and fuel usage
 * @param {number} levelId - The level ID
 * @param {number} completionTime - Time taken to complete the level
 * @param {number} fuelRemaining - Remaining fuel percentage (0-100)
 * @returns {number} - Star rating (1-3)
 */
function calculateStarRating(levelId, completionTime, fuelRemaining) {
    const levelConfig = getLevel(levelId);
    const timeLimit = levelConfig.timeLimit;
    
    // Calculate time-based stars (0-2)
    let timeStars = 0;
    const timeRatio = completionTime / timeLimit;
    
    if (timeRatio <= 0.5) {
        timeStars = 2; // Under 50% of time limit = 2 stars
    } else if (timeRatio <= 0.75) {
        timeStars = 1; // Under 75% of time limit = 1 star
    }
    
    // Calculate fuel-based stars (0-1)
    let fuelStars = 0;
    if (fuelRemaining >= 50) {
        fuelStars = 1; // Above 50% fuel remaining = 1 star
    }
    
    // Total stars (1-3)
    return Math.min(3, Math.max(1, timeStars + fuelStars));
}