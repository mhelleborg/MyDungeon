# Open World RPG Plan — From Moria to Middle-earth

The goal: evolve MyDungeon from a linear two-act dungeon crawler into an open-world
Middle-earth RPG where the player travels freely between regions (Moria, Lothlórien,
Rivendell, Rohan, ...), picks up quests, grows a character over a long journey, and
returns to places they've been.

This plan is grounded in the current architecture and ordered so the game stays
playable after every phase.

---

## Where we are today

The good news is that most RPG building blocks already exist:

- **Rooms as a flat id-keyed graph** (`src/types/room.ts`, `src/data/rooms.ts`,
  `src/data/lothlorienRooms.ts`) with exits, locks, hidden passages, traps, darkness.
- **Two zones already exist** as "Acts" (`moria`, `lothlorien`) — proof the content
  model can host multiple areas.
- **Combat engine** with pure logic in `src/engine/` (d20, spells, status effects,
  crit/fumble tables, boss phases).
- **NPCs, branching dialogue trees, choices, encounters, puzzles, companions,
  crafting** — all present and data-driven.
- **XP/leveling** (basic), **save/load** with auto-save (`src/engine/saveLoad.ts`),
  achievements, run stats.

What blocks "open world" is that the campaign is **hardcoded as a linear pipeline**:

- `gameStore.ts` (~1750 lines) merges exactly two content sets by spread
  (`itemDb`, `allNPCs`, `allChoices`, ...) and routes story beats via
  `if (roomId === 'east-gate')`-style branches: act transition, victory, shrine
  blessing, forge crafting, boss gate — all literal room-ID checks.
- `ActId = 'moria' | 'lothlorien'` is a closed union; the zone join is a runtime
  exit injected into the `east-gate` room object.
- The minimap (`MiniMap.vue`) only imports Moria rooms, and zone grid coordinates
  collide (`east-gate` and `dimrill-dale` share 4,0).
- Victory **deletes the save** — the world ends when the story does.
- No quest journal: quests are implicit in choice flags.
- Enemy special abilities are `enemy.id === 'balrog'` string checks in
  `combatStore.ts`.

---

## Phase 1 — Region foundation (refactor, no new content)

**Goal:** replace the hardcoded two-act model with a generic **Region** system so
that adding a new area means adding data files, not editing the game store.

1. **`Region` type + world registry** (`src/types/region.ts`, `src/data/world.ts`)
   - `Region = { id, name, description, rooms, entryRoomId, enemies, items, npcs,
     choices, puzzles, encounters, interactions, levelRange, ambience }`.
   - Repackage the existing `moria` and `lothlorien` data files as two `Region`
     objects. A single `worldRegistry: Record<RegionId, Region>` replaces the
     spread-merges at the top of `gameStore.ts`.
   - `lookupRoom(id)` resolves through the registry; each room knows its region.
2. **Data-driven room events** — replace `if (roomId === ...)` branches in
   `enterRoom` with declarative fields on `Room` (extend the existing `onEnter`):
   `events: [{ trigger: 'enter'|'clear'|'first-visit', effect: 'complete-region' |
   'victory' | 'grant-blessing' | 'start-choice' | ..., condition? }]`.
   The Balrog gate in `moveHandler.ts` becomes a generic
   `blockedUntilCleared: roomId` field on `Exit`.
3. **Region-to-region travel edges** — exits gain an optional `targetRegionId`
   (or namespaced room IDs `region:room`), replacing the runtime exit injection
   at `east-gate`. Room IDs get prefixed per region to kill collisions.
4. **Minimap per region** — `MiniMap.vue` renders only the current region's rooms
   (fixes the Lothlórien-invisible bug and the coordinate collisions for free).
5. **Save v4 + migration** — `currentAct` → `currentRegionId`; room-keyed state
   stays flat but uses the new namespaced IDs. Write a v3→v4 migration in
   `saveLoad.ts` instead of discarding old saves.
6. **Don't delete the save on victory** — story completion becomes a milestone,
   not the end of the world (permadeath on death can stay).

**Done when:** the existing Moria→Lothlórien playthrough works identically, but
`gameStore.ts` contains zero literal room-ID checks and a third region could be
added purely under `src/data/regions/`.

## Phase 2 — The world map & travel

**Goal:** the "Middle-earth experience" — a region-level overworld you journey
across, distinct from walking room-to-room.

1. **World map screen** (`WorldMap.vue`) — a stylized Middle-earth map showing
   discovered regions, current location, and travel routes. Opens via `map`
   command / minimap toggle.
2. **Travel routes** (`src/data/world.ts`) — edges between regions with travel
   flavor text and a chance of **road encounters** (reuse the existing encounter
   system: ambush, traveler, merchant, campfire choice).
3. **Gateway rooms** — designated rooms (gates, docks, trailheads) from which
   `travel <region>` is available; travel is initially gated by story flags
   (e.g. Lothlórien opens after crossing Moria), then free once discovered.
4. **Fast travel** to previously visited gateway rooms (Middle-earth flavor:
   "known roads"), possibly with a cost (rest resources, gold, or an encounter roll).
