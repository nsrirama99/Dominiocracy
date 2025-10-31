# Dominiocracy
**Imagine if the world government of hit movie "Idiocracy" went to war**

An auto-battler where you give vague orders and your troops "interpret" them… poorly.

![Game Status](https://img.shields.io/badge/status-playable-success)
![Tech](https://img.shields.io/badge/tech-Next.js%20%2B%20Gemini%20AI-blue)

## 🎮 What is this?

Dominiocracy is a comedic strategy game where incompetence meets warfare. Command your squad of lovable idiots as they hilariously misinterpret your orders in spectacular ways.

**Core Gameplay:**
1. **Draft** - Pick 6 units from a pool of 10 randomized soldiers
2. **Command** - Give one vague order to your entire army
3. **Interpret** - Watch in horror as your units "understand" your order through their unique quirks
4. **Battle** - 10 ticks of glorious chaos as units execute their interpretations
5. **Score** - Survive and control territory to win

## 🚀 Quick Start

```bash
cd web
npm install
# Add your Gemini API key to .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start a game!

## 🧠 How It Works

The magic happens in the **Interpretation Phase** powered by **Gemini 2.0 Flash**:

1. You give an order: *"Take the hill, be sneaky"*
2. Each unit interprets based on their quirks:
   - **Coffee-Curious Warrior**: "Build a coffee shop on the hill for morale"
   - **Fire-Enthusiast Mage**: "Set the hill on fire so enemies can't see us"
   - **Overly-Literal Ranger**: "Literally pick up the hill and take it with us"
   - **Rebel Rogue**: "Charge the hill loudly while juggling torches"

3. Units execute their interpretations in real-time simulation

## ✨ Features

✅ **Full Game Loop** - Draft → Orders → Interpretation → Resolution → Scoring  
✅ **AI-Powered Comedy** - Gemini generates unique misinterpretations every time  
✅ **Real-Time Combat** - 10-tick battle simulation with movement and attacks  
✅ **Hot-Seat Multiplayer** - 1v1 on same device  
✅ **Dynamic Chaos** - Interpretation quality degrades as chaos increases  
✅ **Rich Unit System** - 6 classes, 10+ quirks, procedural generation  

## 🎯 MVP Status

**What's Done:**
- ✅ Complete game loop
- ✅ Unit generation with classes and quirks
- ✅ Gemini AI integration for interpretation
- ✅ Battle simulation with movement & combat
- ✅ Scoring system with multiple win conditions
- ✅ Hot-seat multiplayer
- ✅ Visual feedback (health bars, effects, outcome stream)

**Coming Soon:**
- 🔜 Network multiplayer
- 🔜 3D visualization with Three.js
- 🔜 Battle replay system
- 🔜 More unit classes and abilities

## 📁 Project Structure

```
Dominiocracy/
├── web/                    # Next.js app
│   ├── app/
│   │   ├── api/interpret/  # Gemini API endpoint
│   │   ├── components/     # React components
│   │   ├── game/          # State management
│   │   ├── lib/           # Game logic (simulator, scoring)
│   │   └── types/         # TypeScript definitions
│   └── README.md          # Detailed docs
└── README.md              # This file
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **AI**: Google Gemini 2.0 Flash
- **Styling**: Tailwind CSS 4
- **Visualization**: Canvas API (Three.js planned)

## 🎲 Unit Quirks

Your soldiers come with "personality traits" that affect interpretation:

| Quirk | Effect |
|-------|--------|
| coffee-curious | Everything involves coffee |
| fire-enthusiast | Wants to burn things |
| easily-distracted | Gets sidetracked |
| overly-literal | Takes orders literally |
| rebel | Does the opposite |
| kiss-ass | Over-complies aggressively |
| paranoid | Sees threats everywhere |
| optimist/pessimist | Interprets with extreme bias |
| creative | Adds "artistic flair" |

## 🤝 Contributing

Want to add more chaos? PRs welcome!

Ideas:
- New unit classes (Bard, Necromancer, etc.)
- More quirk types
- Special abilities
- Environmental hazards
- Campaign mode

## 📝 License

MIT - Go forth and create military chaos

## 🎬 Credits

Inspired by the beautiful incompetence of *Idiocracy* and the chaos of actual military communications.

---

**Remember**: No plan survives contact with your own troops.
