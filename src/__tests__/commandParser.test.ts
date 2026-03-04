import { describe, it, expect } from 'vitest'
import { parseCommand } from '../engine/commandParser'

describe('parseCommand', () => {
  describe('direction shortcuts', () => {
    it.each([
      ['n', 'north'], ['s', 'south'], ['e', 'east'], ['w', 'west'],
      ['u', 'up'], ['d', 'down'],
      ['north', 'north'], ['south', 'south'],
    ])('"%s" → move %s', (input, dir) => {
      const cmd = parseCommand(input)
      expect(cmd.type).toBe('move')
      expect(cmd.target).toBe(dir)
    })
  })

  describe('movement verbs', () => {
    it('go north', () => {
      const cmd = parseCommand('go north')
      expect(cmd.type).toBe('move')
      expect(cmd.target).toBe('north')
    })

    it('walk east', () => {
      const cmd = parseCommand('walk east')
      expect(cmd.type).toBe('move')
      expect(cmd.target).toBe('east')
    })
  })

  describe('look / examine', () => {
    it('look with no target → look', () => {
      expect(parseCommand('look').type).toBe('look')
    })

    it('look at something → examine', () => {
      const cmd = parseCommand('look pillar')
      expect(cmd.type).toBe('examine')
      expect(cmd.target).toBe('pillar')
    })

    it('examine target', () => {
      const cmd = parseCommand('examine bones')
      expect(cmd.type).toBe('examine')
      expect(cmd.target).toBe('bones')
    })

    it('inspect alias', () => {
      expect(parseCommand('inspect runes').type).toBe('examine')
    })
  })

  describe('combat', () => {
    it('attack', () => expect(parseCommand('attack goblin').type).toBe('attack'))
    it('hit alias', () => expect(parseCommand('hit orc').type).toBe('attack'))
    it('cast', () => {
      const cmd = parseCommand('cast fireball')
      expect(cmd.type).toBe('cast')
      expect(cmd.target).toBe('fireball')
    })
  })

  describe('items', () => {
    it('take / get / grab', () => {
      expect(parseCommand('take sword').type).toBe('take')
      expect(parseCommand('get potion').type).toBe('take')
      expect(parseCommand('grab key').type).toBe('take')
    })

    it('drop', () => expect(parseCommand('drop sword').type).toBe('drop'))
    it('use / drink', () => {
      expect(parseCommand('use potion').type).toBe('use')
      expect(parseCommand('drink potion').type).toBe('use')
    })
    it('equip / wield', () => {
      expect(parseCommand('equip sword').type).toBe('equip')
      expect(parseCommand('wield axe').type).toBe('equip')
    })
  })

  describe('search and destroy', () => {
    it('search', () => {
      const cmd = parseCommand('search bones')
      expect(cmd.type).toBe('search')
      expect(cmd.target).toBe('bones')
    })

    it('loot alias', () => expect(parseCommand('loot pile').type).toBe('search'))
    it('rummage alias', () => expect(parseCommand('rummage chest').type).toBe('search'))

    it('destroy', () => expect(parseCommand('destroy').type).toBe('destroy'))
    it('smash alias', () => expect(parseCommand('smash trap').type).toBe('destroy'))
    it('break alias', () => expect(parseCommand('break trap').type).toBe('destroy'))
  })

  describe('other commands', () => {
    it('disarm', () => expect(parseCommand('disarm').type).toBe('disarm'))
    it('flee / run / escape', () => {
      expect(parseCommand('flee').type).toBe('flee')
      expect(parseCommand('run').type).toBe('flee')
      expect(parseCommand('escape').type).toBe('flee')
    })
    it('sneak with direction', () => {
      const cmd = parseCommand('sneak north')
      expect(cmd.type).toBe('sneak')
      expect(cmd.target).toBe('north')
    })
    it('rest / sleep', () => {
      expect(parseCommand('rest').type).toBe('rest')
      expect(parseCommand('sleep').type).toBe('rest')
    })
    it('talk / speak', () => expect(parseCommand('talk dwarf').type).toBe('talk'))
    it('trade / buy', () => {
      expect(parseCommand('trade').type).toBe('trade')
      expect(parseCommand('buy potion').type).toBe('trade')
    })
    it('say', () => {
      const cmd = parseCommand('say mellon')
      expect(cmd.type).toBe('say')
      expect(cmd.target).toBe('mellon')
    })
    it('solve / pull', () => {
      expect(parseCommand('solve left right').type).toBe('solve')
      expect(parseCommand('pull lever').type).toBe('solve')
    })
  })

  describe('info commands', () => {
    it('inventory / inv / i', () => {
      expect(parseCommand('inventory').type).toBe('inventory')
      expect(parseCommand('inv').type).toBe('inventory')
      expect(parseCommand('i').type).toBe('inventory')
    })
    it('stats / status', () => {
      expect(parseCommand('stats').type).toBe('stats')
      expect(parseCommand('status').type).toBe('stats')
    })
    it('help / ?', () => {
      expect(parseCommand('help').type).toBe('help')
      expect(parseCommand('?').type).toBe('help')
    })
    it('map', () => expect(parseCommand('map').type).toBe('map'))
  })

  describe('edge cases', () => {
    it('empty string → unknown', () => expect(parseCommand('').type).toBe('unknown'))
    it('gibberish → unknown', () => expect(parseCommand('xyzzy').type).toBe('unknown'))
    it('preserves raw input', () => expect(parseCommand('  Go North  ').raw).toBe('Go North'))
  })
})
