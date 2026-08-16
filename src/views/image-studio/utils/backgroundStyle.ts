import type { CSSProperties } from 'react'

export const THEME_PREVIEW_FILL: CSSProperties = {
  backgroundImage:
    'linear-gradient(135deg, rgba(var(--tn-primary), 0.9), rgb(var(--bg-secondary)), rgba(var(--tn-secondary), 0.75))'
}

export const DEMO_SCENE_FILL: CSSProperties = {
  backgroundImage: [
    'radial-gradient(ellipse 35% 28% at 72% 26%, #d8d8d8 0 10%, transparent 11%)',
    'radial-gradient(ellipse 80% 45% at 20% 110%, #2a2a2a 0 42%, transparent 43%)',
    'radial-gradient(ellipse 70% 40% at 85% 115%, #3a3a3a 0 38%, transparent 39%)',
    'linear-gradient(180deg, #8f98a3 0%, #b0b6bd 32%, #5c646e 33%, #3f464f 58%, #23262b 100%)'
  ].join(', ')
}

const IMAGE_PREFIXES = ['url(', '/wallpapers/', 'blob:', 'data:', 'http://', 'https://'] as const

export type BackgroundPositionPreset = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'free'
export type VignettePreset =
  | 'none'
  | 'soft'
  | 'hard'
  | 'light'
  | 'cinema'
  | 'corners'
  | 'tunnel'
  | 'letterbox'
  | 'edge-burn'
  | 'halo'
  | 'dual-spot'
  | 'tri-spot'
  | 'custom'
export type DuotonePresetId =
  | 'none'
  | 'selenium'
  | 'cyanotype'
  | 'platinum'
  | 'tealOrange'
  | 'sepiaPrint'
  | 'redscale'
  | 'tungsten'
  | 'splitGold'
  | 'coolSteel'
  | 'custom'
export type VignettePoints = 1 | 2 | 3
export type FilterPresetId = 'original' | 'vivid' | 'soft' | 'mono' | 'warm' | 'cool'

export const POSITION_PRESETS: Record<Exclude<BackgroundPositionPreset, 'free'>, { x: number; y: number }> = {
  center: { x: 50, y: 50 },
  top: { x: 50, y: 0 },
  bottom: { x: 50, y: 100 },
  left: { x: 0, y: 50 },
  right: { x: 100, y: 50 }
}

export const isImageBackground = (value: string) => IMAGE_PREFIXES.some(prefix => value.startsWith(prefix))

export const toCssImageUrl = (value: string) => (value.startsWith('url(') ? value : `url("${value}")`)

export const normalizeBackgroundValue = (value: string) => {
  if (isImageBackground(value) && !value.startsWith('url(')) return value
  if (value.startsWith('url("') && value.endsWith('")')) return value.slice(5, -2)
  if (value.startsWith("url('") && value.endsWith("')")) return value.slice(5, -2)
  if (value.startsWith('url(') && value.endsWith(')')) {
    return value.slice(4, -1).replace(/^["']|["']$/g, '')
  }
  return value
}

export const clampPercent = (value: number) => Math.min(100, Math.max(0, value))

export const clampRange = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

type ResolveOptions = {
  blendMode: string
  positionX?: number
  positionY?: number
  scale?: number
}

export const resolveBackgroundStyle = (fill: string | null, options: ResolveOptions | string): CSSProperties => {
  const opts: ResolveOptions =
    typeof options === 'string' ? { blendMode: options, positionX: 50, positionY: 50, scale: 100 } : options

  const value = fill ?? 'rgb(var(--tn-primary))'
  const positionX = opts.positionX ?? 50
  const positionY = opts.positionY ?? 50
  const backgroundPosition = `${positionX}% ${positionY}%`
  const shared = {
    backgroundBlendMode: opts.blendMode,
    backgroundSize: 'cover' as const,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition
  }

  if (value.includes('gradient')) return { backgroundImage: value, ...shared }
  if (isImageBackground(value)) return { backgroundImage: toCssImageUrl(value), ...shared }
  return { backgroundColor: value }
}

export const resolvePreviewFill = (background: string | null, fallback: CSSProperties = THEME_PREVIEW_FILL): CSSProperties => {
  if (!background) return fallback
  if (isImageBackground(background)) {
    return {
      backgroundImage: toCssImageUrl(background),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
  if (background.includes('gradient')) return { backgroundImage: background }
  return { backgroundColor: background }
}

export type FilterState = {
  brightness: number
  contrast: number
  saturate: number
  grayscale: number
  sepia: number
  hue: number
  blur: number
}

export const buildFilterCss = (filters: FilterState) => {
  const parts: string[] = []
  if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`)
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`)
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`)
  if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`)
  if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`)
  if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`)
  if (filters.hue !== 0) parts.push(`hue-rotate(${filters.hue}deg)`)
  return parts.length > 0 ? parts.join(' ') : undefined
}

export const FILTER_PRESETS: {
  id: FilterPresetId
  label: string
  values: Omit<FilterState, 'blur'>
}[] = [
  { id: 'original', label: 'Original', values: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, hue: 0 } },
  { id: 'vivid', label: 'Vivid', values: { brightness: 108, contrast: 118, saturate: 140, grayscale: 0, sepia: 0, hue: 0 } },
  { id: 'soft', label: 'Soft', values: { brightness: 110, contrast: 90, saturate: 85, grayscale: 0, sepia: 8, hue: 0 } },
  { id: 'mono', label: 'Mono', values: { brightness: 102, contrast: 110, saturate: 0, grayscale: 100, sepia: 0, hue: 0 } },
  { id: 'warm', label: 'Warm', values: { brightness: 105, contrast: 105, saturate: 115, grayscale: 0, sepia: 28, hue: 12 } },
  { id: 'cool', label: 'Cool', values: { brightness: 100, contrast: 108, saturate: 110, grayscale: 0, sepia: 0, hue: 198 } }
]

