import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  LIGHT_PRESETS,
  normalizeLightType,
  resolveLightOverlayStyle,
  type LightLayer,
  type LightType
} from '@views/image-studio/fx/light'
import {
  resolveBoxShadowStyle,
  resolveDropShadowFilter,
  SHADOW_PRESETS,
  type ShadowLayer,
  type ShadowType
} from '@views/image-studio/fx/shadow'
import {
  layerAppliesTo,
  SHADOW_DESIGN_REF,
  shadowScaleForSize
} from '@views/image-studio/fx/shared/targeting'
import { createId } from '@views/image-studio/utils/createId'

export type {
  LightFocus,
  LightLayer,
  LightPreset,
  LightType
} from '@views/image-studio/fx/light'
export type {
  ShadowLayer,
  ShadowPosition,
  ShadowPreset,
  ShadowType
} from '@views/image-studio/fx/shadow'

export { LIGHT_PRESETS, normalizeLightType } from '@views/image-studio/fx/light'
export { SHADOW_PRESETS } from '@views/image-studio/fx/shadow'
export {
  layerAppliesTo,
  resolveBoxShadowStyle,
  resolveDropShadowFilter,
  resolveLightOverlayStyle,
  SHADOW_DESIGN_REF,
  shadowScaleForSize
}

const STORAGE_KEY = 'pixis:image-studio:shadow-light'
const STORAGE_VERSION = 1

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

const sanitizeLightLayer = (layer: LightLayer): LightLayer => {
  const type = normalizeLightType(layer.type)
  return type === layer.type ? layer : { ...layer, type }
}

const isShadowType = (type: string): type is ShadowType =>
  SHADOW_PRESETS.some(preset => preset.type === type)

const sanitizeShadowLayer = (layer: ShadowLayer): ShadowLayer => {
  if (isShadowType(layer.type)) return layer
  return { ...layer, type: 'none', opacity: 0, blur: 0, spread: 0 }
}

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

type PersistedShadowState = {
  shadowLayers: ShadowLayer[]
  lightLayers: LightLayer[]
  activeShadowId: string
  activeLightId: string
  linkFocus: boolean
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
      lightLayers: s.lightLayers.map(layer => {
        if (layer.id !== s.activeLightId) return layer
        const next = { ...layer, ...patch }
        if (patch.type !== undefined) next.type = normalizeLightType(patch.type)
        return next
      })
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
    const resolved = normalizeLightType(type)
    const preset = LIGHT_PRESETS.find(item => item.type === resolved) ?? LIGHT_PRESETS[0]
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

const mergePersisted = (
  persisted: Partial<PersistedShadowState> | undefined,
  current: ShadowState
): ShadowState => {
  const shadowLayers =
    Array.isArray(persisted?.shadowLayers) && persisted.shadowLayers.length > 0
      ? persisted.shadowLayers.map(sanitizeShadowLayer)
      : current.shadowLayers
  const lightLayers =
    Array.isArray(persisted?.lightLayers) && persisted.lightLayers.length > 0
      ? persisted.lightLayers.map(sanitizeLightLayer)
      : current.lightLayers

  const activeShadowId =
    typeof persisted?.activeShadowId === 'string' &&
    shadowLayers.some(layer => layer.id === persisted.activeShadowId)
      ? persisted.activeShadowId
      : shadowLayers[0].id

  const activeLightId =
    typeof persisted?.activeLightId === 'string' &&
    lightLayers.some(layer => layer.id === persisted.activeLightId)
      ? persisted.activeLightId
      : lightLayers[0].id

  return {
    ...current,
    shadowLayers,
    lightLayers,
    activeShadowId,
    activeLightId,
    linkFocus: typeof persisted?.linkFocus === 'boolean' ? persisted.linkFocus : current.linkFocus
  }
}

const useShadowStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: (s): PersistedShadowState => ({
      shadowLayers: s.shadowLayers,
      lightLayers: s.lightLayers,
      activeShadowId: s.activeShadowId,
      activeLightId: s.activeLightId,
      linkFocus: s.linkFocus
    }),
    merge: (persisted, current) =>
      mergePersisted(persisted as Partial<PersistedShadowState> | undefined, current)
  })
)

export const getActiveShadow = (state: ShadowState) =>
  state.shadowLayers.find(layer => layer.id === state.activeShadowId) ?? state.shadowLayers[0]

export const getActiveLight = (state: ShadowState) => {
  const layer =
    state.lightLayers.find(item => item.id === state.activeLightId) ?? state.lightLayers[0]
  return sanitizeLightLayer(layer)
}

export default useShadowStore
