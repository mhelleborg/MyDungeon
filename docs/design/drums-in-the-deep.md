# Drums in the Deep — Noise, Dread & Pursuit System

*High-level gameplay design proposal*

> "Drums, drums in the deep. They are coming."

## 1. Concept

Moria is currently a dangerous **place**, but it is not a dangerous **presence**. Enemies sit in
rooms and wait for you. Once a room is cleared, it is safe forever. The player can rest, backtrack,
and grind without consequence — the dungeon never reacts.

**Drums in the Deep** makes Moria itself hostile and *aware*. Every loud thing the player does —
fighting, smashing, fumbling, carrying an open flame through dark halls — raises an **Alarm**
meter. As the Alarm rises, the mines stir: ambient text darkens, drums echo, patrols appear, and
eventually a **Hunting Party** of orcs spawns somewhere in the room graph and actively moves
toward the player, turn by turn, until it catches them or loses the trail.

The player counters with the tools the game already has: darkness, stealth, fleeing, hiding, and a
few new tricks (dousing the torch, barricading doors, throwing a stone as a decoy). The result is a
constant push-pull between **light** (you can see, fight well, find hidden exits) and **silence**
(you stay hidden, but stumble blind).

This is the Fellowship's actual Moria experience: not a room-by-room crawl, but a held breath —
*move quietly, light nothing, wake nothing*.

## 2. Why this feature

- **It creates tension between existing systems instead of adding a parallel one.** Light is
  currently a pure upside (see the room, reveal exits, no dark-combat penalty). With Alarm, light
  becomes a meaningful trade-off. Stealth and flee, currently niche verbs, become a core playstyle.
- **It fixes the pacing flaw of cleared-room safety.** Backtracking and resting stay possible but
  stop being free.
- **It deepens replayability along existing class lines.** The Dwarf Warrior fights loud and tanks
  the consequences; the Ranger plays the quiet game; the Wizard manages the Light spell as a
  liability as much as a tool.
- **It is thematically perfect.** Drums in the deep is *the* Moria scene, and the game's Balrog
  finale lands harder when the whole act has been about waking something you shouldn't.
- **It fits the architecture.** The game already ticks state per command (light), has a connected
  room graph, ambient events, a pure-handler pattern, and a save pipeline. The Hunt is "an enemy
  group with a room id and a move-per-turn rule" — cheap to model, big in effect.

## 3. Player experience walkthrough

1. **Quiet start (Alarm 0–24, "Silence").** Normal play. Occasional flavor: *"Your footsteps echo
   farther than you'd like."*
2. **The mines stir (Alarm 25–49, "Stirring").** Ambient drum lines appear. Random encounter
   chance in cleared rooms creeps up. Resting takes longer / can be interrupted.
3. **They know (Alarm 50–79, "Hunted").** A Hunting Party spawns in a distant room and moves one
   room per player action toward the player's *last known position* (updated whenever the player
   makes noise or stands in a lit room). The minimap shows a red marker on rooms where drums were
   heard. Log cues scale with distance: *"Drums, far off."* → *"Iron boots in the next hall."*
4. **Caught (party reaches the player).** A hard ambush combat starts — enemies get a surprise
   round unless the player was hiding. Winning it drops Alarm sharply (you silenced the hunters);
   fleeing it leaves the party alive and angry.
5. **Going dark.** At any point the player can douse the torch, `hide`, and stop making noise.
   The party moves to the last known position, searches a couple of rooms, then disbands and Alarm
   decays. Surviving a hunt this way should feel like the best moment in the game.
6. **The deep answers (Alarm 90+, "The Deep Wakes" — one-time event).** A scripted near-miss with
   something far worse than orcs (a tremor, a distant roar, a glimpse of flame). No combat — pure
   dread, plus a permanent Alarm floor for the rest of the act. Foreshadows the Balrog.

## 4. Core mechanics

### 4.1 The Alarm meter

A single 0–100 value, persisted in the save.

**Noise sources (raise Alarm):**

