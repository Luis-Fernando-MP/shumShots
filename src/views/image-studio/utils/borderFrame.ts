import type { BorderFinish, BorderType } from '@views/image-studio/store/border/createBorderStore'
import {
  resolveBorderColor,
  resolveBorderFinishShadow
} from '@views/image-studio/utils/borderFinish'
import type { CSSProperties } from 'react'

export const insetBorderRadius = (radiusCss: string, inset: number): string => {
  if (inset <= 0) return radiusCss
  return radiusCss
    .trim()
    .split(/\s+/)
    .map(token => {
      const value = Number.parseFloat(token)
      if (Number.isNaN(value)) return '0px'
      return `${Math.max(0, value - inset)}px`
    })
    .join(' ')
}

export const buildCanvasFrameStyle = (options: {
  width?: number | string
  height?: number | string
  borderRadius: string
  color: string
  size: number
  type: BorderType
  finish: BorderFinish
  gradient: string | null
  blendMode: string
}): CSSProperties => {
  const { width, height, borderRadius, color, size, type, finish, gradient, blendMode } = options
  const base: CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    borderRadius,
    boxSizing: 'border-box',
    padding: 0,
    margin: 0
  }

  if (type === 'solid') {
    return {
      ...base,
      border: size > 0 ? `${size}px solid ${resolveBorderColor(color, finish)}` : 'none',
      boxShadow: resolveBorderFinishShadow(finish)
    }
  }

  if (type === 'gradient' && gradient) {
    return {
      ...base,
      border: `${size}px solid transparent`,
      backgroundImage: gradient,
      backgroundOrigin: 'border-box',
      backgroundClip: 'border-box',
      backgroundBlendMode: blendMode,
      boxShadow: resolveBorderFinishShadow(finish)
    }
  }

  return { ...base, border: 'none' }
}
