import type { CSSProperties } from 'react'

import type { LightFocus, LightType, ShadowPosition, ShadowType } from '../store/shadow/shadow.types'

export const SHADOW_DESIGN_REF = 280

export const shadowScaleForSize = (edgePx: number) => {
  if (!Number.isFinite(edgePx) || edgePx <= 0) return 1
  return Math.min(3.4, Math.max(0.28, edgePx / SHADOW_DESIGN_REF))
}

export const layerAppliesTo = (targetIds: string[], slotId: string) =>
  targetIds.length === 0 || targetIds.includes(slotId)

type ShadowVisualInput = {
  type: ShadowType
  opacity: number
  blur: number
  spread: number
  color: string
  position: ShadowPosition
  scale?: number
}

type LightVisualInput = {
  lightType: LightType
  lightOpacity: number
  lightSize: number
  lightColor: string
  lightFocus: LightFocus
}

type ShadowStackStop = {
  x: number
  y: number
  blur: number
  spread: number
  alpha: number
}

const SHADOW_STACKS: Record<Exclude<ShadowType, 'none'>, readonly ShadowStackStop[]> = {
  soft: [
    { x: 0.08, y: 0.1, blur: 0.12, spread: 0, alpha: 0.95 },
    { x: 0.2, y: 0.24, blur: 0.28, spread: 0, alpha: 0.68 },
    { x: 0.38, y: 0.42, blur: 0.5, spread: 0, alpha: 0.45 },
    { x: 0.58, y: 0.64, blur: 0.78, spread: 0, alpha: 0.32 },
    { x: 0.8, y: 0.88, blur: 1.1, spread: 0, alpha: 0.2 },
    { x: 1, y: 1.08, blur: 1.4, spread: 0, alpha: 0.12 },
    { x: 1.15, y: 1.28, blur: 1.75, spread: 0, alpha: 0.07 }
  ],
  contact: [
    { x: 0.2, y: 0.28, blur: 0.25, spread: 0, alpha: 0.9 },
    { x: 0.4, y: 0.5, blur: 0.45, spread: 0, alpha: 0.65 },
    { x: 0.65, y: 0.75, blur: 0.75, spread: 0, alpha: 0.42 },
    { x: 0.88, y: 1, blur: 1.1, spread: 0, alpha: 0.26 },
    { x: 1.05, y: 1.2, blur: 1.45, spread: 0, alpha: 0.14 },
    { x: 1.2, y: 1.38, blur: 1.8, spread: 0, alpha: 0.08 }
  ],
  deep: [
    { x: 0.1, y: 0.12, blur: 0.22, spread: 0, alpha: 0.78 },
    { x: 0.24, y: 0.28, blur: 0.45, spread: 0.2, alpha: 0.52 },
    { x: 0.42, y: 0.48, blur: 0.75, spread: 0.4, alpha: 0.36 },
    { x: 0.62, y: 0.7, blur: 1.1, spread: 0.65, alpha: 0.24 },
    { x: 0.85, y: 0.95, blur: 1.45, spread: 0.9, alpha: 0.16 },
    { x: 1.05, y: 1.18, blur: 1.85, spread: 1.1, alpha: 0.1 },
    { x: 1.25, y: 1.4, blur: 2.3, spread: 0.7, alpha: 0.06 }
  ],
  crisp: [
    { x: 0.5, y: 0.5, blur: 0.22, spread: 0, alpha: 0.9 },
    { x: 0.72, y: 0.72, blur: 0.45, spread: 0, alpha: 0.62 },
    { x: 0.95, y: 0.95, blur: 0.8, spread: 0, alpha: 0.4 },
    { x: 1.12, y: 1.15, blur: 1.2, spread: 0, alpha: 0.24 },
    { x: 1.3, y: 1.35, blur: 1.65, spread: 0, alpha: 0.14 },
    { x: 1.45, y: 1.52, blur: 2.1, spread: 0, alpha: 0.08 }
  ],
  ambient: [
    { x: 0, y: 0.08, blur: 0.35, spread: 0.55, alpha: 0.72 },
    { x: 0, y: 0.12, blur: 0.65, spread: 0.85, alpha: 0.52 },
    { x: 0.05, y: 0.18, blur: 1, spread: 1.1, alpha: 0.36 },
    { x: 0.1, y: 0.28, blur: 1.35, spread: 1.3, alpha: 0.26 },
    { x: 0.18, y: 0.4, blur: 1.7, spread: 1.1, alpha: 0.16 },
    { x: 0.28, y: 0.55, blur: 2.1, spread: 0.8, alpha: 0.1 }
  ]
}