export const FILTER_SLIDERS = [
  { key: 'brightness' as const, label: 'Brillo', min: 0, max: 200 },
  { key: 'contrast' as const, label: 'Contraste', min: 0, max: 200 },
  { key: 'saturate' as const, label: 'Saturación', min: 0, max: 200 },
  { key: 'grayscale' as const, label: 'Escala de grises', min: 0, max: 100 },
  { key: 'sepia' as const, label: 'Sepia', min: 0, max: 100 },
  { key: 'hue' as const, label: 'Matiz', min: 0, max: 360 }
]

export type VignetteState = {
  preset: VignettePreset
  intensity: number
  size: number
  softness: number
  color: string
  focusX: number
  focusY: number
  points?: VignettePoints
  focus2X?: number
  focus2Y?: number
  focus3X?: number
  focus3Y?: number
}

const radialHole = (at: string, size: number, outer: number, color: string, inner = 'transparent') =>
  `radial-gradient(circle at ${at}, ${inner} ${size}%, ${color} ${outer}%)`

export const resolveVignetteStyle = (state: VignetteState): CSSProperties | null => {
  if (state.preset === 'none') return null
  const intensity = state.intensity / 100
  if (intensity <= 0) return null

  const { color, focusX, focusY } = state
  const soft = Math.max(1, state.softness)
  const size = Math.max(5, Math.min(95, state.size))
  const outer = Math.min(100, size + soft * 0.45)
  const at = `${focusX}% ${focusY}%`
  const points = state.points ?? (state.preset === 'dual-spot' ? 2 : state.preset === 'tri-spot' ? 3 : 1)

  if (state.preset === 'letterbox') {
    const band = Math.max(8, (100 - size) * 0.35)
    return {
      opacity: intensity,
      background: `linear-gradient(to bottom, ${color} 0%, ${color} ${band}%, transparent ${band + soft * 0.2}%, transparent ${100 - band - soft * 0.2}%, ${color} ${100 - band}%, ${color} 100%)`
    }
  }

  if (state.preset === 'corners') {
    const clearHalf = Math.max(12, (100 - size) * 0.55 + soft * 0.12)
    const softPad = Math.max(4, soft * 0.22)
    const left = clampPercent(focusX - clearHalf)
    const right = clampPercent(focusX + clearHalf)
    const top = clampPercent(focusY - clearHalf)
    const bottom = clampPercent(focusY + clearHalf)
    return {
      opacity: intensity,
      background: `
        linear-gradient(to right, ${color} 0%, ${color} ${Math.max(0, left - softPad)}%, transparent ${left}%, transparent ${right}%, ${color} ${Math.min(100, right + softPad)}%, ${color} 100%),
        linear-gradient(to bottom, ${color} 0%, ${color} ${Math.max(0, top - softPad)}%, transparent ${top}%, transparent ${bottom}%, ${color} ${Math.min(100, bottom + softPad)}%, ${color} 100%)
      `
    }
  }

  if (state.preset === 'cinema') {
    return { opacity: intensity, background: `radial-gradient(ellipse 70% 55% at ${at}, transparent ${size}%, ${color} ${outer}%)` }
  }
  if (state.preset === 'light' || state.preset === 'halo') {
    return {
      opacity: intensity,
      background: `radial-gradient(circle at ${at}, rgba(255,255,255,0.28) 0%, transparent ${size}%, ${color} ${outer}%)`
    }
  }
  if (state.preset === 'hard' || state.preset === 'edge-burn') {
    return {
      opacity: intensity,
      background: `radial-gradient(circle at ${at}, transparent ${Math.max(10, size - 12)}%, ${color} ${size}%)`
    }
  }
  if (state.preset === 'tunnel') {
    return {
      opacity: intensity,
      background: `radial-gradient(circle at ${at}, transparent ${Math.max(8, size * 0.55)}%, ${color} ${outer}%)`
    }
  }

  const foci = [
    at,
    `${state.focus2X ?? 28}% ${state.focus2Y ?? 38}%`,
    `${state.focus3X ?? 72}% ${state.focus3Y ?? 62}%`
  ].slice(0, points)

  if (points > 1) {
    return {
      opacity: intensity,
      background: foci.map(point => radialHole(point, size, outer, color)).join(', ')
    }
  }

  return { opacity: intensity, background: radialHole(at, size, outer, color) }
}

