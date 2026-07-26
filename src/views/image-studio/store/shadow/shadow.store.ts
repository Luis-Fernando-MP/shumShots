import { create, type StateCreator } from 'zustand'

import { createId } from '@views/image-studio/utils/createId'
import {
  LIGHT_PRESETS,
  SHADOW_PRESETS,
  type LightLayer,
  type LightType,
  type ShadowLayer,
  type ShadowType
} from './shadow.types'

export type {
  LightFocus,
  LightLayer,
  LightPreset,
  LightType,
  ShadowLayer,
  ShadowPosition,
  ShadowPreset,
  ShadowType
} from './shadow.types'

export { LIGHT_PRESETS, SHADOW_PRESETS } from './shadow.types'

export {
  SHADOW_DESIGN_REF,
  layerAppliesTo,
  resolveBoxShadowStyle,
  resolveDropShadowFilter,
  resolveLightOverlayStyle,
  shadowScaleForSize
} from '@views/image-studio/utils/shadowVisual'

const defaultShadowLayer = (index = 1): ShadowLayer => ({
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

const defaultLightLayer = (index = 1): LightLayer => ({
  id: createId('light'),
  label: `Luz ${index}`,
  type: 'none',
  opacity: 0,
  size: 60,
  color: '255,236,180',
  focus: { x: 0.55, y: 0.28 },
  targetIds: []
})

type ShadowState = {
  shadowLayers: ShadowLayer[]
  lightLayers: LightLayer[]
  activeShadowId: string
  activeLightId: string
  linkFocus: boolean
  setActiveShadow: (id: string) => void
  setActiveLight: (id: string) => void
  setLinkFocus: (value: boolean) => void
  addShadowLayer: () => void
  addLightLayer: () => void
  removeShadowLayer: (id: string) => void
  removeLightLayer: (id: string) => void
  updateActiveShadow: (patch: Partial<Omit<ShadowLayer, 'id'>>) => void
  updateActiveLight: (patch: Partial<Omit<LightLayer, 'id'>>) => void
  applyShadowPreset: (type: ShadowType) => void
  applyLightPreset: (type: LightType) => void
  setShadowTargets: (ids: string[]) => void
  setLightTargets: (ids: string[]) => void
  clearShadows: () => void
  clearLights: () => void
  purgeSlotTargets: (slotIds: string[]) => void
}

const firstShadow = defaultShadowLayer(1)
const firstLight = defaultLightLayer(1)

const state: StateCreator<ShadowState> = (set, get) => ({
  shadowLayers: [firstShadow],
  lightLayers: [firstLight],
  activeShadowId: firstShadow.id,
  activeLightId: firstLight.id,
  linkFocus: false,

  setActiveShadow: id => {
    if (!get().shadowLayers.some(layer => layer.id === id)) return
    set({ activeShadowId: id })
  },
  setActiveLight: id => {
    if (!get().lightLayers.some(layer => layer.id === id)) return
    set({ activeLightId: id })
  },
  setLinkFocus: value => set({ linkFocus: value }),

  addShadowLayer: () => {
    const layer = defaultShadowLayer(get().shadowLayers.length + 1)
    set(s => ({ shadowLayers: [...s.shadowLayers, layer], activeShadowId: layer.id }))
  },
  addLightLayer: () => {
    const layer = defaultLightLayer(get().lightLayers.length + 1)
    set(s => ({ lightLayers: [...s.lightLayers, layer], activeLightId: layer.id }))
  },

  removeShadowLayer: id =>
    set(s => {
      if (s.shadowLayers.length <= 1) {
        const reset = defaultShadowLayer(1)
        return { shadowLayers: [reset], activeShadowId: reset.id }
      }
      const shadowLayers = s.shadowLayers.filter(layer => layer.id !== id)
      return {
        shadowLayers,
        activeShadowId: s.activeShadowId === id ? shadowLayers[0].id : s.activeShadowId
      }
    }),

  removeLightLayer: id =>
    set(s => {
      if (s.lightLayers.length <= 1) {
        const reset = defaultLightLayer(1)
        return { lightLayers: [reset], activeLightId: reset.id }
      }
      const lightLayers = s.lightLayers.filter(layer => layer.id !== id)
      return {
        lightLayers,
        activeLightId: s.activeLightId === id ? lightLayers[0].id : s.activeLightId
      }
    }),

  updateActiveShadow: patch =>
    set(s => ({
      shadowLayers: s.shadowLayers.map(layer =>
        layer.id === s.activeShadowId ? { ...layer, ...patch } : layer
      )
    })),

  updateActiveLight: patch =>
    set(s => ({
      lightLayers: s.lightLayers.map(layer =>
        layer.id === s.activeLightId ? { ...layer, ...patch } : layer
      )
    })),

  applyShadowPreset: type => {
    const preset = SHADOW_PRESETS.find(item => item.type === type) ?? SHADOW_PRESETS[0]
    get().updateActiveShadow({
      type: preset.type,
      blur: preset.blur,
      spread: preset.spread,
      opacity: preset.opacity,
      position: { x: preset.x, y: preset.y }
    })
  },

  applyLightPreset: type => {
    const preset = LIGHT_PRESETS.find(item => item.type === type) ?? LIGHT_PRESETS[0]
    get().updateActiveLight({
      type: preset.type,
      opacity: preset.opacity,
      size: preset.size,
      color: preset.color,
      focus: { x: preset.x, y: preset.y }
    })
  },

  setShadowTargets: ids => get().updateActiveShadow({ targetIds: ids }),
  setLightTargets: ids => get().updateActiveLight({ targetIds: ids }),

  clearShadows: () => {
    const reset = defaultShadowLayer(1)
    set({ shadowLayers: [reset], activeShadowId: reset.id })
  },
  clearLights: () => {
    const reset = defaultLightLayer(1)
    set({ lightLayers: [reset], activeLightId: reset.id })
  },

  purgeSlotTargets: slotIds => {
    if (slotIds.length === 0) return
    const drop = new Set(slotIds)
    set(s => ({
      shadowLayers: s.shadowLayers.map(layer => ({
        ...layer,
        targetIds: layer.targetIds.filter(id => !drop.has(id))
      })),
      lightLayers: s.lightLayers.map(layer => ({
        ...layer,
        targetIds: layer.targetIds.filter(id => !drop.has(id))
      }))
    }))
  }
})

const useShadowStore = create(state)

export const getActiveShadow = (state: ShadowState) =>
  state.shadowLayers.find(layer => layer.id === state.activeShadowId) ?? state.shadowLayers[0]

export const getActiveLight = (state: ShadowState) =>
  state.lightLayers.find(layer => layer.id === state.activeLightId) ?? state.lightLayers[0]

export default useShadowStore
