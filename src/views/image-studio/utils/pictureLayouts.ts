export type PictureLayoutPoint = {
  x: number
  y: number
}

export type PictureLayoutRect = PictureLayoutPoint

export const PICTURE_LAYOUTS: Record<number, PictureLayoutPoint[]> = {
  1: [{ x: 26.5, y: 23.75 }],
  2: [
    { x: 8, y: 28.75 },
    { x: 54, y: 28.75 }
  ],
  3: [
    { x: 4, y: 28.75 },
    { x: 35, y: 28.75 },
    { x: 66, y: 28.75 }
  ],
  4: [
    { x: 8, y: 14 },
    { x: 52, y: 14 },
    { x: 8, y: 52 },
    { x: 52, y: 52 }
  ],
  5: [
    { x: 4, y: 10 },
    { x: 35, y: 10 },
    { x: 66, y: 10 },
    { x: 18, y: 52 },
    { x: 52, y: 52 }
  ]
}

export const getPictureLayout = (count: number): PictureLayoutPoint[] =>
  PICTURE_LAYOUTS[Math.min(5, Math.max(1, count))] ?? PICTURE_LAYOUTS[1]
