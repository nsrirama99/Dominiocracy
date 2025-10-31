# 🐛 Bug Fixes & UX Improvements

## Issues Fixed

### 1. ✅ Player 2 Actions Not Showing/Performing

**Root Causes:**
1. **Shallow copy in simulator** - The `runFullSimulation` function was doing `{ ...u }` which doesn't copy nested objects like `currentIntent`, `state`, and `stats`
2. **Incomplete state updates** - The `updateUnit` function in GameContext wasn't properly merging nested objects

**Fixes:**
- **simulator.ts**: Implemented proper deep copy of units with all nested objects:
  ```typescript
  units: initialUnits.map(u => ({
    ...u,
    stats: { ...u.stats },
    state: { ...u.state, position: { ...u.state.position } },
    quirks: [...u.quirks],
    currentIntent: u.currentIntent ? { 
      ...u.currentIntent,
      targetPosition: { ...u.currentIntent.targetPosition }
    } : undefined
  }))
  ```

- **GameContext.tsx**: Fixed `updateUnit` to properly merge nested state:
  ```typescript
  const updateUnit = (unitId: number, updates: Partial<Unit>) => {
    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          ...updates,
          state: updates.state ? { ...u.state, ...updates.state } : u.state,
          stats: updates.stats ? { ...u.stats, ...updates.stats } : u.stats
        };
      }
      return u;
    }));
  };
  ```

**Impact:** Player 2 units now properly receive and execute their interpreted intents during battle simulation.

---

### 2. ✅ Improved Battle Log UX

**Issue:** Notifications were shown as cards on the bottom-left, making it hard to follow the action flow.

**Fix:** Redesigned `OutcomeStream` as a proper chat box interface:

**Features:**
- ✅ Fixed position on the right side (full height)
- ✅ Auto-scrolling to bottom for new messages
- ✅ Color-coded messages by player:
  - Blue border/background for Player 1 actions
  - Red border/background for Player 2 actions
  - Special styling for deaths, attacks
- ✅ Proper header with event count
- ✅ Empty state message
- ✅ Messages display in chronological order (oldest at top)
- ✅ Better typography and spacing
- ✅ Smooth animations for new messages

**Visual Changes:**
```
┌─────────────────────────────┐
│ ● Battle Log      25 events │
├─────────────────────────────┤
│ 📜 P1 issued order          │
│    "take the hill"    [P1]  │
├─────────────────────────────┤
│ 📜 P2 issued order          │
│    "defend center"    [P2]  │
├─────────────────────────────┤
│ 💭 Unit interpretation [P1] │
│    "Build coffee shop..."   │
├─────────────────────────────┤
│ [Auto-scrolls to bottom]    │
└─────────────────────────────┘
```

**Layout Adjustment:**
- Main game view shifted left to accommodate right-side chat
- Chat takes up ~400px on the right side
- Status bar remains at top

---

### 3. ✅ Enter Key to Submit Orders

**Issue:** Users had to click the button to submit orders.

**Fix:** Added keyboard handler to `CommandComposer`:

**Features:**
- ✅ Press **Enter** to submit order
- ✅ Input clears after submission (both Enter and button click)
- ✅ Visual hint "Press Enter to submit" in preview section
- ✅ Shift+Enter reserved for future multi-line input (if needed)

**Implementation:**
```typescript
onKeyDown={(e) => {
  if (e.key === "Enter" && text && !e.shiftKey) {
    e.preventDefault();
    onSend?.({ text, urgency, resources, targetLabel, personalities });
    setText(""); // Clear input after sending
  }
}}
```

**UX Improvements:**
- Faster order submission workflow
- Better keyboard-first experience
- Consistent with chat/messaging UX patterns

---

## Testing Checklist

- [x] Build succeeds without errors
- [x] TypeScript type checking passes
- [x] Player 1 units receive and execute intents
- [x] Player 2 units receive and execute intents
- [x] Battle log shows all events chronologically
- [x] Battle log auto-scrolls to new messages
- [x] Player colors are properly distinguished (P1 = blue, P2 = red)
- [x] Enter key submits orders
- [x] Input clears after submission
- [x] Layout accommodates right-side chat

---

## Files Modified

1. **web/app/lib/simulator.ts**
   - Fixed deep copy in `runFullSimulation`
   - Ensures all nested objects (intent, position, stats) are properly cloned

2. **web/app/game/GameContext.tsx**
   - Fixed `updateUnit` to properly merge nested state
   - Preserves state/stats objects when updating

3. **web/app/components/OutcomeStream.tsx**
   - Complete redesign as chat box interface
   - Added auto-scroll, color coding, better styling

4. **web/app/components/CommandComposer.tsx**
   - Added Enter key handler
   - Added input clearing after submission
   - Added visual hint for keyboard shortcut

5. **web/app/page.tsx**
   - Adjusted layout to accommodate right-side chat
   - Added margin to main game view

---

## Performance Notes

- Auto-scroll uses `useEffect` with outcomes dependency
- Deep copying in simulator is minimal performance impact (~12 units)
- Chat renders in reverse order for optimal UX (newest at bottom)

---

## Known Improvements for Future

- [ ] Add ability to clear/filter battle log
- [ ] Add timestamps to messages
- [ ] Add copy-to-clipboard for battle log
- [ ] Add sound effects for different event types
- [ ] Add keyboard shortcuts (Esc to cancel, etc.)

---

## 🎉 Summary

All three reported issues have been fixed:
1. ✅ Player 2 actions now work correctly
2. ✅ Battle log is now a proper chat interface on the right
3. ✅ Enter key submits orders

The game should now provide a much better UX with all players' actions properly executing and visible in a clean, organized battle log!

