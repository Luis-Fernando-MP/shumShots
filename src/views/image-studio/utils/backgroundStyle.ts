import type { CSSProperties } from 'react'

const DEFAULT_FILL = 'rgb(var(--tn-primary))'

export type BackgroundPositionPreset = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'free'

export type VignettePreset = 'none' | 'soft' | 'hard' | 'light' | 'cinema' | 'corners' | 'custom'

export const POSITION_PRESETS: Record<Exclude<BackgroundPositionPreset, 'free'>, { x: number; y: number }> = {
  center: { x: 50, y: 50 },
  top: { x: 50, y: 0 },
  bottom: { x: 50, y: 100 },
  left: { x: 0, y: 50 },
  right: { x: 100, y: 50 }
}

export const isImageBackground = (value: string) => {
  if (value.startsWith('url(')) return true
  if (value.startsWith('/wallpapers/')) return true
  if (value.startsWith('blob:')) return true
  if (value.startsWith('data:')) return true
  if (value.startsWith('http://')) return true
  if (value.startsWith('https://')) return true
  return false
}

export const toCssImageUrl = (value: string) => {
  if (value.startsWith('url(')) return value
  return `url("${value}")`
}

export const normalizeBackgroundValue = (value: string) => {
  if (value.startsWith('/wallpapers/')) return value
  if (value.startsWith('blob:')) return value
  if (value.startsWith('data:')) return value
  if (value.startsWith('http://')) return value
  if (value.startsWith('https://')) return value
  if (value.startsWith('url("') && value.endsWith('")')) {
    return value.slice(5, -2)
  }
  if (value.startsWith("url('") && value.endsWith("')")) {
    return value.slice(5, -2)
  }
  if (value.startsWith('url(') && value.endsWith(')')) {
    return value.slice(4, -1).replace(/^["']|["']$/g, '')
  }
  return value
}

export const clampPercent = (value: number) => {
  if (value < 0) return 0
  if (value > 100) return 100
  return value
}

export const clampRange = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

type ResolveOptions = {
  blendMode: string
  positionX?: number
  positionY?: number
  scale?: number
}

export const resolveBackgroundStyle = (fill: string | null, options: ResolveOptions | string): CSSProperties => {
  const opts: ResolveOptions =
    typeof options === 'string' ? { blendMode: options, positionX: 50, positionY: 50, scale: 100 } : options

  const value = fill ?? DEFAULT_FILL
  const positionX = opts.positionX ?? 50
  const positionY = opts.positionY ?? 50
  const backgroundPosition = `${positionX}% ${positionY}%`

  // Always `cover` as the base fill. Zoom above 100% is applied via transform
  // (see BackgroundCanvas) so we never jump between `cover` and `%` sizing.
  if (value.includes('gradient')) {
    return {
      backgroundImage: value,
      backgroundBlendMode: opts.blendMode,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition
    }
  }

  if (isImageBackground(value)) {
    return {
      backgroundImage: toCssImageUrl(value),
      backgroundBlendMode: opts.blendMode,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition
    }
  }

  return { backgroundColor: value }
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
  if (parts.length === 0) return undefined
  return parts.join(' ')
}

export type FilterPresetId = 'original' | 'vivid' | 'soft' | 'mono' | 'warm' | 'cool'

export const FILTER_PRESETS: {
  id: FilterPresetId
  label: string
  values: Omit<FilterState, 'blur'>
}[] = [
  {
    id: 'original',
    label: 'Original',
    values: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, hue: 0 }
  },
  {
    id: 'vivid',
    label: 'Vivid',
    values: { brightness: 108, contrast: 118, saturate: 140, grayscale: 0, sepia: 0, hue: 0 }
  },
  {
    id: 'soft',
    label: 'Soft',
    values: { brightness: 110, contrast: 90, saturate: 85, grayscale: 0, sepia: 8, hue: 0 }
  },
  {
    id: 'mono',
    label: 'Mono',
    values: { brightness: 102, contrast: 110, saturate: 0, grayscale: 100, sepia: 0, hue: 0 }
  },
  {
    id: 'warm',
    label: 'Warm',
    values: { brightness: 105, contrast: 105, saturate: 115, grayscale: 0, sepia: 28, hue: 12 }
  },
  {
    id: 'cool',
    label: 'Cool',
    values: { brightness: 100, contrast: 108, saturate: 110, grayscale: 0, sepia: 0, hue: 198 }
  }
]

export type VignetteState = {
  preset: VignettePreset
  intensity: number
  size: number
  softness: number
  color: string
  focusX: number
  focusY: number
}

export const resolveVignetteStyle = (state: VignetteState): CSSProperties | null => {
  if (state.preset === 'none') return null

  const intensity = state.intensity / 100
  if (intensity <= 0) return null

  const color = state.color
  const soft = Math.max(1, state.softness)
  const size = Math.max(5, Math.min(95, state.size))
  const outer = Math.min(100, size + soft * 0.45)
  const at = `${state.focusX}% ${state.focusY}%`

  if (state.preset === 'corners') {
    const clearHalf = Math.max(12, (100 - size) * 0.55 + soft * 0.12)
    const softPad = Math.max(4, soft * 0.22)
    const left = Math.max(0, Math.min(100, state.focusX - clearHalf))
    const right = Math.max(0, Math.min(100, state.focusX + clearHalf))
    const top = Math.max(0, Math.min(100, state.focusY - clearHalf))
    const bottom = Math.max(0, Math.min(100, state.focusY + clearHalf))
    const leftFade = Math.max(0, left - softPad)
    const rightFade = Math.min(100, right + softPad)
    const topFade = Math.max(0, top - softPad)
    const bottomFade = Math.min(100, bottom + softPad)

    return {
      opacity: intensity,
      background: `
        linear-gradient(to right, ${color} 0%, ${color} ${leftFade}%, transparent ${left}%, transparent ${right}%, ${color} ${rightFade}%, ${color} 100%),
        linear-gradient(to bottom, ${color} 0%, ${color} ${topFade}%, transparent ${top}%, transparent ${bottom}%, ${color} ${bottomFade}%, ${color} 100%)
      `
    }
  }

  if (state.preset === 'cinema') {
    return {
      opacity: intensity,
      background: `radial-gradient(ellipse 70% 55% at ${at}, transparent ${size}%, ${color} ${outer}%)`
    }
  }

  if (state.preset === 'light') {
    return {
      opacity: intensity,
      background: `radial-gradient(circle at ${at}, rgba(255,255,255,0.28) 0%, transparent ${size}%, ${color} ${outer}%)`
    }
  }

  if (state.preset === 'hard') {
    return {
      opacity: intensity,
      background: `radial-gradient(circle at ${at}, transparent ${Math.max(10, size - 12)}%, ${color} ${size}%)`
    }
  }

  return {
    opacity: intensity,
    background: `radial-gradient(circle at ${at}, transparent ${size}%, ${color} ${outer}%)`
  }
}

export const VIGNETTE_PRESETS: {
  id: Exclude<VignettePreset, 'custom' | 'none'>
  label: string
  values: Pick<VignetteState, 'intensity' | 'size' | 'softness' | 'color' | 'focusX' | 'focusY'>
}[] = [
  { id: 'soft', label: 'Suave', values: { intensity: 55, size: 42, softness: 55, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50 } },
  { id: 'hard', label: 'Fuerte', values: { intensity: 75, size: 48, softness: 18, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50 } },
  { id: 'light', label: 'Glow', values: { intensity: 45, size: 35, softness: 60, color: 'rgba(0,0,0,0.85)', focusX: 50, focusY: 42 } },
  { id: 'cinema', label: 'Cinema', values: { intensity: 70, size: 38, softness: 50, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50 } },
  { id: 'corners', label: 'Esquinas', values: { intensity: 60, size: 40, softness: 40, color: 'rgba(0,0,0,1)', focusX: 50, focusY: 50 } }
]

export const BLUR_PRESETS = [
  { id: 'none', label: 'Sin blur', value: 0 },
  { id: 'soft', label: 'Suave', value: 6 },
  { id: 'medium', label: 'Medio', value: 14 },
  { id: 'strong', label: 'Fuerte', value: 26 }
] as const
