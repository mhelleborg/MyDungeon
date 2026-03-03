import { entry, type HandlerResult } from './types'

export interface LightState {
  hasLight: boolean
  turnsRemaining: number
  permanent: boolean
}

export interface LightTickResult extends HandlerResult {
  newState: LightState
}

/**
 * Tick the light source one turn. Pure function.
 */
export function tickLight(state: LightState): LightTickResult {
  if (state.permanent) {
    return { logs: [], newState: { ...state } }
  }

  if (state.turnsRemaining <= 0) {
    return { logs: [], newState: { ...state } }
  }

  const remaining = state.turnsRemaining - 1
  const logs: HandlerResult['logs'] = []

  if (remaining === 10) {
    logs.push(entry('Your torch flickers and dims. It won\'t last much longer.', 'system'))
  }

  if (remaining <= 0) {
    logs.push(entry('Your torch sputters and dies. Darkness closes in.', 'system'))
    return { logs, newState: { hasLight: false, turnsRemaining: 0, permanent: false } }
  }

  return { logs, newState: { hasLight: true, turnsRemaining: remaining, permanent: false } }
}

export function lightTorch(): LightState {
  return { hasLight: true, turnsRemaining: 50, permanent: false }
}

export function castLightSpell(): LightState {
  return { hasLight: true, turnsRemaining: 0, permanent: true }
}