5. **Rest & camp on the road** — extend the existing `rest` command to travel.

**Done when:** you can leave Lothlórien, walk back into Moria, and see a world
map showing both plus greyed-out undiscovered regions.

## Phase 3 — Quests & living progression

**Goal:** give the open world things to *do* and reasons to return.

1. **Quest system** (`src/types/quest.ts`, `questStore.ts`) —
   `Quest = { id, name, giver, stages: [{ objective, trigger }], rewards, region }`.
   Triggers hook into events that already exist: dialogue effects, room enter/clear,
   enemy kills, item pickup, choices. Convert the implicit quests (Balin's tome,
   Nimrodel fragments, forge reforging) into real quests.
2. **Quest journal UI** — a `journal`/`quests` command + sidebar panel showing
   active/completed quests and the current objective per quest.
3. **Deeper leveling** — ability score increases at milestone levels, per-class
   perks/abilities (Ranger stealth & bow skills, Wizard new spells, Dwarf
   toughness), so level 1→10 feels like a journey. Keep `addXp` in `playerStore`
   as the single entry point.
4. **Economy & equipment tiers** — settlements get shops (extend `tradeOffers`),
   more weapon/armor tiers per region level range, gold sinks (inn rest, fast
   travel, crafting materials).
5. **Multiple save slots / per-character saves** — namespace `SAVE_KEY` by slot;
   needed once runs get long.

**Done when:** a quest journal tracks at least the converted Moria/Lothlórien
quests end-to-end, and leveling past 5 changes how your class plays.

## Phase 4 — New regions (the actual Middle-earth)

**Goal:** grow the world region by region, each shippable independently now that
regions are pure data.

Suggested order (each ~15–25 rooms, own enemies/NPCs/quests/boss, level range):

1. **Rivendell + Eriador roads** (level 1–3) — a safe hub *before* Moria: inn,
   shops, quest givers, Elrond's counsel. Becomes the natural new starting area,
   with Moria as the level 3–5 chapter.
2. **The Misty Mountains High Pass** (level 4–6) — alternative route east; goblin
   tunnels, stone giants weather, Gollum-flavored cave encounter.
3. **Fangorn Forest** (level 6–8) — ents, huorns, orc warbands fleeing Isengard.
4. **Rohan / Edoras** (level 8–10) — plains travel, warg riders, second major hub.
5. Later: Mirkwood, Erebor & Dale, Isengard, the road to Mordor as the endgame arc.

Per-region checklist: rooms + grid layout, enemy set, NPCs + dialogue, 2–3 quests,
one setpiece (boss or major choice), region entry in the world map, encounter pool,
loot/shop tables tuned to the level range.

**Done when:** at least Rivendell ships and the game flows
Rivendell → Moria → Lothlórien with free travel back.

## Phase 5 — Open-world systems polish

**Goal:** make the world feel alive rather than a chain of cleared rooms.

1. **Data-driven enemy abilities** — move the `orc-captain`/`balrog`/`cave-troll`
   on-hit effects from `combatStore.doEnemyTurns()` string checks into
   `Enemy.abilities` data, so new regions' enemies get abilities without store edits.
2. **Repopulation** — cleared rooms in hostile regions can respawn weaker patrols
   after N room-visits or on region re-entry (keeps return trips interesting;
   safe hubs never respawn).
3. **World state & reputation** (optional) — flags for major deeds affecting NPC
   dialogue across regions ("you slew Durin's Bane" changes greetings in Edoras).
4. **Time/weather flavor** (optional) — day/night text variants, travel takes time.
5. **Balancing pass** — enemy scaling vs. level ranges, XP curve past level 10,
   difficulty multipliers per region.

---

## Working principles

- **Playable after every phase** — Phase 1 is a pure refactor validated against the
  existing playthrough; content phases ship one region at a time.
- **Keep the engine pure** — new mechanics follow the existing pattern: pure
  functions in `src/engine/` returning `{ logs, ... }`, stores apply mutations.
  This also keeps them unit-testable in `src/__tests__/`.
- **Data over code** — every hardcoded room-ID/enemy-ID branch removed in Phases 1
  and 5 is a prerequisite for cheap content in Phase 4.
- **Save migrations, not save wipes** — bump `SAVE_VERSION` with a migration each
  time the shape changes.
- **gameStore diet** — as the router grows, split handlers out of `gameStore.ts`
  (movement/exploration, dialogue/quests, meta) before it passes 2000 lines.

## Suggested sequencing

| Phase | Scope | Rough size |
|---|---|---|
| 1. Region foundation | Refactor, no new content | The critical enabler — do first |
| 2. World map & travel | New UI + travel mechanics | Medium |
| 3. Quests & progression | Quest journal, leveling, economy | Medium-large |
| 4. New regions | Content, one region at a time | Ongoing, parallelizable |
| 5. Systems polish | Respawn, data-driven abilities, balance | Incremental |

Phases 2 and 3 are independent of each other and can be swapped or interleaved;
both depend on Phase 1. Phase 4 content lands best after 2 + 3 exist, but a new
region's *data* can be authored any time after Phase 1.
