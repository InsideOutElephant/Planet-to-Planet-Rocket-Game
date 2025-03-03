/**
 * Achievement system for tracking player accomplishments
 */

const ACHIEVEMENTS = {
    COMPLETE_ALL_LEVELS: {
        id: 'complete_all_levels',
        name: 'Master Navigator',
        description: 'Complete all levels of the game',
        icon: '🏆'
    },
    THREE_STARS_ALL: {
        id: 'three_stars_all',
        name: 'Perfect Pilot',
        description: 'Complete all levels with three stars',
        icon: '⭐'
    },
    NO_ROTATION_NO_FUEL: {
        id: 'no_rotation_no_fuel',
        name: 'Pure Trajectory',
        description: 'Complete all levels without rotating or using fuel',
        icon: '🎯'
    },
    ASTEROID_CRASHES: {
        id: 'asteroid_crashes',
        name: 'Rock Collector',
        description: 'Crash into 10 asteroids',
        icon: '💥'
    },
    DEEP_SPACE: {
        id: 'deep_space',
        name: 'Deep Space Explorer',
        description: 'Fly far away from the sun',
        icon: '🌌'
    },
    SAVE_LEVEL: {
        id: 'save_level',
        name: 'Level Designer',
        description: 'Save a level in the editor',
        icon: '💾'
    },
    LOAD_LEVEL: {
        id: 'load_level',
        name: 'Level Loader',
        description: 'Load a level in the editor',
        icon: '📂'
    }
};

// Achievement tracking state
let achievementState = {
    asteroidCrashes: 0,
    noRotationLevels: new Set(),
    noFuelLevels: new Set(),
    threeStarLevels: new Set(),
    completedLevels: new Set(),
    savedLevel: false,
    loadedLevel: false
};

// Load achievement state from localStorage
function loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
        const parsed = JSON.parse(saved);
        achievementState = {
            ...parsed,
            // Convert arrays back to Sets
            noRotationLevels: new Set(parsed.noRotationLevels),
            noFuelLevels: new Set(parsed.noFuelLevels),
            threeStarLevels: new Set(parsed.threeStarLevels),
            completedLevels: new Set(parsed.completedLevels)
        };
    }
}

// Save achievement state to localStorage
function saveAchievements() {
    const toSave = {
        ...achievementState,
        // Convert Sets to arrays for JSON storage
        noRotationLevels: Array.from(achievementState.noRotationLevels),
        noFuelLevels: Array.from(achievementState.noFuelLevels),
        threeStarLevels: Array.from(achievementState.threeStarLevels),
        completedLevels: Array.from(achievementState.completedLevels)
    };
    localStorage.setItem('achievements', JSON.stringify(toSave));
}

// Check if an achievement is unlocked
function isAchievementUnlocked(achievementId) {
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) {
        const unlockedAchievements = JSON.parse(saved);
        return unlockedAchievements.includes(achievementId) || 
               (ACHIEVEMENTS[achievementId] && unlockedAchievements.includes(ACHIEVEMENTS[achievementId].id));
    }
    return false;
}

// Unlock an achievement
function unlockAchievement(achievementId) {
    if (isAchievementUnlocked(achievementId)) return;

    const saved = localStorage.getItem('unlockedAchievements');
    const unlockedAchievements = saved ? JSON.parse(saved) : [];
    
    // Store the id from the ACHIEVEMENTS object to ensure consistency
    if (ACHIEVEMENTS[achievementId]) {
        unlockedAchievements.push(ACHIEVEMENTS[achievementId].id);
    } else {
        // Fallback if we're given the direct id
        unlockedAchievements.push(achievementId);
    }
    
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));

    // Show achievement notification
    showAchievementNotification(ACHIEVEMENTS[achievementId]);
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Check achievements after level completion
function checkAchievements(levelId, usedRotation, usedFuel, stars) {
    // Track level completion
    achievementState.completedLevels.add(levelId);
    
    // Track three stars
    if (stars === 3) {
        achievementState.threeStarLevels.add(levelId);
    }
    
    // Track no rotation/fuel levels
    if (!usedRotation) {
        achievementState.noRotationLevels.add(levelId);
    }
    if (!usedFuel) {
        achievementState.noFuelLevels.add(levelId);
    }

    // Check for completing all levels
    if (achievementState.completedLevels.size === getMaxLevel()) {
        unlockAchievement('COMPLETE_ALL_LEVELS');
    }

    // Check for all three stars
    if (achievementState.threeStarLevels.size === getMaxLevel()) {
        unlockAchievement('THREE_STARS_ALL');
    }

    // Check for no rotation/fuel
    if (achievementState.noRotationLevels.size === getMaxLevel() && 
        achievementState.noFuelLevels.size === getMaxLevel()) {
        unlockAchievement('NO_ROTATION_NO_FUEL');
    }

    saveAchievements();
}

// Track asteroid crashes
function trackAsteroidCrash() {
    achievementState.asteroidCrashes++;
    if (achievementState.asteroidCrashes >= 10) {
        unlockAchievement('ASTEROID_CRASHES');
    }
    saveAchievements();
}

