import type { CSSProperties } from 'react'

const DEFAULT_FILL = 'rgb(var(--tn-primary))'

export type BackgroundPositionPreset = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'free'

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

type ResolveOptions = {
  blendMode: string
  positionX?: number
  positionY?: number
}

export const resolveBackgroundStyle = (fill: string | null, options: ResolveOptions | string): CSSProperties => {
  const opts: ResolveOptions =
    typeof options === 'string' ? { blendMode: options, positionX: 50, positionY: 50 } : options

  const value = fill ?? DEFAULT_FILL
  const positionX = opts.positionX ?? 50
  const positionY = opts.positionY ?? 50
  const backgroundPosition = `${positionX}% ${positionY}%`

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
