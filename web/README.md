# Dominiocracy

An auto-battler where you give orders and your troops "interpret" them... poorly.

## 🎮 Game Overview

Dominiocracy is a comedic strategy game where:
- Two players draft units with random quirks
- Each round, both players give simultaneous orders
- Units misinterpret orders based on their quirks and low discipline
- A 10-tick battle simulation plays out with hilarious results
- Winner is determined by score (units alive, health, territory control)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- A Gemini API key (get one at https://ai.google.dev)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the `web` directory:
```bash
GEMINI_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 🎯 How to Play

1. **Draft Phase**: Each player selects 6 units from a pool of 10 random units
2. **Orders Phase**: Both players type one command for their units (e.g., "take the hill, be sneaky")
3. **Interpretation Phase**: Gemini AI interprets each unit's understanding of the order based on their quirks
4. **Resolution Phase**: 10-tick battle simulation with movement, combat, and chaos
5. **Scoring**: Points awarded for units alive, remaining health, and territory control
6. Repeat for up to 5 rounds or until one side is eliminated

## 🧠 Unit Quirks

Units can have quirks that affect interpretation:
- **coffee-curious**: Everything involves coffee somehow
- **fire-enthusiast**: Wants to set things on fire
- **easily-distracted**: Gets sidetracked
- **overly-literal**: Takes everything literally
- **rebel**: Does the opposite
- **kiss-ass**: Over-complies
- **paranoid**: Sees threats everywhere
- **optimist/pessimist**: Interprets with bias
- **creative**: Adds "artistic flair"

## 🏗️ Tech Stack

- **Next.js 16** (React 19)
- **TypeScript**
- **Tailwind CSS 4**
- **Gemini 2.0 Flash** (AI interpretation)
- **Canvas API** (battlefield visualization)

## 📁 Project Structure

```
web/
├── app/
│   ├── api/interpret/      # Gemini API route
│   ├── components/         # UI components
│   ├── game/              # Game state management
│   ├── lib/               # Game logic (simulator, scoring, etc.)
│   ├── types/             # TypeScript types
│   └── page.tsx           # Main game orchestration
```

## 🎨 Key Features Implemented

✅ Complete game loop (draft → orders → interpret → resolve → score)  
✅ Gemini AI integration for comedic misinterpretation  
✅ 10-tick battle simulation with movement and combat  
✅ Real-time unit visualization with health bars  
✅ Scoring system with multiple win conditions  
✅ Hot-seat multiplayer (1v1 on same device)  
✅ Dynamic chaos level affecting interpretation  

## 🔮 Future Enhancements

- Network multiplayer
- More unit classes and quirks
- 3D visualization with Three.js
- Replay system
- Custom unit creation
- Campaign mode

## 📝 License

MIT
