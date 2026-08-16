export type SlotOffset = {
  x: number
  y: number
}

/** Normalized pad center (0.5, 0.5) = no shift. Max shift is ± this fraction of canvas size. */
export const SLOT_OFFSET_MAX_SHIFT = 0.35

export const DEFAULT_SLOT_OFFSET: SlotOffset = { x: 0.5, y: 0.5 }

export type LayoutStateShape = {
  constrainToParent: boolean
  positionId: string
  slotOffset: Record<string, SlotOffset>
}
