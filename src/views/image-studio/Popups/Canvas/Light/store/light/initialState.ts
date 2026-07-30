import { createId } from '@views/image-studio/utils/createId'

import type { CanvasLightLayer } from './type.light'

export const STORAGE_KEY = 'pixis:image-studio:canvas-light'
export const STORAGE_VERSION = 1

export const defaultLightLayer = (index = 1): CanvasLightLayer => ({
  id: createId('canvas-light'),
  label: `Luz ${index}`,
  type: 'none',
  opacity: 0,
  size: 60,
  color: '255,236,180',
  focus: { x: 0.55, y: 0.28 }
})

export const createInitialLightState = () => {
  const layer = defaultLightLayer(1)
  return {
    layers: [layer],
    activeId: layer.id
  }
}
