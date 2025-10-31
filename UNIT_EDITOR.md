# Unit Creation & Editing Feature

## Overview
Players can now create custom units and edit existing units during the draft phase, giving them full control over their army composition before battle begins.

---

## Features

### 1. **Create New Units** ✨
- Click the **"✨ Create Unit"** button in the draft phase header
- Fully customize every aspect of your unit:
  - Name (up to 30 characters)
  - Class (warrior, mage, ranger, cleric, rogue, bard)
  - Combat stats (attack, defense, speed, discipline, morale)
  - Max health (50-150 HP)
  - Up to 3 quirks from 10 available options

### 2. **Edit Existing Units** ✏️
- Click the **pencil icon (✏️)** on any unit card in the draft pool
- Modify stats, class, quirks, and name
- Changes apply immediately to both the pool and selected units

### 3. **Delete Units** 🗑️
- Click the **trash icon (🗑️)** on any unit card
- Confirm deletion in the popup
- Removes unit from both pool and selected units

### 4. **Stat Balancing**
- **Stat Budget:** 350 points total recommended
- Visual indicator shows current total vs. budget
- Color-coded feedback:
  - 🟢 Green: Under budget
  - 🟡 Yellow: Near budget (>90%)
  - 🔴 Red: Over budget (warning, but allowed)
- You can save over-budget units (for custom balance scenarios)

---

## User Interface

### Draft Phase Layout
```
┌────────────────────────────────────────────────────┐
│ Player X - Draft Your Units        [✨ Create Unit]│
│ Select 6 units for battle...                      │
│ Selected: 3 / 6                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌───────┐  ┌───────┐  ┌───────┐                 │
│  │✏️ 🗑️  │  │✏️ 🗑️  │  │✏️ 🗑️  │                 │
│  │ Unit 1 │  │ Unit 2 │  │ Unit 3 │                 │
│  │  [✓]  │  │       │  │       │                 │
│  └───────┘  └───────┘  └───────┘                 │
│                                                    │
├────────────────────────────────────────────────────┤
│ Select 3 more unit(s)         [Confirm Selection] │
└────────────────────────────────────────────────────┘
```

### Unit Card Actions
- **Click card** → Select/deselect for battle
- **Click ✏️** → Open editor
- **Click 🗑️** → Delete unit (with confirmation)

---

## Unit Editor Interface

### Sections

#### 1. **Basic Info**
- **Name Input:** Free-form text field (max 30 characters)
- **Class Selection:** 6 class buttons with:
  - Visual icon and color
  - Base stat descriptions
  - Visual selection highlight

#### 2. **Combat Stats (Sliders)**
Each stat has a slider (10-100 range):
- ⚔️ **Attack** (Red) - Damage output
- 🛡️ **Defense** (Blue) - Damage resistance
- ⚡ **Speed** (Green) - Turn order & movement
- 🎯 **Discipline** (Yellow) - Order following accuracy
- 😊 **Morale** (Purple) - Psychological resilience

Plus:
- ❤️ **Max Health** (Pink) - Starting HP (50-150 range)

#### 3. **Quirks**
- Grid of 10 available quirks:
  - `coffee-curious` - Obsessed with coffee
  - `fire-enthusiast` - Loves setting things ablaze
  - `easily-distracted` - Loses focus easily
  - `overly-literal` - Takes orders too literally
  - `rebel` - Questions authority
  - `kiss-ass` - Always agrees with command
  - `paranoid` - Suspicious of everything
  - `optimist` - Sees the bright side
  - `pessimist` - Expects the worst
  - `creative` - Interprets orders creatively

- **Selection:** Click to toggle (max 3)
- **Visual feedback:** Selected quirks are highlighted

#### 4. **Action Buttons**
- **Cancel** → Close without saving
- **Create Unit / Save Changes** → Apply changes

---

## Class Descriptions

| Class   | Icon | Color   | Strengths                           |
|---------|------|---------|-------------------------------------|
| Warrior | 👤   | Red     | High defense, moderate attack       |
| Mage    | 👤   | Blue    | Very high attack, low defense       |
| Ranger  | 👤   | Green   | Balanced, high speed                |
| Cleric  | 👤   | Yellow  | Low attack, high defense, support   |
| Rogue   | 👤   | Purple  | High attack & speed, low defense    |
| Bard    | 👤   | Pink    | Balanced stats across the board     |

