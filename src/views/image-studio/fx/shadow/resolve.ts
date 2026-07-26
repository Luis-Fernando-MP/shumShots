import { stopsToBoxShadow, stopsToDropShadow } from './builds'
import { SHADOW_DATA } from './data'
import type { ShadowVisualInput } from './types'

export const resolveBoxShadowStyle = (state: ShadowVisualInput): string | undefined => {
  const effect = SHADOW_DATA[state.type]
  if (!effect || state.type === 'none' || state.opacity <= 0) return undefined
  const stops = effect.build(state)
  if (!stops.length) return undefined
  return stopsToBoxShadow(stops, state.color)
}

export const resolveDropShadowFilter = (
  state: ShadowVisualInput,
  maxStops = 5
): string | undefined => {
  const effect = SHADOW_DATA[state.type]
  if (!effect || state.type === 'none' || state.opacity <= 0) return undefined
  const stops = effect.build(state)
  return stopsToDropShadow(stops, state.color, maxStops)
}

export const resolveFrameFillBoxShadow = (state: ShadowVisualInput): string | undefined => {
  const effect = SHADOW_DATA[state.type]
  if (!effect?.frameFill || state.type === 'none' || state.opacity <= 0) return undefined

  const scale = state.scale ?? 1
  const opacity = Math.min(0.24, state.opacity * 0.48)
  const blur = Math.max(16, state.blur * 0.52 * scale)
  const spread = Math.max(0, state.spread * 0.4 * scale)
  const y = Math.max(3, Math.abs(state.position.y) * 0.18 * scale)
  const x = state.position.x * 0.1 * scale

  return `${x.toFixed(1)}px ${y.toFixed(1)}px ${blur.toFixed(1)}px ${spread.toFixed(1)}px rgba(${state.color}, ${opacity.toFixed(3)})`
}