export const BLUR_PRESETS = [
  { id: 'none', label: 'Sin blur', value: 0 },
  { id: 'soft', label: 'Suave', value: 6 },
  { id: 'medium', label: 'Medio', value: 14 },
  { id: 'strong', label: 'Fuerte', value: 26 }
] as const

export type DuotoneState = {
  preset: DuotonePresetId
  intensity: number
  shadow: string
  highlight: string
}

export const VIGNETTE_PRESETS: {
  id: Exclude<VignettePreset, 'custom' | 'none'>
  label: string
  values: Pick<
    VignetteState,
    'intensity' | 'size' | 'softness' | 'color' | 'focusX' | 'focusY' | 'points' | 'focus2X' | 'focus2Y' | 'focus3X' | 'focus3Y'
  >
}[] = [
  { id: 'soft', label: 'Suave', values: { intensity: 55, size: 42, softness: 55, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50, points: 1 } },
  { id: 'hard', label: 'Fuerte', values: { intensity: 75, size: 48, softness: 18, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50, points: 1 } },
  { id: 'light', label: 'Glow', values: { intensity: 45, size: 35, softness: 60, color: 'rgba(0,0,0,0.85)', focusX: 50, focusY: 42, points: 1 } },
  { id: 'cinema', label: 'Cinema', values: { intensity: 70, size: 38, softness: 50, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50, points: 1 } },
  { id: 'corners', label: 'Esquinas', values: { intensity: 60, size: 40, softness: 40, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50, points: 1 } },
  { id: 'tunnel', label: 'Túnel', values: { intensity: 78, size: 32, softness: 28, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50, points: 1 } },
  { id: 'letterbox', label: 'Letterbox', values: { intensity: 70, size: 55, softness: 18, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50, points: 1 } },
  { id: 'edge-burn', label: 'Burn', values: { intensity: 72, size: 52, softness: 12, color: 'rgba(20,8,0,1)', focusX: 50, focusY: 50, points: 1 } },
  { id: 'halo', label: 'Halo', values: { intensity: 50, size: 36, softness: 62, color: 'rgba(0,0,0,0.9)', focusX: 50, focusY: 46, points: 1 } },
  { id: 'dual-spot', label: 'Doble', values: { intensity: 68, size: 28, softness: 40, color: 'rgba(0,0,0,1)', focusX: 32, focusY: 42, points: 2, focus2X: 70, focus2Y: 58 } },
  { id: 'tri-spot', label: 'Triple', values: { intensity: 64, size: 22, softness: 36, color: 'rgba(0,0,0,1)', focusX: 28, focusY: 32, points: 3, focus2X: 72, focus2Y: 38, focus3X: 50, focus3Y: 72 } }
]