---

## Technical Implementation

### New Components

1. **`UnitEditor.tsx`**
   - Full-screen modal with dark overlay
   - z-index: 60 (above draft phase)
   - Responsive design with scrollable content
   - Real-time stat budget calculation

2. **Updated `DraftPhase.tsx`**
   - Added state management for editor modal
   - Integrated edit/delete buttons on unit cards
   - "Create Unit" button in header
   - Handles create/update/delete callbacks

### State Management

#### New Handlers in `page.tsx`:
```typescript
handleCreateUnit(unit: Unit) → void
  - Adds unit to appropriate player pool

handleUpdateUnit(unit: Unit) → void
  - Updates unit in both pool and selected arrays

handleDeleteUnit(unitId: number) → void
  - Removes unit from both pool and selected arrays
```

### Data Flow
```
User Action → Draft Phase → Handler in page.tsx → Update State
                ↓
          Unit Editor Modal
                ↓
         Save/Cancel Action
                ↓
     Update pools & selections
```

---

## Usage Example

### Creating a Custom Tank Unit

1. Click **"✨ Create Unit"** during Player 1's draft
2. Enter name: **"Iron Wall"**
3. Select class: **Warrior**
4. Adjust stats:
   - Attack: 60
   - Defense: 95 (maximize!)
   - Speed: 40 (slow but steady)
   - Discipline: 75
   - Morale: 80
   - Max Health: 150
5. Select quirks:
   - `paranoid` (always on guard)
   - `overly-literal` (follows orders precisely)
6. **Total: 350** ✅ (within budget)
7. Click **"Create Unit"**
8. Unit appears in draft pool
9. Click to select for battle

### Editing an Existing Unit

1. Find a generated unit you like
2. Click the **✏️ Edit** button
3. Change name to something memorable
4. Adjust stats to your strategy
5. Add/remove quirks
6. Click **"Save Changes"**
7. Unit updates immediately

---

## Best Practices

### Balanced Builds
- **Front-line:** High defense + health, moderate attack
- **Glass cannon:** Very high attack, low defense, high speed
- **Support:** High discipline + morale, moderate all-around
- **Scout:** Very high speed, moderate attack, low defense

### Quirk Synergies
- `fire-enthusiast` + high attack = aggressive unit
- `paranoid` + high defense = defensive unit
- `overly-literal` + high discipline = reliable executor
- `creative` + low discipline = unpredictable wildcard

### Strategy Tips
- Balance your team composition
- Don't put all points in one stat
- Consider quirks for AI interpretation humor
- High discipline units follow orders better
- Low discipline units are more chaotic (fun!)

---

## Keyboard Shortcuts

- **Enter** in name field → (none, must click save)
- **Esc** → (could be added) Close editor

---

## Future Enhancements

Potential additions:
- [ ] Duplicate unit button
- [ ] Import/export custom unit templates
- [ ] Preset builds (tank, DPS, support)
- [ ] Stat presets by class
- [ ] Random unit generator with constraints
- [ ] Unit preview in battle formation
- [ ] Quirk descriptions on hover
- [ ] Class-specific ability preview

---

## Technical Notes

### Performance
- No re-renders during slider drag (uses state updates)
- Modal uses fixed positioning (no layout shifts)
- Efficient array updates with immutable patterns

### Accessibility
- All buttons have titles for tooltips
- Color-coded stats have text labels
- High contrast for readability

### Validation
- Name: Required, max 30 characters
- Stats: Range-limited by sliders (10-100)
- Quirks: Max 3 selections enforced
- Budget: Warning shown but not enforced

---

## Testing Checklist

- [x] Create new unit → appears in pool
- [x] Edit existing unit → changes apply
- [x] Delete unit → removes from pool and selections
- [x] Select created unit → adds to battle roster
- [x] Edit selected unit → updates in selections
- [x] Delete selected unit → removes from selections
- [x] Over-budget warning → displays correctly
- [x] Cancel editor → no changes applied
- [x] Player 1 & Player 2 → separate pools maintained
- [x] Build succeeds without errors

---

## Conclusion

The unit creation and editing system provides players with deep customization while maintaining the game's core "incompetent troops" humor through quirks and AI interpretation. Players can now craft their ideal (or hilariously flawed) army before each battle! 🎮

