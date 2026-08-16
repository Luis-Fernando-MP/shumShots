import type { SoloPose } from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/helpers'

export type SlotOffset = {
  x: number
  y: number
}

export const DEFAULT_SLOT_OFFSET: SlotOffset = { x: 0.5, y: 0.5 }

export type LayoutStateShape = {
  constrainToParent: boolean
  positionId: string
  slotOffset: Record<string, SlotOffset>
  advancedPose: SoloPose | null
}
