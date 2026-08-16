import {
  LIGHT_DATA,
  LIGHT_PRESETS,
  normalizeLightType
} from '@views/image-studio/Popups/common/presets/light'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'

const round1 = (value: number) => Math.round(value * 10) / 10

/**
 * Aplica el foco de una capa de luz del canvas (pad o gizmo).
 *
 * @param nx - Posición X normalizada 0–1.
 * @param ny - Posición Y normalizada 0–1.
 * @param layerId - Capa a mover. Default: la activa.
 */
export const applyCanvasLightFocus = (nx: number, ny: number, layerId?: string) => {
  const state = useCanvasLightStore.getState()
  const light = (layerId ? state.layers.find(layer => layer.id === layerId) : null) ?? state.getActive()
  const lightType = normalizeLightType(light.type)
  if (lightType === 'none') return

  const base = LIGHT_PRESETS.find(item => item.type === lightType) ?? LIGHT_PRESETS[0]
  const pad = LIGHT_DATA[lightType].pad
  const distance = Math.min(1, Math.hypot((nx - 0.5) * 2, (ny - 0.5) * 2))
  let size = base.size + distance * pad.sizeGrow
  if ('sizeMin' in pad && typeof pad.sizeMin === 'number') {
    size = Math.max(pad.sizeMin, size)
  }

  const focus = { x: round1(nx * 1000) / 1000, y: round1(ny * 1000) / 1000 }
  const nextSize = round1(size)

  useCanvasLightStore.setState(current => ({
    activeId: light.id,
    layers: current.layers.map(layer =>
      layer.id === light.id ? { ...layer, focus, size: nextSize } : layer
    )
  }))
}
