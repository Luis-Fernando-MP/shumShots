import {
  LIGHT_DATA,
  LIGHT_PRESETS,
  normalizeLightType,
  type LightType
} from '@views/image-studio/Popups/common/presets/light'
import { SHADOW_DATA, SHADOW_PRESETS, type ShadowType } from '@views/image-studio/Popups/CanvasImages/ShadowLight/presets/shadow'
import useShadowStore, {
  createDefaultShadowConfig,
  selectTabConfig
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'

export type SlotFocusKind = 'shadow' | 'light'
export type SunPos = { x: number; y: number }

const SUN_MARGIN = 0.06
const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))
const round1 = (value: number) => Math.round(value * 10) / 10

const shadowPreset = (type: ShadowType) => SHADOW_PRESETS.find(item => item.type === type) ?? SHADOW_PRESETS[0]
const lightPreset = (type: LightType) => LIGHT_PRESETS.find(item => item.type === type) ?? LIGHT_PRESETS[0]

/**
 * Convierte el offset de sombra en posición de sol 0–1 dentro del slot.
 *
 * @param type - Preset de sombra.
 * @param position - Offset en px del preset.
 */
export const sunFromShadowPosition = (type: ShadowType, position: { x: number; y: number }): SunPos => {
  if (type === 'none') return { x: 0.5, y: 0.5 }
  const throwPx = SHADOW_DATA[type].pad.throw || 1
  return {
    x: clamp01(-position.x / throwPx / 2 + 0.5, SUN_MARGIN),
    y: clamp01(-position.y / throwPx / 2 + 0.5, SUN_MARGIN)
  }
}

/**
 * Mueve el foco de sombra y/o luz del slot. La sombra queda anclada al cuadrado.
 *
 * @param tabId - Destino de capas sombra/luz.
 * @param nx - Posición X 0–1 relativa al slot.
 * @param ny - Posición Y 0–1 relativa al slot.
 * @param source - Qué capa inicia el gesto.
 */
export const applySlotFocus = (tabId: string, nx: number, ny: number, source: SlotFocusKind) => {
  const state = useShadowStore.getState()
  const config = selectTabConfig(tabId)(state)
  const shadow =
    config.shadowLayers.find(layer => layer.id === config.activeShadowId) ?? config.shadowLayers[0]
  const light = config.lightLayers.find(layer => layer.id === config.activeLightId) ?? config.lightLayers[0]
  const canLink = Boolean(shadow && shadow.type !== 'none' && light && light.type !== 'none')
  const linked = config.linkFocus && canLink
  const touchShadow = source === 'shadow' || linked
  const touchLight = source === 'light' || linked

  let shadowPatch: Parameters<typeof state.updateActiveShadow>[1] | null = null
  let lightPatch: Parameters<typeof state.updateActiveLight>[1] | null = null

  if (touchShadow && shadow && shadow.type !== 'none') {
    const base = shadowPreset(shadow.type)
    const pad = SHADOW_DATA[shadow.type].pad
    const relX = (nx - 0.5) * 2
    const relY = (ny - 0.5) * 2
    const distance = Math.min(1, Math.hypot(relX, relY))
    const throwPx = pad.throw
    const position = {
      x: round1(-relX * throwPx),
      y: round1(-relY * throwPx)
    }
    const blur = round1(Math.max(0, base.blur + distance * pad.blurGrow))
    const spread = round1(base.spread + distance * pad.spreadGrow)
    if (
      Math.abs(shadow.position.x - position.x) > 0.05 ||
      Math.abs(shadow.position.y - position.y) > 0.05 ||
      Math.abs(shadow.blur - blur) > 0.05 ||
      Math.abs(shadow.spread - spread) > 0.05
    ) {
      shadowPatch = { position, blur, spread }
    }
  }

  if (touchLight && light && light.type !== 'none') {
    const lightType = normalizeLightType(light.type)
    if (lightType !== 'none') {
      const base = lightPreset(lightType)
      const pad = LIGHT_DATA[lightType].pad
      const distance = Math.min(1, Math.hypot((nx - 0.5) * 2, (ny - 0.5) * 2))
      let size = base.size + distance * pad.sizeGrow
      if ('sizeMin' in pad && typeof pad.sizeMin === 'number') {
        size = Math.max(pad.sizeMin, size)
      }
      size = round1(size)
      const focus = { x: round1(nx * 1000) / 1000, y: round1(ny * 1000) / 1000 }

      if (
        Math.abs(light.focus.x - focus.x) > 0.002 ||
        Math.abs(light.focus.y - focus.y) > 0.002 ||
        Math.abs(light.size - size) > 0.05
      ) {
        lightPatch = { focus, size }
      }
    }
  }

  if (!shadowPatch && !lightPatch) return

  if (shadowPatch && lightPatch) {
    useShadowStore.setState(s => {
      const current = s.byTab[tabId] ?? createDefaultShadowConfig()
      return {
        byTab: {
          ...s.byTab,
          [tabId]: {
            ...current,
            shadowLayers: current.shadowLayers.map(layer =>
              layer.id === current.activeShadowId ? { ...layer, ...shadowPatch } : layer
            ),
            lightLayers: current.lightLayers.map(layer =>
              layer.id === current.activeLightId ? { ...layer, ...lightPatch } : layer
            )
          }
        }
      }
    })
    return
  }
  if (shadowPatch) state.updateActiveShadow(tabId, shadowPatch)
  if (lightPatch) state.updateActiveLight(tabId, lightPatch)
}
