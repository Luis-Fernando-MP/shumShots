import {
  clampSlotQuantity,
  SLOT_QUANTITY_CONFIG
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'

export type PictureLayoutPoint = {
  x: number
  y: number
}

export type PictureLayoutRect = PictureLayoutPoint

export const PICTURE_LAYOUTS: Record<number, PictureLayoutPoint[]> = {
  [SLOT_QUANTITY_CONFIG.ONE]: [{ x: 26.5, y: 23.75 }],
  [SLOT_QUANTITY_CONFIG.TWO]: [
    { x: 8, y: 28.75 },
    { x: 54, y: 28.75 }
  ],
  [SLOT_QUANTITY_CONFIG.THREE]: [
    { x: 4, y: 28.75 },
    { x: 35, y: 28.75 },
    { x: 66, y: 28.75 }
  ],
  [SLOT_QUANTITY_CONFIG.FOUR]: [
    { x: 8, y: 14 },
    { x: 52, y: 14 },
    { x: 8, y: 52 },
    { x: 52, y: 52 }
  ],
  [SLOT_QUANTITY_CONFIG.FIVE]: [
    { x: 4, y: 10 },
    { x: 35, y: 10 },
    { x: 66, y: 10 },
    { x: 18, y: 52 },
    { x: 52, y: 52 }
  ]
}

export const getPictureLayout = (count: number): PictureLayoutPoint[] =>
  PICTURE_LAYOUTS[clampSlotQuantity(count)] ?? PICTURE_LAYOUTS[SLOT_QUANTITY_CONFIG.ONE]
