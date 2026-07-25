import type { CSSProperties } from 'react'
import { type StateCreator, create } from 'zustand'

export type ShadowType = 'none' | 'soft' | 'hard' | 'float' | 'glow'
export type LightType = 'none' | 'soft' | 'beam' | 'rim' | 'warm'

export type ShadowPosition = { x: number; y: number }
export type LightFocus = { x: number; y: number }

export type ShadowPreset = {
  type: ShadowType
  label: string
  blur: number
  spread: number
  opacity: number
  x: number
  y: number
  preview: string
}

export type LightPreset = {
  type: LightType
  label: string
  opacity: number
  size: number
  color: string
  x: number
  y: number
  preview: string
}

export const SHADOW_PRESETS: readonly ShadowPreset[] = [
  {
    type: 'none',
    label: 'Limpio',
    blur: 0,
    spread: 0,
    opacity: 0,
    x: 0,
    y: 0,
    preview: 'none'
  },
  {
    type: 'soft',
    label: 'Suave',
    blur: 36,
    spread: 2,
    opacity: 0.38,
    x: 0,
    y: 14,
    preview: '0 10px 22px 0 rgba(0,0,0,0.28)'
  },
  {
    type: 'hard',
    label: 'Fuerte',
    blur: 14,
    spread: 0,
    opacity: 0.48,
    x: 8,
    y: 10,
    preview: '6px 8px 12px 0 rgba(0,0,0,0.4)'
  },
  {
    type: 'float',
    label: 'Flotante',
    blur: 56,
    spread: 6,
    opacity: 0.42,
    x: 0,
    y: 26,
    preview: '0 18px 34px 2px rgba(0,0,0,0.32)'
  },
  {
    type: 'glow',
    label: 'Glow',
    blur: 48,
    spread: 10,
    opacity: 0.5,
    x: 0,
    y: 0,
    preview: '0 0 22px 6px rgba(0,0,0,0.35)'
  }
] as const

export const LIGHT_PRESETS: readonly LightPreset[] = [
  {
    type: 'none',
    label: 'Limpio',
    opacity: 0,
    size: 0,
    color: '255,236,180',
    x: 0.5,
    y: 0.35,
    preview: 'none'
  },
  {
    type: 'soft',
    label: 'Suave',
    opacity: 0.42,
    size: 70,
    color: '255,244,214',
    x: 0.55,
    y: 0.28,
    preview: '0 0 18px 4px rgba(255,236,180,0.55)'
  },
  {
    type: 'beam',
    label: 'Haz',
    opacity: 0.55,
    size: 48,
    color: '255,250,230',
    x: 0.72,
    y: 0.18,
    preview: '0 0 14px 2px rgba(255,250,220,0.7)'
  },
  {
    type: 'rim',
    label: 'Contorno',
    opacity: 0.5,
    size: 85,
    color: '200,220,255',
    x: 0.2,
    y: 0.35,
    preview: '0 0 16px 3px rgba(180,210,255,0.55)'
  },
  {
    type: 'warm',
    label: 'Cálida',
    opacity: 0.48,
    size: 62,
    color: '255,186,120',
    x: 0.65,
    y: 0.4,
    preview: '0 0 18px 4px rgba(255,186,120,0.6)'
  }
] as const

type ShadowState = {
  position: ShadowPosition
  type: ShadowType
  opacity: number
  blur: number
  spread: number
  color: string

  lightType: LightType
  lightOpacity: number
  lightSize: number
  lightColor: string
  lightFocus: LightFocus

  setOpacity: (opacity: number) => void
  setBlur: (blur: number) => void
  setSpread: (spread: number) => void
  setColor: (color: string) => void
  setShadowType: (type: ShadowType) => void
  setPosition: (position: ShadowPosition) => void
  applyPreset: (type: ShadowType) => void

  setLightOpacity: (opacity: number) => void
  setLightSize: (size: number) => void
  setLightColor: (color: string) => void
  setLightFocus: (focus: LightFocus) => void
  applyLightPreset: (type: LightType) => void
}

type ShadowVisualInput = Pick<ShadowState, 'opacity' | 'blur' | 'spread' | 'position' | 'color' | 'type'>
type LightVisualInput = Pick<ShadowState, 'lightType' | 'lightOpacity' | 'lightSize' | 'lightColor' | 'lightFocus'>

