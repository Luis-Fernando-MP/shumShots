export type PictureLayoutRect = {
  x: number
  y: number
  w: number
  h: number
}

export const PICTURE_LAYOUTS: Record<number, PictureLayoutRect[]> = {
  1: [{ x: 18, y: 16, w: 64, h: 68 }],
  2: [
    { x: 6, y: 22, w: 42, h: 56 },
    { x: 52, y: 22, w: 42, h: 56 }
  ],
  3: [
    { x: 4, y: 24, w: 30, h: 52 },
    { x: 35, y: 24, w: 30, h: 52 },
    { x: 66, y: 24, w: 30, h: 52 }
  ],
  4: [
    { x: 8, y: 10, w: 40, h: 38 },
    { x: 52, y: 10, w: 40, h: 38 },
    { x: 8, y: 52, w: 40, h: 38 },
    { x: 52, y: 52, w: 40, h: 38 }
  ],
  5: [
    { x: 4, y: 8, w: 30, h: 40 },
    { x: 35, y: 8, w: 30, h: 40 },
    { x: 66, y: 8, w: 30, h: 40 },
    { x: 18, y: 52, w: 30, h: 40 },
    { x: 52, y: 52, w: 30, h: 40 }
  ]
}

export const getPictureLayout = (count: number): PictureLayoutRect[] =>
  PICTURE_LAYOUTS[Math.min(5, Math.max(1, count))] ?? PICTURE_LAYOUTS[1]
