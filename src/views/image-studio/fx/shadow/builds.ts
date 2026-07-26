import type { ShadowBuildInput, ShadowResolvedStop, ShadowStackStop } from './types'

const scaleShadowStack = (stack: readonly ShadowStackStop[], input: ShadowBuildInput): ShadowResolvedStop[] => {
  if (input.opacity <= 0) return []
  const scale = input.scale ?? 1
  const { position, blur, spread, opacity } = input
  return stack.map(stop => ({
    x: position.x * stop.x * scale,
    y: position.y * stop.y * scale,
    blur: Math.max(0, blur * stop.blur * scale),
    spread: spread * stop.spread * scale,
    alpha: Math.min(0.95, opacity * stop.alpha)
  }))
}

const pickStops = (stops: ShadowResolvedStop[], maxStops: number) => {
  if (stops.length <= maxStops) return stops
  if (maxStops <= 1) return [stops[0]]
  const picked: ShadowResolvedStop[] = []
  for (let i = 0; i < maxStops; i += 1) {
    const index = Math.round((i * (stops.length - 1)) / (maxStops - 1))
    picked.push(stops[index])
  }
  return picked
}

export const stopsToBoxShadow = (stops: ShadowResolvedStop[], color: string) =>
  stops
    .map(
      stop =>
        `${stop.x.toFixed(1)}px ${stop.y.toFixed(1)}px ${stop.blur.toFixed(1)}px ${stop.spread.toFixed(1)}px rgba(${color}, ${stop.alpha.toFixed(3)})`
    )
    .join(', ')

export const stopsToDropShadow = (stops: ShadowResolvedStop[], color: string, maxStops = 5) => {
  if (!stops.length) return undefined
  return pickStops(stops, maxStops)
    .map(stop => {
      const blur = Math.max(stop.blur, 1) + Math.abs(stop.spread) * 0.85
      return `drop-shadow(${stop.x.toFixed(1)}px ${stop.y.toFixed(1)}px ${blur.toFixed(1)}px rgba(${color}, ${stop.alpha.toFixed(3)}))`
    })
    .join(' ')
}

export const buildNoneShadow = (_input: ShadowBuildInput): ShadowResolvedStop[] => []

const SOFT_STACK: readonly ShadowStackStop[] = [
  { x: 0.04, y: 0.06, blur: 0.08, spread: 0, alpha: 0.9 },
  { x: 0.12, y: 0.16, blur: 0.18, spread: 0, alpha: 0.72 },
  { x: 0.24, y: 0.3, blur: 0.34, spread: 0, alpha: 0.54 },
  { x: 0.4, y: 0.48, blur: 0.55, spread: 0, alpha: 0.38 },
  { x: 0.6, y: 0.68, blur: 0.82, spread: 0, alpha: 0.26 },
  { x: 0.82, y: 0.9, blur: 1.12, spread: 0, alpha: 0.16 },
  { x: 1.05, y: 1.14, blur: 1.48, spread: 0, alpha: 0.1 },
  { x: 1.28, y: 1.4, blur: 1.9, spread: 0, alpha: 0.055 }
]
export const buildSoftShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(SOFT_STACK, input)

const CONTACT_STACK: readonly ShadowStackStop[] = [
  { x: 0.1, y: 0.16, blur: 0.1, spread: 0, alpha: 0.96 },
  { x: 0.24, y: 0.32, blur: 0.22, spread: 0, alpha: 0.8 },
  { x: 0.42, y: 0.5, blur: 0.4, spread: 0, alpha: 0.56 },
  { x: 0.62, y: 0.7, blur: 0.62, spread: 0, alpha: 0.34 },
  { x: 0.82, y: 0.88, blur: 0.88, spread: 0, alpha: 0.16 },
  { x: 0.98, y: 1.02, blur: 1.15, spread: 0, alpha: 0.07 }
]
export const buildContactShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(CONTACT_STACK, input)

const DEEP_STACK: readonly ShadowStackStop[] = [
  { x: 0.08, y: 0.1, blur: 0.16, spread: 0, alpha: 0.84 },
  { x: 0.2, y: 0.24, blur: 0.34, spread: 0.18, alpha: 0.6 },
  { x: 0.38, y: 0.44, blur: 0.58, spread: 0.4, alpha: 0.42 },
  { x: 0.58, y: 0.66, blur: 0.9, spread: 0.65, alpha: 0.3 },
  { x: 0.82, y: 0.92, blur: 1.28, spread: 0.95, alpha: 0.2 },
  { x: 1.08, y: 1.2, blur: 1.7, spread: 1.15, alpha: 0.12 },
  { x: 1.35, y: 1.48, blur: 2.2, spread: 1.25, alpha: 0.07 },
  { x: 1.58, y: 1.75, blur: 2.7, spread: 0.9, alpha: 0.04 }
]
export const buildDeepShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(DEEP_STACK, input)

const CRISP_STACK: readonly ShadowStackStop[] = [
  { x: 0.62, y: 0.62, blur: 0.08, spread: 0, alpha: 0.96 },
  { x: 0.85, y: 0.85, blur: 0.2, spread: 0, alpha: 0.76 },
  { x: 1.05, y: 1.06, blur: 0.4, spread: 0, alpha: 0.5 },
  { x: 1.22, y: 1.25, blur: 0.7, spread: 0, alpha: 0.28 },
  { x: 1.38, y: 1.42, blur: 1.05, spread: 0, alpha: 0.14 },
  { x: 1.52, y: 1.58, blur: 1.45, spread: 0, alpha: 0.06 }
]
export const buildCrispShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(CRISP_STACK, input)

