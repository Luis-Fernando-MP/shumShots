import type { CSSProperties } from 'react'

import { LIGHT_DATA, normalizeLightType } from './data'
import type { LightVisualInput } from './types'

export const resolveLightOverlayStyle = (state: LightVisualInput): CSSProperties | undefined => {
  const lightType = normalizeLightType(state.lightType)
  const effect = LIGHT_DATA[lightType]
  if (!effect || lightType === 'none' || state.lightOpacity <= 0 || state.lightSize <= 0) {
    return undefined
  }

  const backgroundImage = effect.build({
    opacity: state.lightOpacity,
    size: state.lightSize,
    color: state.lightColor,
    focus: state.lightFocus
  })
  if (!backgroundImage) return undefined

  return {
    backgroundImage,
    mixBlendMode: effect.blend,
    pointerEvents: 'none'
  }
}