export const DUOTONE_PRESETS: {
  id: Exclude<DuotonePresetId, 'custom'>
  label: string
  shadow: string
  highlight: string
  intensity: number
}[] = [
  { id: 'none', label: 'Off', shadow: '#1a1a1a', highlight: '#e8e4df', intensity: 0 },
  { id: 'selenium', label: 'Selenium', shadow: '#1c1814', highlight: '#c4b8a8', intensity: 70 },
  { id: 'cyanotype', label: 'Cyanotype', shadow: '#0b1c33', highlight: '#8eb8c8', intensity: 74 },
  { id: 'platinum', label: 'Platinum', shadow: '#1a1c1e', highlight: '#d8d4cc', intensity: 68 },
  { id: 'tealOrange', label: 'Teal-orange', shadow: '#123038', highlight: '#d4a078', intensity: 72 },
  { id: 'sepiaPrint', label: 'Sepia', shadow: '#2a1c12', highlight: '#e0c8a0', intensity: 70 },
  { id: 'redscale', label: 'Redscale', shadow: '#2a1010', highlight: '#e8a090', intensity: 72 },
  { id: 'tungsten', label: 'Tungsten', shadow: '#1a1420', highlight: '#e8c878', intensity: 70 },
  { id: 'splitGold', label: 'Split gold', shadow: '#121820', highlight: '#e0c070', intensity: 68 },
  { id: 'coolSteel', label: 'Steel', shadow: '#141820', highlight: '#b8c4d0', intensity: 70 }
]

export const resolveDuotoneLayers = (shadow: string, highlight: string, intensity: number) => {
  const opacity = intensity / 100
  return {
    shadow: { backgroundColor: shadow, mixBlendMode: 'multiply' as const, opacity },
    highlight: { backgroundColor: highlight, mixBlendMode: 'screen' as const, opacity }
  }
}

export const ROTATION_PRESETS = [
  { id: 'left-strong', label: '-15°', value: -15 },
  { id: 'left', label: '-8°', value: -8 },
  { id: 'none', label: '0°', value: 0, isDefault: true },
  { id: 'right', label: '+8°', value: 8 }
] as const

export const rotationCoverScale = (degrees: number) => {
  if (degrees === 0) return 1
  const rad = (Math.abs(degrees) * Math.PI) / 180
  return Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad))
}

export const buildBackgroundTransform = (options: {
  scale: number
  blur: number
  rotation: number
  width: number
  height: number
  originX: number
  originY: number
}): Pick<CSSProperties, 'transform' | 'transformOrigin'> | undefined => {
  const zoom = Math.max(1, options.scale / 100)
  const minDim = Math.max(1, Math.min(options.width, options.height))
  const blurPad = options.blur <= 0 ? 1 : 1 + (2 * options.blur) / minDim
  const combined = zoom * blurPad
  const parts: string[] = []
  if (combined !== 1) parts.push(`scale(${combined})`)
  if (options.rotation !== 0) parts.push(`rotate(${options.rotation}deg)`)
  if (parts.length === 0) return undefined
  return {
    transform: parts.join(' '),
    transformOrigin: `${options.originX}% ${options.originY}%`
  }
}

export const BACKGROUND_SIZE_PRESETS = [
  { id: 'default', label: 'Default', width: 900, height: 600, isDefault: true },
  { id: 'ig-post', label: 'IG Post', width: 900, height: 900, isDefault: false },
  { id: 'story', label: 'Story', width: 900, height: 1600, isDefault: false },
  { id: 'youtube', label: 'YouTube', width: 1280, height: 720, isDefault: false },
  { id: 'linkedin', label: 'LinkedIn', width: 1200, height: 627, isDefault: false },
  { id: 'facebook', label: 'Facebook', width: 1080, height: 1350, isDefault: false }
] as const

export const DEFAULT_BACKGROUND_SIZE = {
  width: BACKGROUND_SIZE_PRESETS[0].width,
  height: BACKGROUND_SIZE_PRESETS[0].height
} as const

export type BackgroundSizePresetId = (typeof BACKGROUND_SIZE_PRESETS)[number]['id']
