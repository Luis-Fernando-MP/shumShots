import { SHADOW_DATA, type ShadowType } from './data'

export type { ShadowType }

export type ShadowPosition = { x: number; y: number }

export type ShadowStackStop = {
  x: number
  y: number
  blur: number
  spread: number
  alpha: number
}

export type ShadowResolvedStop = {
  x: number
  y: number
  blur: number
  spread: number
  alpha: number
}

export type ShadowBuildInput = {
  opacity: number
  blur: number
  spread: number
  color: string
  position: ShadowPosition
  scale?: number
}

export type ShadowPreset = {
  [K in ShadowType]: {
    type: K
    label: (typeof SHADOW_DATA)[K]['label']
    blur: number
    spread: number
    opacity: number
    x: number
    y: number
    preview: (typeof SHADOW_DATA)[K]['preview']
  }
}[ShadowType]

export type ShadowLayer = {
  id: string
  label: string
  type: ShadowType
  opacity: number
  blur: number
  spread: number
  color: string
  position: ShadowPosition
  targetIds: string[]
}

export type ShadowVisualInput = ShadowBuildInput & { type: ShadowType }
