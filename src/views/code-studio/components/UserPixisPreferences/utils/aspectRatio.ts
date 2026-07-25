export const SIZE_MIN = 200
export const SIZE_MAX = 1200

export const ASPECT_DEFAULT = 'default'
export const ASPECT_FREE = 'free'

export const ASPECT_PRESETS = [
  { id: '1:1', label: '1:1' },
  { id: '4:3', label: '4:3' },
  { id: '3:2', label: '3:2' },
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: '21:9', label: '21:9' }
] as const

export const clampSize = (value: number) => Math.min(SIZE_MAX, Math.max(SIZE_MIN, Math.round(value)))

const gcd = (a: number, b: number): number => {
  let x = Math.abs(Math.round(a))
  let y = Math.abs(Math.round(b))
  while (y !== 0) {
    const next = x % y
    x = y
    y = next
  }
  return x || 1
}

export const simplifyAspect = (w: number, h: number): [number, number] => {
  const d = gcd(w, h)
  return [Math.round(w) / d, Math.round(h) / d]
}

export const aspectsEqual = (a: [number, number], b: [number, number]) => a[0] * b[1] === a[1] * b[0]

export const parseAspect = (ratio: string): [number, number] | null => {
  if (!ratio || ratio === ASPECT_FREE) return null
  if (ratio === ASPECT_DEFAULT) return [3, 2]
  const match = ratio.trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/)
  if (!match) return null
  const w = Number(match[1])
  const h = Number(match[2])
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null
  return [w, h]
}

export const resolveAspectSelection = (w: number, h: number): string => {
  const simplified = simplifyAspect(w, h)
  for (const preset of ASPECT_PRESETS) {
    const [pw, ph] = preset.id.split(':').map(Number) as [number, number]
    if (aspectsEqual(simplified, [pw, ph])) return preset.id
  }
  return `${simplified[0]}:${simplified[1]}`
}

export const isAspectSelected = (current: string, candidate: string) => {
  if (current === candidate) return true
  if (candidate === ASPECT_DEFAULT || candidate === ASPECT_FREE) return false
  if (current === ASPECT_DEFAULT || current === ASPECT_FREE) return false
  const a = parseAspect(current)
  const b = parseAspect(candidate)
  return a != null && b != null && aspectsEqual(a, b)
}

export const heightFromWidth = (width: number, ratio: string) => {
  const parsed = parseAspect(ratio)
  if (!parsed) return null
  const [aw, ah] = parsed
  return clampSize((width * ah) / aw)
}

export const widthFromHeight = (height: number, ratio: string) => {
  const parsed = parseAspect(ratio)
  if (!parsed) return null
  const [aw, ah] = parsed
  return clampSize((height * aw) / ah)
}

export const isAspectLocked = (ratio: string) => ratio !== ASPECT_FREE
