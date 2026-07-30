import type { LightFocus, LightLayer, LightType } from '@views/image-studio/Popups/common/presets/light'

export type CanvasLightLayer = Omit<LightLayer, 'targetIds'>

interface LightState {
  layers: CanvasLightLayer[]
  activeId: string
  setActive: (id: string) => void
  addLayer: () => void
  removeLayer: (id: string) => void
  updateLight: (patch: Partial<Omit<CanvasLightLayer, 'id'>>) => void
  applyLightPreset: (type: LightType) => void
  setFocus: (focus: LightFocus) => void
  reset: () => void
  getActive: () => CanvasLightLayer
}

export default LightState
export type { LightFocus, LightType }