const buildLayers = (state: ShadowVisualInput) => {
  const { opacity, blur, spread, position, color, type } = state
  if (type === 'none' || opacity <= 0) return null

  const softOpacity = Math.min(opacity * 0.55, 0.45)
  return {
    near: {
      x: position.x / 2,
      y: position.y / 2,
      blur: blur / 2,
      spread: spread / 2,
      alpha: softOpacity
    },
    far: {
      x: position.x,
      y: position.y,
      blur,
      spread,
      alpha: opacity
    },
    color
  }
}

export const resolveBoxShadowStyle = (state: ShadowVisualInput): string | undefined => {
  const layers = buildLayers(state)
  if (!layers) return undefined
  const { near, far, color } = layers
  return [
    `${near.x}px ${near.y}px ${near.blur}px ${near.spread}px rgba(${color}, ${near.alpha.toFixed(2)})`,
    `${far.x}px ${far.y}px ${far.blur}px ${far.spread}px rgba(${color}, ${far.alpha.toFixed(2)})`
  ].join(', ')
}

export const resolveDropShadowFilter = (state: ShadowVisualInput): string | undefined => {
  const layers = buildLayers(state)
  if (!layers) return undefined
  const { near, far, color } = layers
  return [
    `drop-shadow(${near.x}px ${near.y}px ${Math.max(near.blur, 1)}px rgba(${color}, ${near.alpha.toFixed(2)}))`,
    `drop-shadow(${far.x}px ${far.y}px ${Math.max(far.blur, 1)}px rgba(${color}, ${far.alpha.toFixed(2)}))`
  ].join(' ')
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
    mixBlendMode = 'screen'
  } else if (lightType === 'warm') {
    mixBlendMode = 'overlay'
  }

  return {
    backgroundImage,
    mixBlendMode,
    pointerEvents: 'none'
  }
}

export const resolveLightPreviewFilter = (state: LightVisualInput): string | undefined => {
  const { lightType, lightOpacity, lightColor, lightFocus } = state
  if (lightType === 'none' || lightOpacity <= 0) return undefined
  const dx = (lightFocus.x - 0.5) * 28
  const dy = (lightFocus.y - 0.5) * 28
  const alpha = Math.min(0.9, lightOpacity + 0.15).toFixed(2)
  return `drop-shadow(${(-dx).toFixed(1)}px ${(-dy).toFixed(1)}px 14px rgba(${lightColor}, ${alpha}))`
}

const state: StateCreator<ShadowState> = set => ({
  opacity: 0,
  blur: 0,
  spread: 0,
  color: '0,0,0',
  type: 'none',
  position: { x: 0, y: 0 },

  lightType: 'none',
  lightOpacity: 0,
  lightSize: 60,
  lightColor: '255,236,180',
  lightFocus: { x: 0.55, y: 0.28 },

  setOpacity: opacity => set({ opacity }),
  setBlur: blur => set({ blur }),
  setSpread: spread => set({ spread }),
  setColor: color => set({ color }),
  setShadowType: type => set({ type }),
  setPosition: position => set({ position }),

  applyPreset: type => {
    const preset = SHADOW_PRESETS.find(item => item.type === type) ?? SHADOW_PRESETS[0]
    set({
      type: preset.type,
      blur: preset.blur,
      spread: preset.spread,
      opacity: preset.opacity,
      position: { x: preset.x, y: preset.y }
    })
  },

  setLightOpacity: lightOpacity => set({ lightOpacity }),
  setLightSize: lightSize => set({ lightSize }),
  setLightColor: lightColor => set({ lightColor }),
  setLightFocus: lightFocus => set({ lightFocus }),

  applyLightPreset: type => {
    const preset = LIGHT_PRESETS.find(item => item.type === type) ?? LIGHT_PRESETS[0]
    set({
      lightType: preset.type,
      lightOpacity: preset.opacity,
      lightSize: preset.size,
      lightColor: preset.color,
      lightFocus: { x: preset.x, y: preset.y }
    })
  }
})

const useShadowStore = create(state)

export default useShadowStore
