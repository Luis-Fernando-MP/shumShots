export const parseRgb = (color: string) => {
  const [r = 255, g = 255, b = 255] = color.split(',').map(part => Number(part.trim()))
  return {
    r: Number.isFinite(r) ? r : 255,
    g: Number.isFinite(g) ? g : 255,
    b: Number.isFinite(b) ? b : 255
  }
}

export const rgbMix = (
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
) =>
  `${Math.round(a.r + (b.r - a.r) * t)},${Math.round(a.g + (b.g - a.g) * t)},${Math.round(a.b + (b.b - a.b) * t)}`
