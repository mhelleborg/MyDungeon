export interface ChoiceOption {
  id: string
  label: string
  description: string
}

export interface Choice {
  id: string
  name: string
  description: string
  options: ChoiceOption[]
  roomId: string
}

/** Runtime state when a choice is active (mirrors ActiveEncounter pattern). */
export interface ActiveChoice {
  choiceId: string
  options: ChoiceOption[]
}
