import type { SlotOffset } from './type.layout'

/** How far a slot may hang outside the parent, as a fraction of its own size. */
export const SLOT_MOVE_OVERFLOW = 0.22

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const clamp01 = (value: number) => clamp(value, 0, 1)

type SlotBox = { x: number; y: number; width: number; height: number }
type CanvasBox = { width: number; height: number }

export const slotMoveBounds = (slot: SlotBox, canvas: CanvasBox) => {
  const overflowX = slot.width * SLOT_MOVE_OVERFLOW
  const overflowY = slot.height * SLOT_MOVE_OVERFLOW
  return {
    minX: Math.min(-overflowX, slot.x),
    maxX: Math.max(canvas.width - slot.width + overflowX, slot.x),
    minY: Math.min(-overflowY, slot.y),
    maxY: Math.max(canvas.height - slot.height + overflowY, slot.y)
  }
}

const offsetToShift = (offset: number, minShift: number, maxShift: number) => {
  if (offset <= 0.5) {
    const span = Math.min(0, minShift)
    return span * (1 - offset / 0.5)
  }
  const span = Math.max(0, maxShift)
  return span * ((offset - 0.5) / 0.5)
}

export const shiftToOffset = (shift: number, minShift: number, maxShift: number) => {
  if (shift <= 0) {
    if (minShift >= -0.5) return 0.5
    return clamp01(0.5 * (1 - shift / minShift))
  }
  if (maxShift <= 0.5) return 0.5
  return clamp01(0.5 + 0.5 * (shift / maxShift))
}

export const applySlotOffset = <T extends SlotBox>(
  placement: T,
  offset: SlotOffset,
  canvas: CanvasBox
): T => {
  const bounds = slotMoveBounds(placement, canvas)
  const x = placement.x + offsetToShift(offset.x, bounds.minX - placement.x, bounds.maxX - placement.x)
  const y = placement.y + offsetToShift(offset.y, bounds.minY - placement.y, bounds.maxY - placement.y)
  return {
    ...placement,
    x: clamp(x, bounds.minX, bounds.maxX),
    y: clamp(y, bounds.minY, bounds.maxY)
  }
}

export const visualPositionToOffset = (
  placement: SlotBox,
  visual: { x: number; y: number },
  canvas: CanvasBox
): SlotOffset => {
  const bounds = slotMoveBounds(placement, canvas)
  const x = clamp(visual.x, bounds.minX, bounds.maxX)
  const y = clamp(visual.y, bounds.minY, bounds.maxY)
  return {
    x: shiftToOffset(x - placement.x, bounds.minX - placement.x, bounds.maxX - placement.x),
    y: shiftToOffset(y - placement.y, bounds.minY - placement.y, bounds.maxY - placement.y)
  }
}