| Action | Alarm |
|---|---|
| Each combat round fought | +2 (+4 for Wizard fire spells) |
| Killing an enemy | +3 |
| Attack fumble (nat 1) / triggering a trap | +3 |
| Smashing or forcing something (failed STR checks, breaking doors) | +5 |
| Moving while carrying lit torch/Light spell | +1 per move |
| Failed sneak attempt | +4 |
| Resting | +5 flat (you're stationary and vulnerable) |

**Decay (lower Alarm):**

- −1 per quiet action (moving unlit, looking, examining — anything not in the table above).
- −10 for defeating a Hunting Party ("you ended the ones who knew").
- Certain rooms are **sanctuaries** (e.g., Balin's Tomb after clearing, sealed side-chambers):
  decay doubled, hunts cannot enter. Gives the player deliberate breathing room and makes those
  rooms matter.

**Class/loadout modifiers (data-driven, on the character):** Ranger noise ×0.75; Dwarf Warrior
noise ×1.25 but ambush surprise rounds never apply to him (too sturdy to panic); heavy armor +1
noise on moves. This is one multiplier field, not a new subsystem.

### 4.2 The Hunt

- At Alarm ≥ 50 (and not already hunting), spawn a **Hunting Party**: an entity with `roomId`,
  `targetRoomId` (player's last known position), `strength` (scales with Alarm and difficulty),
  and `searchTurnsLeft`.
- After every player command that advances time (same gate the light tick uses), the party moves
  one step along the shortest path through the room graph toward `targetRoomId`. BFS over room
  exits — the graph is ~18 nodes, trivial.
- **Last known position** updates to the player's current room whenever the player makes noise ≥ 3
  in one action *or* ends an action in a lit room adjacent to the party.
- On arriving at `targetRoomId` without finding the player, the party searches: it visits up to 2
  adjacent rooms, then disbands (Alarm −15, message: *"The drums fade, unsatisfied."*).
- On entering the player's room: ambush combat. Surprise round against the player unless hidden
  (see 4.3). Party composition comes from a small spawn table keyed by Alarm tier (2 goblins →
  orc warband with a drummer "captain" who buffs the others — killing the drummer first is the
  tactical choice).
- Maximum one active party at a time (keeps the model and the UI simple).

### 4.3 Counterplay verbs

| Verb | Effect |
|---|---|
| `hide` (new) | DEX check vs party perception. While hidden and unlit, the party passes through your room. Success thresholds reuse `skillChecks.ts`. |
| `douse` (new) | Extinguish torch/Light early. Instantly stops light-based position reveals. (Light spell on cooldown after dousing.) |
| `throw stone <direction>` (new) | Decoy: sets the party's `targetRoomId` to a room in that direction. One stone per pickup; stones are scattered loot in rubble rooms. |
| `barricade` (new) | In rooms with a door, a STR check delays the party 2–3 turns at that exit. Loud (+4 Alarm) — a trade of position for time. |
| `sneak` (existing) | Already parsed; success now also suppresses the noise of the next move. |
| `listen` (new, free action) | Reports party distance in rooms ("the drums are two halls away") and current Alarm tier. The diegetic UI for the whole system. |

### 4.4 What it deliberately does **not** do

- No real-time pressure — everything ticks on player commands, preserving the turn-based feel.
- No permanent fail state from Alarm alone. Max Alarm makes Moria brutal, not unwinnable.
- No pursuit in Act 2 (Lothlórien is the explicit tonal release — safety after the dark). The
  system is Moria-only, which also halves the content burden.

## 5. UI

- **Alarm indicator:** a small flame/drum icon near the minimap with 4 states (Silence / Stirring /
  Hunted / The Deep Wakes). No raw number shown — tiers only, to keep it diegetic. Tooltip text
  explains the tier.
- **Minimap:** red pulse on the room the Hunting Party currently occupies *only if* the player has
  heard it recently (`listen`, or party within 2 rooms). Otherwise unknown — fog of war for the
  hunter.
- **Log lines** carry most of the information, matching the game's text-first identity: drum
  distance cues, ambient stirring lines (extend `ambientEvents.ts` with Alarm-tier-gated entries).
- **Context action buttons** (existing pattern): `Hide`, `Douse torch`, `Listen` appear when a hunt
  is active.

## 6. Architecture & integration (high level)

Follows the established handler/data/store pattern; no engine rework needed.

| Piece | Where | Notes |
|---|---|---|
| Types | `src/types/dread.ts` | `AlarmState`, `HuntingParty`, noise event payloads |
| Pure logic | `src/engine/handlers/dreadHandler.ts` | `applyNoise()`, `tickHunt()` (BFS pathing), `attemptHide()`, `resolveAmbush()` — all pure, returning `{ logs, newState }` like `lightHandler.ts` |
| Spawn tables / tuning | `src/data/dread.ts` | Noise values, tier thresholds, party compositions per tier and difficulty, sanctuary room ids |
| State | `src/stores/gameStore.ts` (or a small `dreadStore`) | `alarm`, `huntingParty` refs; tick wired next to the existing light tick at the end of `handleCommand` |
| Noise emission | existing handlers | combat rounds, traps, failed checks, rest — each emits a noise event constant; one-line additions at existing sites |
| Parser | `src/engine/commandParser.ts` | `hide`, `douse`, `listen`, `throw`, `barricade` |
| Persistence | `src/types/save.ts`, `src/engine/saveLoad.ts` | two new fields (`alarm`, `huntingParty`); missing fields default to zero/null so old saves load clean |
| UI | `components/` | Alarm tier icon, minimap marker, context buttons |

The single most important implementation property: **the hunt ticks in exactly one place** (the
same post-command hook as the light tick), so it can never desync from the turn economy.

## 7. Tuning, difficulty & achievements

- All numbers in section 4 live in `data/dread.ts` and scale with the existing difficulty
  multipliers: Easy = slower Alarm gain, parties search less; Hard = faster gain, parties update
  last-known-position more aggressively.
- Target feel on Normal: a typical playthrough triggers **1–2 hunts**; a loud playthrough triggers
  3–4; a careful Ranger can finish with zero.
- New achievements (fits the existing 15+ set):
  - **Quiet as a Mouse** — finish Act 1 without ever reaching the Hunted tier.
  - **Fool of a Took** — reach max Alarm (a badge of dishonor, the fun kind).
  - **Drum Solo** — defeat a Hunting Party's drummer before it lands a buff.
  - **Ghost of Moria** — evade a full hunt using `hide` without fighting it.

## 8. Build phases

1. **MVP (the meter):** Alarm value, noise emission from combat/traps/rest, decay, ambient
   tier-gated log lines, encounter-rate scaling, save support. Ships value alone — Moria already
   feels reactive.
2. **The Hunt:** party spawn, BFS movement, distance audio cues in the log, ambush combat,
   `listen` + `hide` + `douse`. The heart of the feature.
3. **Counterplay & polish:** stones/decoys, barricades, sanctuaries, minimap marker, class
   modifiers, achievements, "The Deep Wakes" scripted event.

## 9. Risks & open questions

- **Frustration risk:** a hunt landing on a low-HP player can feel unfair. Mitigations: parties
  never spawn within 2 rooms of the player, sanctuaries always offer an out, and the first hunt per
  game is telegraphed extra loudly.
- **Backtracking friction:** Alarm punishes wandering; the minimap and decay-on-quiet-moves need to
  make careful backtracking viable, not tedious. Tune decay generously at first.
- **Wizard Light spell:** if light is too penalized, the Wizard's identity suffers. Possible
  compromise: the Light spell is *dimmable* (`douse` suppresses rather than cancels it), making the
  Wizard the most flexible class rather than the loudest.
- **Open:** should the Balrog fight difficulty scale with peak Alarm reached (you woke it angrier)?
  Strong thematic hook, but needs balancing care. Suggested: cosmetic/dialogue changes only in v1.
