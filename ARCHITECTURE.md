# Game Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOMINIOCRACY                              │
│            "Your Troops Are... Creative"                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: DRAFT                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Player 1: Select 6 units from pool of 10                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │Warrior│ │ Mage │ │Ranger│ │Cleric│ │ Rogue│ ... (choose 6)  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                                   │
│  Player 2: Select 6 units from pool of 10                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ Bard │ │Warrior│ │ Mage │ │Ranger│ │Cleric│ ... (choose 6)  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: ORDERS (Simultaneous)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Player 1: "Take the hill, be sneaky"                           │
│  Player 2: "Defend the center, hold position"                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [________________________________] [Issue Order]         │  │
│  │  Urgency: [low|med|high]  Resources: [conserve|standard]  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: INTERPRETATION (Gemini AI)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Order: "Take the hill, be sneaky"                              │
│                                                                   │
│  Unit 1001 (coffee-curious warrior):                            │
│  💭 "Build a Starbucks on the hill for tactical morale"         │
│                                                                   │
│  Unit 1002 (fire-enthusiast mage):                              │
│  💭 "Set the hill on fire so enemies can't see us"              │
│                                                                   │
│  Unit 1003 (overly-literal ranger):                             │
│  💭 "Pick up the hill and take it to a secure location"         │
│                                                                   │
│  Unit 1004 (rebel rogue):                                        │
│  💭 "Charge the hill loudly while juggling torches"             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: RESOLUTION (10 Ticks @ 500ms)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────── BATTLEFIELD ─────────────────────┐       │
│  │                                                        │       │
│  │    👤P1 ──→ 💥     👤P2                 👤P2          │       │
│  │         ⚔️           ↓                   ↓             │       │
│  │    👤P1 ←── 🔥     👤P1              🏗️👤P1          │       │
│  │                   (confused)       (building?)        │       │
│  │    [▓▓▓▓▓░] HP     [▓▓▓░░░] HP                       │       │
│  │                                                        │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                   │
│  Tick 0: Units begin moving                                      │
│  Tick 3: First contact! Warrior attacks Mage (-15 HP)           │
│  Tick 5: Mage casts fire spell! (-20 HP to Warrior)             │
│  Tick 7: Ranger is just... standing there                       │
│  Tick 9: Rogue builds something? What is that?                  │
│  Tick 10: Battle complete!                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: SCORING                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Player 1 Score:                                                 │
│  ├─ Units Alive: 4 × 20 = 80                                    │
│  ├─ Total Health: 180 / 2 = 90                                  │
│  └─ Territory: 35                                                │
│  Total: 205 points                                               │
│                                                                   │
│  Player 2 Score:                                                 │
│  ├─ Units Alive: 5 × 20 = 100                                   │
│  ├─ Total Health: 220 / 2 = 110                                 │
│  └─ Territory: 42                                                │
│  Total: 252 points                                               │
│                                                                   │
│  🏆 Player 2 wins this round!                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  NEXT ROUND or GAME OVER                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  IF units remain on both sides AND round < 5:                   │
│    → Increase chaos by 10                                        │
│    → Return to ORDERS phase                                      │
│                                                                   │
│  ELSE:                                                            │
│    → Calculate final winner                                      │
│    → Show "Play Again" button                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### 🎲 Unit Generation
- Random class selection (6 types)
- Random quirk assignment (2 per unit)
- Procedural stat generation
- Position randomization by player side

### 🤖 AI Integration
- Gemini 2.0 Flash API
- Prompt engineering for comedy
- Per-unit interpretation
- Quirk-based behavior modification

### ⚔️ Battle Simulation
- 10-tick system (500ms each)
- Actions: move, attack, defend, build, retreat, confused
- Damage calculation: attack - defense/2 + variance
- Health tracking and death detection

### 📊 Scoring Algorithm
```javascript
unitsAlive = aliveCount × 20
totalHealth = sum(health) / 2
territory = positionScore × 50 (based on avg X position)
total = unitsAlive + totalHealth + territory
```

### 🎨 Visual Feedback
- Unit colors by player (blue/red borders)
- Health bars during battle
- Quirk indicators (fire/coffee icons)
- Live outcome stream
- Phase/round/score display

## Tech Stack

```
Next.js 16 ──┐
React 19 ────┤
TypeScript ──┼──► Frontend
Tailwind 4 ──┤
Canvas API ──┘

Gemini 2.0 ──► AI Interpretation

Node.js ─────► Backend API
```

## File Structure

```
web/
├── app/
│   ├── api/
│   │   └── interpret/
│   │       └── route.ts          [Gemini integration]
│   ├── components/
│   │   ├── Billboard3DDemo.tsx   [Battle map]
│   │   ├── CommandComposer.tsx   [Order input]
│   │   ├── DraftPhase.tsx        [Unit selection]
│   │   ├── GroupSheet.tsx        [Unit details]
│   │   └── OutcomeStream.tsx     [Event feed]
│   ├── game/
│   │   └── GameContext.tsx       [State management]
│   ├── lib/
│   │   ├── unitGenerator.ts      [Unit creation]
│   │   ├── simulator.ts          [Battle logic]
│   │   └── scoring.ts            [Win conditions]
│   ├── types/
│   │   └── unit.ts               [Type definitions]
│   └── page.tsx                  [Main orchestration]
└── package.json
```