// Track deep space
function trackDeepSpace() {
    unlockAchievement('DEEP_SPACE');
    saveAchievements();
}

// Track level editor actions
function trackLevelSave() {
    achievementState.savedLevel = true;
    unlockAchievement('SAVE_LEVEL');
    saveAchievements();
}

function trackLevelLoad() {
    achievementState.loadedLevel = true;
    unlockAchievement('LOAD_LEVEL');
    saveAchievements();
}

// Debug function for achievement system
function debugAchievements() {
    console.log("=== Achievement Debug Information ===");
    
    // Check achievement state
    console.log("Achievement State:", localStorage.getItem('achievements'));
    if (localStorage.getItem('achievements')) {
        const state = JSON.parse(localStorage.getItem('achievements'));
        console.log("- Asteroid crashes:", state.asteroidCrashes);
        console.log("- Completed levels:", state.completedLevels);
        console.log("- Three star levels:", state.threeStarLevels);
        console.log("- No rotation levels:", state.noRotationLevels);
        console.log("- No fuel levels:", state.noFuelLevels);
    }
    
    // Check unlocked achievements
    console.log("Unlocked Achievements:", localStorage.getItem('unlockedAchievements'));
    
    // Display all achievements and their status
    const achievementKeys = Object.keys(ACHIEVEMENTS);
    console.log("All Achievements Status:");
    
    const unlockedAchievements = localStorage.getItem('unlockedAchievements') 
        ? JSON.parse(localStorage.getItem('unlockedAchievements')) 
        : [];
    
    achievementKeys.forEach(key => {
        const achievement = ACHIEVEMENTS[key];
        const isUnlocked = unlockedAchievements.includes(achievement.id) || unlockedAchievements.includes(key);
        console.log(`- ${achievement.name} (${key}): ${isUnlocked ? 'UNLOCKED' : 'locked'}`);
    });
    
    console.log("===================================");
}

// Function to populate and display achievements screen
function showAchievementsScreen() {
    // Get the achievements screen element
    const achievementsScreen = document.getElementById('achievementsScreen');
    const achievementsGrid = document.getElementById('achievementsGrid');
    
    // Clear any existing content
    achievementsGrid.innerHTML = '';
    
    // Get all achievement keys
    const achievementKeys = Object.keys(ACHIEVEMENTS);
    
    // Get list of unlocked achievements
    const unlockedAchievements = localStorage.getItem('unlockedAchievements') 
        ? JSON.parse(localStorage.getItem('unlockedAchievements')) 
        : [];
    
    // Create achievement cards
    achievementKeys.forEach(key => {
        const achievement = ACHIEVEMENTS[key];
        
        // Check if this achievement is unlocked (check both the key and the id)
        const isUnlocked = unlockedAchievements.includes(achievement.id) || unlockedAchievements.includes(key);
        
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        const icon = document.createElement('div');
        icon.className = 'achievement-icon';
        icon.textContent = achievement.icon;
        
        const info = document.createElement('div');
        info.className = 'achievement-info';
        
        const name = document.createElement('div');
        name.className = 'achievement-name';
        name.textContent = achievement.name;
        
        const desc = document.createElement('div');
        desc.className = 'achievement-desc';
        desc.textContent = isUnlocked ? achievement.description : '???';
        
        info.appendChild(name);
        info.appendChild(desc);
        
        card.appendChild(icon);
        card.appendChild(info);
        
        achievementsGrid.appendChild(card);
    });

    // Debug buttons (in development mode only)
    if (localStorage.getItem('devMode') === 'true') {
        const debugBtn = document.createElement('button');
        debugBtn.textContent = 'Debug Achievements';
        debugBtn.style.marginTop = '10px';
        debugBtn.addEventListener('click', debugAchievements);
        achievementsScreen.appendChild(debugBtn);
        
        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset All Achievements';
        resetBtn.style.marginTop = '10px';
        resetBtn.style.marginLeft = '10px';
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('achievements');
            localStorage.removeItem('unlockedAchievements');
            location.reload();
        });
        achievementsScreen.appendChild(resetBtn);
    }
    
    // Hide other screens
    document.getElementById('startScreen').style.display = 'none';
    if (document.getElementById('levelSelectScreen')) {
        document.getElementById('levelSelectScreen').style.display = 'none';
    }
    document.getElementById('gameCanvas').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.game-info').style.display = 'none';
    document.getElementById('levelIndicator').style.display = 'none';
    
    // Display the achievements screen
    achievementsScreen.style.display = 'flex';
}

// Setup achievement button event listener
document.addEventListener('DOMContentLoaded', () => {
    const achievementsButton = document.getElementById('achievementsButton');
    const closeAchievementsButton = document.getElementById('closeAchievementsButton');
    
    if (achievementsButton) {
        achievementsButton.addEventListener('click', () => {
            showAchievementsScreen();
        });
    }
    
    if (closeAchievementsButton) {
        closeAchievementsButton.addEventListener('click', () => {
            // Hide achievements screen
            document.getElementById('achievementsScreen').style.display = 'none';
            
            // Show main menu
            document.getElementById('startScreen').style.display = 'flex';
        });
    }
});

// Initialize achievements
loadAchievements();