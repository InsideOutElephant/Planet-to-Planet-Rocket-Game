# Planet to Planet Rocket Game 🚀

A physics-based orbital rocket game with 12 challenging levels and a star rating system!

![Planet to Planet Rocket Game](https://insideoutelephant.github.io/Planet-to-Planet-Rocket-Game/media/gameplay.png)

## 🎮 Play Now

[Play the game online](https://insideoutelephant.github.io/Planet-to-Planet-Rocket-Game/) or download and run locally.

## ✨ Features

- 🌌 Physics-based orbital mechanics
- 🔥 Realistic rocket thrust and gravity
- 🪐 12 progressively challenging levels
- ⭐ Star rating system based on time and fuel efficiency
- 💾 Progress is saved automatically
- 📱 Works on desktop and mobile browsers

## 📖 How to Play

Launch your rocket from the blue planet and navigate it to the red planet. Use the sun's gravity to help you curve your trajectory. Earn stars by completing levels quickly and efficiently.

### 🕹️ Controls

- Adjust rocket launch speed using the slider
- Use Left/Right arrow keys, A/D keys, or Rotation buttons to aim the rocket before and during flight
- Click "Launch Rocket" or press SPACE to launch
- Click the same button again or press SPACE for extra thrust (boost)
- Press R key to retry level

Note: All rocket controls (rotation, launch, and boost) are disabled when the Level Complete screen is showing.

### 🌟 Star Rating

- ⭐ Complete the level
- ⭐⭐ Complete the level using less than 75% of the allowed time
- ⭐⭐⭐ Complete the level quickly and with more than 50% fuel remaining

## 🏆 Achievement System

The game includes an achievement system that rewards players for accomplishing various goals and challenges. Achievements are automatically tracked as you play and are saved between sessions.

### How to View Achievements

- Click the "Achievements 🏆" button on the main menu to view all available achievements
- Locked achievements will appear grayed out with hidden descriptions
- When you unlock an achievement, a notification will appear in the top-right corner of the screen

### Available Achievements

| Achievement | Name | Description | How to Earn |
|-------------|------|-------------|------------|
| 🏆 | Master Navigator | Complete all levels of the game | Beat all 12 levels |
| ⭐ | Perfect Pilot | Complete all levels with three stars | Earn 3 stars on all 12 levels |
| 🎯 | Pure Trajectory | Complete all levels without rotating or using fuel | Complete all levels without rotating before launch or using any fuel |
| 💥 | Rock Collector | Crash into 10 asteroids | Collide with asteroids 10 times across any levels |
| 🌌 | Deep Space Explorer | Fly far away from the sun | Fly your rocket beyond twice the distance of the outer planet |
| 💾 | Level Designer | Save a level in the editor | Use the level editor to create and save a level |
| 📂 | Level Loader | Load a level in the editor | Successfully load a previously saved level in the editor |

### Tips for Achievement Hunting

- For the "Pure Trajectory" achievement, you need perfect planning! Don't rotate your rocket before launch or use any fuel during flight.
- To get three stars on a level, complete it quickly and preserve at least 50% of your fuel.
- For "Deep Space Explorer," try using a high initial velocity and aiming away from the sun.

## 🔧 Installation

### Play Online

Just visit [https://insideoutelephant.github.io/Planet-to-Planet-Rocket-Game/](https://insideoutelephant.github.io/Planet-to-Planet-Rocket-Game/)

### Run Locally

1. Clone this repository:
```bash
git clone https://github.com/insideoutelephant/planet-to-planet-rocket.git
```

2. Navigate to the project directory:
```bash
cd planet-to-planet-rocket
```

3. Simply open the `index.html` file in your browser:
   - Double-click the file in your file explorer
   - Or drag and drop it into your browser window

That's it! No server required - the game runs entirely in your browser.

## 📁 Project Structure

```
planet-to-planet-rocket/
├── css/
│   └── styles.css           # Game styling
├── js/
│   ├── achievements.js      # Achievement system
│   ├── entities.js          # Game objects and physics
│   ├── game.js              # Core game logic
│   ├── input.js             # User input handling
│   ├── level-editor.js      # Level editor screen
│   ├── level-select.js      # Level selection screen
│   ├── levels.js            # Level definitions
│   ├── main.js              # Main entry point
│   ├── renderer.js          # 2D rendering
│   └── utils.js             # Utility functions
├── media/
│   └── gameplay.png         # Gameplay Screenshot
├── index.html               # Main HTML file
└── README.md                # Game Description
```

## 🛠️ Technologies Used

- HTML5 Canvas for rendering
- LocalStorage for saving progress
- JavaScript (ES6+)

## 🧪 Development

### Adding New Levels

To add a new level, edit the `levels.js` file and add a new level object to the array:

```javascript
{
    id: 13,
    name: "Your Level Name",
    planet1: {
        distance: 150,
        startAngle: Math.PI / 4,
        orbitSpeed: 0.7,
        radius: 15
    },
    planet2: {
        distance: 280,
        startAngle: Math.PI + Math.PI / 4,
        orbitSpeed: 0.5,
        radius: 20
    },
    timeLimit: 6,
    icon: "🌟", // Use an emoji or character for the level icon
    description: "Your level description here",
    asteroids: [
        {
            distance: 200,
            startAngle: 0,
            orbitSpeed: 0.5,
            radius: 10,
            color: "#8B4513"
        }
    ]
}
```

## Level Challenges

1. **Orbital Basics** - Learn the basics of orbital transfers
2. **Picking Up Speed** - Faster planet orbits, time your launch
3. **Narrow Gap** - Reduced distance between planets
4. **Crossing Paths** - Planets moving in perpendicular positions
5. **Speed Differential** - Inner planet moves much faster than outer
6. **Orbital Chase** - Outer planet moves faster than inner
7. **Orbital Collision** - Planets moving in opposite directions
8. **Rapid Transit** - Both planets moving very fast
9. **Long Shot** - Target planet is very far away
10. **Master Pilot** - Extremely challenging timing and precision
11. **Needle Thread** - Target is small and harder to hit
12. **Cosmic Dance** - Planets start aligned but move in opposite directions

## 📜 License

MIT License - See LICENSE file for details.

## 🙌 Credits

- Game concept and implementation by Neil and Emmet
- Sound effects created with Web Audio API

## 📣 Feedback and Contributions

Feedback, bug reports, and pull requests are welcome! Feel free to check the [issues page](https://github.com/insideoutelephant/planet-to-planet-rocket/issues).

---

Made with ❤️ by Neil and Emmet
