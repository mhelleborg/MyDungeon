# Mines of Moria

A text-based dungeon crawler set in the Mines of Moria from The Lord of the Rings. Navigate dark halls, battle orcs and goblins, and find your way to the East Gate — if you can survive.

## Features

- **Three playable classes**: Ranger, Wizard, Dwarf Warrior — each with unique stats, equipment, and abilities
- **18 interconnected rooms** with a minimap to track your progress
- **Turn-based combat** using simplified D&D rules (attack rolls, armor class, dice-based damage)
- **Spells and cooldowns** for the Wizard class
- **Loot system** — defeated enemies drop items on the ground for you to pick up
- **Context-aware action buttons** — clickable actions that change based on whether you're exploring or fighting
- **Text command input** for classic dungeon-crawling feel (`go north`, `attack goblin`, `cast fire bolt`, etc.)

## Tech Stack

- Vue 3 + Composition API + TypeScript
- Vite
- Pinia (state management)
- Tailwind CSS v4

## Getting Started

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.
