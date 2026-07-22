# Game UX Redesign — Mobile-First, From First Principles

## Why redesign

The previous game screen stacked five independent boxes on a phone: room description
panel (own scroll), action buttons, direction buttons, combat log (own scroll), a tab
bar with an inline drawer that squeezed everything else, and a command input. On a
667px-tall phone the log — the game's primary feedback channel — got ~60px. Reading
required scrolling inside nested boxes; acting required reaching all over the screen;
typing was the primary way to do many things (dialogue, rest, talking to NPCs).

## First principles

A text-based dungeon crawler is a *reading and deciding* loop:

1. **One reading surface.** The story is the screen. Room descriptions, combat
   results and loot already flow into one game log — the UI should present that as a
   single scrolling narrative feed, not fragments duplicated across panels. No nested
   scroll regions competing for a phone's height.
2. **Act with thumbs.** Every routine decision must be one tap in the bottom third of
   the screen (the thumb zone), with ≥44px touch targets. Typing is a power-user
   option, never a requirement. That means buttons for: movement, attack, spells,
   items, dialogue options, choices, resting, talking.
3. **Glanceable state, deep state on demand.** HP is the only stat that must always
   be visible (header). Character sheet, inventory, quests and map are one tap away in
   bottom sheets that *overlay* the feed instead of squeezing it.
4. **Context over chrome.** Show only actions that are possible right now. A pinned
   context bar answers "where am I, where can I go" without scrolling. Combat pins
   enemy health next to the actions while it matters, and nothing else changes.
5. **One information architecture for all screens.** Desktop is not a different app:
   same feed, same context bar, same action chips — plus a persistent sidebar and an
   always-visible command input, because keyboard and screen space are available.

## The design

### Layout (mobile, portrait)

```
┌──────────────────────────────┐
│ MORIA  [HP ▓▓▓░ 24/30]  ☰   │  header: identity + vitals + menu
├──────────────────────────────┤
│ 📍 Chamber of Mazarbul       │  context bar: room + tappable exits
│    [↑ North] [→ East] [↓ S]  │
├──────────────────────────────┤
│                              │
│   ...unified story feed...   │  THE screen. One scroll surface.
│   (room text, combat, loot)  │  auto-follows; "↓ latest" pill
│                              │  when scrolled up
├──────────────────────────────┤
│ (combat: enemy HP bars)      │  pinned only while fighting
│ [Attack Orc] [Cast Fire] ... │  context chips: what you can do NOW
├──────────────────────────────┤
│  MAP   HERO   PACK  QUESTS ⌨ │  nav: bottom sheets + command toggle
└──────────────────────────────┘
```

- **Story feed** (`StoryFeed.vue`): renders the game log as a readable narrative —
  serif body text for story, colored mono for combat/loot/system, dim echoes for
  entered commands. Auto-scrolls on new entries unless the reader has scrolled up
  (then a "↓ latest" pill appears). Renders the last 250 entries for performance.
  Log filters (All / Combat / Loot / Story) stay available as small chips.
- **Context bar** (`RoomContextBar.vue`): current room name + exits as tappable
  chips. Replaces both the room panel header and the compass grid. Disabled during
  combat (movement is blocked by the engine anyway).
- **Action chips** (`ActionChips.vue` + `useContextActions.ts`): a single component
  that renders *everything actionable right now* as color-coded chips:
  - purple — story choices and **dialogue options** (previously type-only!)
  - red — attack targets, flee
  - blue — spells (with cooldown), equip
  - amber — take loot, use potions
  - neutral — talk to NPCs (previously type-only), rest, look, forge
- **Combat HUD** (`CombatHud.vue`): enemy HP bars pinned above the chips during
  combat, plus the boss bar. You never scroll to learn if the orc is nearly dead.
- **Bottom sheets** (`BottomSheet.vue`): Hero (stats), Pack (inventory), Quests, Map
  (minimap + world map) slide up over the feed, max ~70% of viewport, backdrop tap or
  ✕ to close, safe-area aware.
- **Command input**: hidden on mobile until the ⌨ toggle is tapped (then it opens
  focused above the nav). Always visible on desktop. Font ≥16px so iOS never zooms.

### Layout (desktop, ≥768px)

Same skeleton, plus room: center column holds context bar → feed → (combat HUD) →
chips → command input; a 288px sidebar holds character, inventory, quests, minimap
and the world-map button. Keyboard shortcuts unchanged (arrows to move, `/` to type,
`m` map, `Esc` menu, `a`/`f` in combat).

### What was removed

- `RoomDescription.vue` — its content already flows into the log; the panel
  duplicated the feed and stole ~35vh. Room identity lives in the context bar; the
  typewriter effect is replaced by a subtle per-entry fade-in (reading speed belongs
  to the reader).
- `DirectionControls.vue` — replaced by exit chips in the context bar (only real
  exits are shown, so no permanently disabled compass buttons).
- `ActionBar.vue` / `CombatLog.vue` — superseded by `ActionChips` / `StoryFeed`.
- The inline mobile tab drawer — replaced by overlay bottom sheets.

### Small but important

- `viewport-fit=cover` + `env(safe-area-inset-bottom)` padding on the dock so chips
  aren't under the iPhone home indicator.
- `100dvh` layout (already present) so the browser chrome collapsing doesn't hide
  the input.
- Touch targets: all chips, exits, and nav ≥44px tall on touch screens.
- `prefers-reduced-motion` respected for feed fade-ins (existing effects already
  comply).

## Validation

Validated with Playwright (Chromium) at 375×667 (iPhone SE), 390×844 (iPhone 14),
768×1024 (iPad portrait) and 1440×900 (desktop): full flow title → class select →
play → move → combat → sheets → menu, checking for horizontal overflow, touch-target
sizes, feed visibility with sheets open, and combat actions reachable without
scrolling. Screenshots are not committed; re-run `scripts/ux-check.mjs` (see repo
history / PR description) to reproduce.
