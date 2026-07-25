import type { CSSProperties } from 'react'

const DEFAULT_FILL = 'rgb(var(--tn-primary))'

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

export const resolveBackgroundStyle = (fill: string | null, blendMode: string): CSSProperties => {
  const value = fill ?? DEFAULT_FILL

  if (value.includes('gradient')) {
    return {
      backgroundImage: value,
      backgroundBlendMode: blendMode,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  }

  if (isImageBackground(value)) {
    return {
      backgroundImage: toCssImageUrl(value),
      backgroundBlendMode: blendMode,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  }

  return { backgroundColor: value }
}
