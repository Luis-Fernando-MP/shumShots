import { LIGHT_DATA, type LightType } from './data'

export type { LightType }

export type LightFocus = { x: number; y: number }

export type LightBuildInput = {
  opacity: number
  size: number
  color: string
  focus: LightFocus
}

export type LightPreset = {
  [K in LightType]: {
    type: K
    label: (typeof LIGHT_DATA)[K]['label']
    opacity: number
    size: number
    color: string
    x: number
    y: number
    preview: (typeof LIGHT_DATA)[K]['preview']
  }
}[LightType]

export type LightLayer = {
  id: string
  label: string
  type: LightType
  opacity: number
  size: number
  color: string
  focus: LightFocus
  targetIds: string[]
}

export type LightVisualInput = {
  lightType: LightType
  lightOpacity: number
  lightSize: number
  lightColor: string
  lightFocus: LightFocus
}
