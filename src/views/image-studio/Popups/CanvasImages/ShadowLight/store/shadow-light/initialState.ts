import type { LightLayer } from '@views/image-studio/Popups/common/presets/light'
import type { ShadowLayer } from '@views/image-studio/Popups/CanvasImages/ShadowLight/presets/shadow'
import { createId } from '@views/image-studio/utils/createId'

import type { ShadowTabConfig } from './type.shadow-light'

export const defaultShadowLayer = (index = 1): ShadowLayer => ({
  id: createId('shadow'),
  label: `Sombra ${index}`,
  type: 'none',
  opacity: 0,
  blur: 0,
  spread: 0,
  color: '0,0,0',
  position: { x: 0, y: 0 },
  targetIds: []
})

export const defaultLightLayer = (index = 1): LightLayer => ({
  id: createId('light'),
  label: `Luz ${index}`,
  type: 'none',
  opacity: 0,
  size: 60,
  color: '255,236,180',
  focus: { x: 0.55, y: 0.28 },
  targetIds: []
})

export const createDefaultShadowConfig = (): ShadowTabConfig => {
  const shadow = defaultShadowLayer(1)
  const light = defaultLightLayer(1)
  return {
    shadowLayers: [shadow],
    lightLayers: [light],
    activeShadowId: shadow.id,
    activeLightId: light.id,
    linkFocus: false
  }
}