const AMBIENT_STACK: readonly ShadowStackStop[] = [
  { x: 0, y: 0.02, blur: 0.28, spread: 0.7, alpha: 0.7 },
  { x: 0, y: 0.06, blur: 0.5, spread: 1.0, alpha: 0.52 },
  { x: 0.02, y: 0.12, blur: 0.8, spread: 1.25, alpha: 0.36 },
  { x: 0.04, y: 0.2, blur: 1.15, spread: 1.45, alpha: 0.24 },
  { x: 0.08, y: 0.32, blur: 1.5, spread: 1.3, alpha: 0.15 },
  { x: 0.14, y: 0.46, blur: 1.9, spread: 1.0, alpha: 0.09 },
  { x: 0.22, y: 0.62, blur: 2.35, spread: 0.7, alpha: 0.05 }
]
export const buildAmbientShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(AMBIENT_STACK, input)

const LIFT_STACK: readonly ShadowStackStop[] = [
  { x: 0.02, y: 0.12, blur: 0.1, spread: 0, alpha: 0.88 },
  { x: 0.05, y: 0.28, blur: 0.28, spread: 0.1, alpha: 0.58 },
  { x: 0.08, y: 0.48, blur: 0.55, spread: 0.25, alpha: 0.36 },
  { x: 0.1, y: 0.72, blur: 0.9, spread: 0.4, alpha: 0.2 },
  { x: 0.12, y: 0.98, blur: 1.35, spread: 0.35, alpha: 0.1 },
  { x: 0.14, y: 1.25, blur: 1.85, spread: 0.2, alpha: 0.05 }
]
export const buildLiftShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(LIFT_STACK, input)

const LONG_STACK: readonly ShadowStackStop[] = [
  { x: 0.15, y: 0.12, blur: 0.14, spread: 0, alpha: 0.8 },
  { x: 0.38, y: 0.3, blur: 0.32, spread: 0.1, alpha: 0.55 },
  { x: 0.68, y: 0.55, blur: 0.58, spread: 0.25, alpha: 0.36 },
  { x: 1.05, y: 0.85, blur: 0.95, spread: 0.4, alpha: 0.22 },
  { x: 1.5, y: 1.2, blur: 1.4, spread: 0.5, alpha: 0.12 },
  { x: 2.0, y: 1.6, blur: 1.95, spread: 0.35, alpha: 0.07 },
  { x: 2.5, y: 2.0, blur: 2.5, spread: 0.15, alpha: 0.035 }
]
export const buildLongShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(LONG_STACK, input)

const HARD_STACK: readonly ShadowStackStop[] = [
  { x: 0.7, y: 0.7, blur: 0.04, spread: 0, alpha: 0.95 },
  { x: 0.95, y: 0.95, blur: 0.12, spread: 0, alpha: 0.7 },
  { x: 1.15, y: 1.15, blur: 0.28, spread: 0, alpha: 0.4 },
  { x: 1.3, y: 1.32, blur: 0.5, spread: 0, alpha: 0.2 },
  { x: 1.42, y: 1.45, blur: 0.8, spread: 0, alpha: 0.08 }
]
export const buildHardShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(HARD_STACK, input)

const STUDIO_STACK: readonly ShadowStackStop[] = [
  { x: 0.06, y: 0.1, blur: 0.12, spread: 0, alpha: 0.85 },
  { x: 0.16, y: 0.24, blur: 0.28, spread: 0.08, alpha: 0.62 },
  { x: 0.32, y: 0.42, blur: 0.5, spread: 0.2, alpha: 0.42 },
  { x: 0.52, y: 0.64, blur: 0.78, spread: 0.35, alpha: 0.28 },
  { x: 0.75, y: 0.9, blur: 1.15, spread: 0.45, alpha: 0.16 },
  { x: 1.0, y: 1.18, blur: 1.55, spread: 0.35, alpha: 0.09 },
  { x: 1.22, y: 1.42, blur: 2.0, spread: 0.2, alpha: 0.05 }
]
export const buildStudioShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(STUDIO_STACK, input)

const DRIFT_STACK: readonly ShadowStackStop[] = [
  { x: 0.2, y: 0.14, blur: 0.2, spread: 0, alpha: 0.55 },
  { x: 0.45, y: 0.32, blur: 0.42, spread: 0.05, alpha: 0.38 },
  { x: 0.75, y: 0.55, blur: 0.72, spread: 0.12, alpha: 0.24 },
  { x: 1.1, y: 0.82, blur: 1.1, spread: 0.18, alpha: 0.14 },
  { x: 1.5, y: 1.15, blur: 1.55, spread: 0.15, alpha: 0.08 },
  { x: 1.9, y: 1.48, blur: 2.05, spread: 0.08, alpha: 0.04 }
]
export const buildDriftShadow = (input: ShadowBuildInput): ShadowResolvedStop[] => scaleShadowStack(DRIFT_STACK, input)
