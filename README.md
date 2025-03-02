# Planet to Planet Rocket Game 🚀

A physics-based orbital rocket game with 12 challenging levels and a star rating system!

![Planet to Planet Rocket Game](https://github.com/yourusername/planet-to-planet-rocket/raw/main/screenshots/gameplay.png)

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
- Click "Launch Rocket" or press SPACE to launch
- Click the same button again or press SPACE for extra thrust (boost)
- Press R key to retry level

### 🌟 Star Rating

- ⭐ Complete the level
- ⭐⭐ Complete the level using less than 75% of the allowed time
- ⭐⭐⭐ Complete the level quickly and with more than 50% fuel remaining

## 🔧 Installation

### Play Online

Just visit [https://insideoutelephant.github.io/planet-to-planet-rocket/](https://insideoutelephant.github.io/planet-to-planet-rocket/)

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
│   ├── entities.js          # Game objects and physics
│   ├── game.js              # Core game logic
│   ├── input.js             # User input handling
│   ├── level-select.js      # Level selection screen
│   ├── levels.js            # Level definitions
│   ├── main.js              # Main entry point
│   ├── renderer.js          # 2D rendering
│   └── utils.js             # Utility functions
└── index.html               # Main HTML file
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
    description: "Your level description here"
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

- Game concept and implementation by [Your Name]
- Sound effects created with Web Audio API

## 📣 Feedback and Contributions

Feedback, bug reports, and pull requests are welcome! Feel free to check the [issues page](https://github.com/insideoutelephant/planet-to-planet-rocket/issues).

---

Made with ❤️ by [Your Name]