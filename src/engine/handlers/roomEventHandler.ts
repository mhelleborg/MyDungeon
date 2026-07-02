import type { Room, RoomEvent } from '../../types/room'

export interface RoomEventContext {
  roomCleared: boolean
  revealedExits: ReadonlySet<string>
  choicesMade: Readonly<Record<string, string>>
  firedRoomEvents: ReadonlySet<string>
}

/**
 * Pure evaluation: which of the room's declarative events fire on this entry?
 * The store applies the effects (and records `once` events as fired).
 */
export function eligibleRoomEvents(room: Room, ctx: RoomEventContext): RoomEvent[] {
  if (!room.events) return []
  return room.events.filter(event => {
    if (event.once && event.id && ctx.firedRoomEvents.has(event.id)) return false
    // A choice is only ever presented until it has been made
    if (event.effect.type === 'choice' && ctx.choicesMade[event.effect.choiceId]) return false
    const when = event.when
    if (!when) return true
    if (when.roomCleared !== undefined && ctx.roomCleared !== when.roomCleared) return false
    if (when.exitRevealed && !ctx.revealedExits.has(`${room.id}-${when.exitRevealed}`)) return false
    if (when.choiceMade && !ctx.choicesMade[when.choiceMade]) return false
    return true
  })
}