const buildShadowStops = (state: ShadowVisualInput) => {
  if (state.type === 'none' || state.opacity <= 0) return []
  const scale = state.scale ?? 1
  const { position, blur, spread, opacity } = state
  return SHADOW_STACKS[state.type].map(stop => ({
    x: position.x * stop.x * scale,
    y: position.y * stop.y * scale,
    blur: Math.max(0, blur * stop.blur * scale),
    spread: spread * stop.spread * scale,
    alpha: Math.min(0.95, opacity * stop.alpha)
  }))
}

export const resolveBoxShadowStyle = (state: ShadowVisualInput): string | undefined => {
  const stops = buildShadowStops(state)
  if (!stops.length) return undefined
  const { color } = state
  return stops
    .map(
      stop =>
        `${stop.x.toFixed(1)}px ${stop.y.toFixed(1)}px ${stop.blur.toFixed(1)}px ${stop.spread.toFixed(1)}px rgba(${color}, ${stop.alpha.toFixed(3)})`
    )
    .join(', ')
}

export const resolveDropShadowFilter = (state: ShadowVisualInput): string | undefined => {
  const stops = buildShadowStops(state).slice(0, 6)
  if (!stops.length) return undefined
  const { color } = state
  return stops
    .map(
      stop =>
        `drop-shadow(${stop.x.toFixed(1)}px ${stop.y.toFixed(1)}px ${Math.max(stop.blur, 1).toFixed(1)}px rgba(${color}, ${stop.alpha.toFixed(3)}))`
    )
    .join(' ')
}

export const resolveLightOverlayStyle = (state: LightVisualInput): CSSProperties | undefined => {
  const { lightType, lightOpacity, lightSize, lightColor, lightFocus } = state
  if (lightType === 'none' || lightOpacity <= 0 || lightSize <= 0) return undefined

  const x = lightFocus.x * 100
  const y = lightFocus.y * 100
  const mid = Math.max(18, lightSize * 0.45)
  const edge = Math.max(mid + 8, lightSize)
  const core = Math.min(0.85, lightOpacity)
  const midAlpha = Math.min(0.45, lightOpacity * 0.45)

  let backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(${lightColor}, ${core.toFixed(2)}) 0%, rgba(${lightColor}, ${midAlpha.toFixed(2)}) ${mid}%, transparent ${edge}%)`
  let mixBlendMode: CSSProperties['mixBlendMode'] = 'screen'

  if (lightType === 'beam') {
    backgroundImage = `radial-gradient(ellipse 55% 70% at ${x}% ${y}%, rgba(${lightColor}, ${core.toFixed(2)}) 0%, rgba(${lightColor}, ${(core * 0.4).toFixed(2)}) ${mid * 0.7}%, transparent ${edge}%)`
    mixBlendMode = 'soft-light'
  } else if (lightType === 'rim') {
    backgroundImage = `radial-gradient(circle at ${x}% ${y}%, transparent 0%, transparent ${Math.max(10, mid * 0.35)}%, rgba(${lightColor}, ${(core * 0.55).toFixed(2)}) ${mid}%, transparent ${edge}%)`
  } else if (lightType === 'warm') {
    mixBlendMode = 'overlay'
  } else if (lightType === 'cool') {
    mixBlendMode = 'soft-light'
  }

  return { backgroundImage, mixBlendMode, pointerEvents: 'none' }
}
