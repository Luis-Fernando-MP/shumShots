export const SLOT_QUANTITY_CONFIG = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5
} as const

export type SlotQuantity = (typeof SLOT_QUANTITY_CONFIG)[keyof typeof SLOT_QUANTITY_CONFIG]

export const SLOT_QUANTITIES = Object.values(SLOT_QUANTITY_CONFIG)

export const MIN_SLOT_QUANTITY = SLOT_QUANTITY_CONFIG.ONE
export const MAX_SLOT_QUANTITY = SLOT_QUANTITY_CONFIG.FIVE

export const clampSlotQuantity = (count: number): SlotQuantity => {
  const rounded = Math.round(count)
  if (rounded <= MIN_SLOT_QUANTITY) return MIN_SLOT_QUANTITY
  if (rounded >= MAX_SLOT_QUANTITY) return MAX_SLOT_QUANTITY
  return rounded as SlotQuantity
}
