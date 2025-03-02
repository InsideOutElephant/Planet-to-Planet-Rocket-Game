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
        description: "Launch your rocket from the blue planet to the red planet. Mind the gravity!",
        asteroids: [] // No asteroids in level 1
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
        description: "The planets are moving faster now. Time your launch carefully!",
        asteroids: [] // No asteroids in level 2
    },
    
    // Level 3 - Closer orbits with one asteroid
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
        description: "The gap between planets has narrowed. Watch out for the asteroid!",
        asteroids: [
            {
                distance: 160,
                startAngle: Math.PI * 1.25,
                orbitSpeed: 0.45,
                radius: 8,
                color: "#8B5A00"
            }
        ]
    },
    
    // Level 4 - Orthogonal orbits with two asteroids
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
        description: "The planets are moving in perpendicular positions. Navigate between asteroids!",
        asteroids: [
            {
                distance: 170,
                startAngle: Math.PI / 3,
                orbitSpeed: 0.4,
                radius: 7,
                color: "#9E9E9E"
            },
            {
                distance: 200,
                startAngle: Math.PI * 1.2,
                orbitSpeed: -0.3,
                radius: 9,
                color: "#A0522D"
            }
        ]
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
        description: "Your starting planet is orbiting much faster than the target. Challenging trajectory!",
        asteroids: [
            {
                distance: 180,
                startAngle: 0,
                orbitSpeed: 0.5,
                radius: 8,
                color: "#8B4513"
            },
            {
                distance: 220,
                startAngle: Math.PI,
                orbitSpeed: 0.4,
                radius: 10,
                color: "#696969"
            }
        ]
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
        description: "The target planet is moving much faster than yours. Can you catch up?",
        asteroids: [
            {
                distance: 200,
                startAngle: Math.PI / 2,
                orbitSpeed: -0.3,
                radius: 9,
                color: "#8B5A00"
            },
            {
                distance: 240,
                startAngle: Math.PI * 1.5,
                orbitSpeed: 0.5,
                radius: 7,
                color: "#9E9E9E"
            }
        ]
    },
    
    // Level 7 - Reversed orbits with asteroid belt
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
        description: "The planets are orbiting in opposite directions. Navigate through the asteroid belt!",
        asteroids: [
            {
                distance: 180,
                startAngle: 0,
                orbitSpeed: 0.4,
                radius: 8,
                color: "#8B5A00"
            },
            {
                distance: 195,
                startAngle: Math.PI / 3,
                orbitSpeed: -0.2,
                radius: 7,
                color: "#9E9E9E"
            },
            {
                distance: 210,
                startAngle: Math.PI * 2 / 3,
                orbitSpeed: 0.3,
                radius: 9,
                color: "#A0522D"
            },
            {
                distance: 225,
                startAngle: Math.PI,
                orbitSpeed: -0.3,
                radius: 6,
                color: "#696969"
            },
            {
                distance: 240,
                startAngle: Math.PI * 4 / 3,
                orbitSpeed: 0.2,
                radius: 8,
                color: "#8B4513"
            }
        ]
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
        description: "Both planets are in rapid orbit. You'll need precise timing!",
        asteroids: [
            {
                distance: 200,
                startAngle: 0,
                orbitSpeed: 0.5,
                radius: 10,
                color: "#8B4513"
            },
            {
                distance: 230,
                startAngle: Math.PI,
                orbitSpeed: -0.6,
                radius: 8,
                color: "#A0522D"
            },
            {
                distance: 260,
                startAngle: Math.PI / 2,
                orbitSpeed: 0.7,
                radius: 7,
                color: "#9E9E9E"
            }
        ]
    },
    
    // Level 9 - Far distance with moving obstacles
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
        description: "The target planet is far away. Use the sun's gravity and avoid asteroids!",
        asteroids: [
            {
                distance: 180,
                startAngle: Math.PI / 3,
                orbitSpeed: 0.4,
                radius: 8,
                color: "#8B5A00"
            },
            {
                distance: 220,
                startAngle: Math.PI * 2 / 3,
                orbitSpeed: -0.3,
                radius: 9,
                color: "#A0522D"
            },
            {
                distance: 260,
                startAngle: Math.PI,
                orbitSpeed: 0.5,
                radius: 10,
                color: "#8B4513"
            },
            {
                distance: 300,
                startAngle: Math.PI * 4 / 3,
                orbitSpeed: -0.4,
                radius: 7,
                color: "#9E9E9E"
            }
        ]
    },
    
    // Level 10 - The ultimate challenge with more obstacles
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
        description: "The ultimate test of your piloting skills. Avoid the asteroid field!",
        asteroids: [
            {
                distance: 170,
                startAngle: 0,
                orbitSpeed: 0.6,
                radius: 9,
                color: "#8B5A00"
            },
            {
                distance: 190,
                startAngle: Math.PI / 2,
                orbitSpeed: -0.4,
                radius: 7,
                color: "#9E9E9E"
            },
            {
                distance: 210,
                startAngle: Math.PI,
                orbitSpeed: 0.5,
                radius: 8,
                color: "#A0522D"
            },
            {
                distance: 230,
                startAngle: Math.PI * 3 / 2,
                orbitSpeed: -0.5,
                radius: 10,
                color: "#696969"
            },
            {
                distance: 250,
                startAngle: 0,
                orbitSpeed: 0.4,
                radius: 9,
                color: "#8B4513"
            },
            {
                distance: 270,
                startAngle: Math.PI / 2,
                orbitSpeed: -0.3,
                radius: 7,
                color: "#8B5A00"
            },
            {
                distance: 290,
                startAngle: Math.PI,
                orbitSpeed: 0.3,
                radius: 8,
                color: "#9E9E9E"
            }
        ]
    },
    
    // Level 11 - Tiny target with obstacles
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
        description: "The target planet is smaller and harder to hit. Thread your way through!",
        asteroids: [
            {
                distance: 190,
                startAngle: 0,
                orbitSpeed: 0.5,
                radius: 8,
                color: "#8B5A00"
            },
            {
                distance: 220,
                startAngle: Math.PI / 3,
                orbitSpeed: -0.4,
                radius: 7,
                color: "#9E9E9E"
            },
            {
                distance: 240,
                startAngle: Math.PI * 2 / 3,
                orbitSpeed: 0.3,
                radius: 10,
                color: "#A0522D"
            },
            {
                distance: 260,
                startAngle: Math.PI,
                orbitSpeed: -0.3,
                radius: 9,
                color: "#696969"
            }
        ]
    },
    
    // Level 12 - Dual challenge with dense asteroid field
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
        icon: "💫",
        description: "Navigate through the dense asteroid field to reach the target planet!",
        asteroids: [
            {
                distance: 190,
                startAngle: Math.PI / 6,
                orbitSpeed: 0.5,
                radius: 8,
                color: "#8B4513"
            },
            {
                distance: 200,
                startAngle: Math.PI / 3,
                orbitSpeed: -0.3,
                radius: 7,
                color: "#9E9E9E"
            },
            {
                distance: 210,
                startAngle: Math.PI / 2,
                orbitSpeed: 0.4,
                radius: 9,
                color: "#A0522D"
            },
            {
                distance: 220,
                startAngle: Math.PI * 2 / 3,
                orbitSpeed: -0.4,
                radius: 7,
                color: "#8B5A00"
            },
            {
                distance: 230,
                startAngle: Math.PI * 5 / 6,
                orbitSpeed: 0.3,
                radius: 8,
                color: "#696969"
            },
            {
                distance: 240,
                startAngle: Math.PI,
                orbitSpeed: -0.5,
                radius: 10,
                color: "#8B4513"
            },
            {
                distance: 250,
                startAngle: Math.PI * 7 / 6,
                orbitSpeed: 0.4,
                radius: 6,
                color: "#9E9E9E"
            },
            {
                distance: 260,
                startAngle: Math.PI * 4 / 3,
                orbitSpeed: -0.3,
                radius: 9,
                color: "#A0522D"
            },
            {
                distance: 270,
                startAngle: Math.PI * 3 / 2,
                orbitSpeed: 0.35,
                radius: 7,
                color: "#8B5A00"
            },
            {
                distance: 280,
                startAngle: Math.PI * 5 / 3,
                orbitSpeed: -0.45,
                radius: 8,
                color: "#696969"
            }
        ]
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