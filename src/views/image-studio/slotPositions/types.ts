export type SlotPlacement = {
  x: number
  y: number
  width: number
  height: number
  rotateZ: number
  rotateX: number
  rotateY: number
  zIndex: number
}

export type SlotBuildContext = {
  count: number
  canvasWidth: number
  canvasHeight: number
  slotSizes: { width: number; height: number }[]
  constrainToParent: boolean
}

export const PARENT_FIT_RATIO = 0.9
