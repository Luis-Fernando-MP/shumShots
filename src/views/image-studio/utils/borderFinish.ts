import { extractColor } from '@common/components/extractColor'

export type BorderFinish = 'soft' | 'solid' | 'soft-frame' | 'solid-frame' | 'picture'

export const SOFT_BORDER_ALPHA = 0.42

const withAlpha = (color: string, alpha: number): string => {
  const rgba = extractColor(color)
  if (rgba) return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`

  const hex = /^#([0-9a-f]{6})$/i.exec(color.trim())
  if (hex) {
    const n = Number.parseInt(hex[1], 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
  }

  const rgb = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(color.trim())
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`

  return color
}

export const isSoftBorderFinish = (finish: BorderFinish) => finish === 'soft' || finish === 'soft-frame'

export const resolveBorderColor = (color: string, finish: BorderFinish): string =>
  withAlpha(color, isSoftBorderFinish(finish) ? SOFT_BORDER_ALPHA : 1)

export const resolveBorderFinishShadow = (finish: BorderFinish): string | undefined => {
  if (finish === 'soft-frame' || finish === 'solid-frame') {
    return 'inset 0 0 0 1.5px rgba(255, 255, 255, 0.78), inset 0 0 0 3px rgba(0, 0, 0, 0.2)'
  }

  if (finish === 'picture') {
    return [
      'inset 0 0 0 1px rgba(255, 255, 255, 0.7)',
      'inset 0 2px 8px rgba(0, 0, 0, 0.38)',
      'inset 0 -1px 3px rgba(255, 255, 255, 0.18)',
      '0 0 0 1px rgba(0, 0, 0, 0.28)',
      '0 4px 14px rgba(0, 0, 0, 0.3)'
    ].join(', ')
  }

  return undefined
}
