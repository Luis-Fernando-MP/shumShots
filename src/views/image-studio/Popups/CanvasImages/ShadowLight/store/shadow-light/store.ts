import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { TABS_SCOPES } from '@views/image-studio/constants'
import {
  LIGHT_PRESETS,
  normalizeLightType,
  type LightLayer
} from '@views/image-studio/Popups/common/presets/light'
import {
  SHADOW_PRESETS,
  type ShadowLayer,
  type ShadowType
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/presets/shadow'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { resolveTabConfig, syncTabBuckets } from '@views/image-studio/Popups/common/components/tabs/resolveTabConfig'

import {
  createDefaultShadowConfig,
  defaultLightLayer,
  defaultShadowLayer
} from './initialState'
import type ShadowState from './type.shadow-light'
import type { ShadowTabConfig } from './type.shadow-light'

const STORAGE_KEY = 'pixis:image-studio:shadow-light'

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

const patchTab = (
  set: (fn: (s: ShadowState) => Partial<ShadowState>) => void,
  tabId: string,
  updater: (config: ShadowTabConfig) => ShadowTabConfig
) => {
  set(s => {
    const current = s.byTab[tabId] ?? createDefaultShadowConfig()
    return {
      byTab: {
        ...s.byTab,
        [tabId]: updater(current)
      }
    }
  })
}

const state: StateCreator<ShadowState> = (set, get) => ({
  byTab: {},

  syncTabs: layers => {
    set(s => ({ byTab: syncTabBuckets(s.byTab, layers, createDefaultShadowConfig) }))
  },

  getTabConfig: tabId => get().byTab[tabId] ?? createDefaultShadowConfig(),

  setActiveShadow: (tabId, id) => {
    patchTab(set, tabId, config => {
      if (!config.shadowLayers.some(layer => layer.id === id)) return config
      return { ...config, activeShadowId: id }
    })
  },

  setActiveLight: (tabId, id) => {
    patchTab(set, tabId, config => {
      if (!config.lightLayers.some(layer => layer.id === id)) return config
      return { ...config, activeLightId: id }
    })
  },

  setLinkFocus: (tabId, value) => {
    patchTab(set, tabId, config => ({ ...config, linkFocus: value }))
  },

  addShadowLayer: tabId => {
    patchTab(set, tabId, config => {
      const layer = defaultShadowLayer(config.shadowLayers.length + 1)
      return {
        ...config,
        shadowLayers: [...config.shadowLayers, layer],
        activeShadowId: layer.id
      }
    })
  },

  addLightLayer: tabId => {
    patchTab(set, tabId, config => {
      const layer = defaultLightLayer(config.lightLayers.length + 1)
      return {
        ...config,
        lightLayers: [...config.lightLayers, layer],
        activeLightId: layer.id
      }
    })
  },

  removeShadowLayer: (tabId, id) => {
    patchTab(set, tabId, config => {
      if (config.shadowLayers.length <= 1) {
        const reset = defaultShadowLayer(1)
        return { ...config, shadowLayers: [reset], activeShadowId: reset.id }
      }
      const shadowLayers = config.shadowLayers.filter(layer => layer.id !== id)
      return {
        ...config,
        shadowLayers,
        activeShadowId:
          config.activeShadowId === id ? shadowLayers[0].id : config.activeShadowId
      }
    })
  },

  removeLightLayer: (tabId, id) => {
    patchTab(set, tabId, config => {
      if (config.lightLayers.length <= 1) {
        const reset = defaultLightLayer(1)
        return { ...config, lightLayers: [reset], activeLightId: reset.id }
      }
      const lightLayers = config.lightLayers.filter(layer => layer.id !== id)
      return {
        ...config,
        lightLayers,
        activeLightId: config.activeLightId === id ? lightLayers[0].id : config.activeLightId
      }
    })
  },

  updateActiveShadow: (tabId, patch) => {
    patchTab(set, tabId, config => ({
      ...config,
      shadowLayers: config.shadowLayers.map(layer =>
        layer.id === config.activeShadowId ? { ...layer, ...patch } : layer
      )
    }))
  },

  updateActiveLight: (tabId, patch) => {
    patchTab(set, tabId, config => ({
      ...config,
      lightLayers: config.lightLayers.map(layer => {
        if (layer.id !== config.activeLightId) return layer
        const next = { ...layer, ...patch }
        if (patch.type !== undefined) next.type = normalizeLightType(patch.type)
        return next
      })
    }))
  },

  applyShadowPreset: (tabId, type) => {
    const preset = SHADOW_PRESETS.find(item => item.type === type) ?? SHADOW_PRESETS[0]
    get().updateActiveShadow(tabId, {
      type: preset.type,
      blur: preset.blur,
      spread: preset.spread,
      opacity: preset.opacity,
      position: { x: preset.x, y: preset.y }
    })
  },

  applyLightPreset: (tabId, type) => {
    const resolved = normalizeLightType(type)
    const preset = LIGHT_PRESETS.find(item => item.type === resolved) ?? LIGHT_PRESETS[0]
    get().updateActiveLight(tabId, {
      type: preset.type,
      opacity: preset.opacity,
      size: preset.size,
      color: preset.color,
      focus: { x: preset.x, y: preset.y }
    })
  },

  clearTab: tabId => {
    set(s => ({
      byTab: {
        ...s.byTab,
        [tabId]: createDefaultShadowConfig()
      }
    }))
  },

  reset: () => {
    const layers = getTabsStore(TABS_SCOPES.shadow).getState().layers
    const byTab: Record<string, ShadowTabConfig> = {}
    for (const layer of layers) byTab[layer.id] = createDefaultShadowConfig()
    set({ byTab })
  },

  resolveForSlot: slotId => {
    const layers = getTabsStore(TABS_SCOPES.shadow).getState().layers
    return resolveTabConfig(layers, get().byTab, slotId, createDefaultShadowConfig())
  }
})

const useShadowStore = create(
  persist(state, {
    name: STORAGE_KEY,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({ byTab: s.byTab }),
    migrate: persisted => {
      const data = (persisted ?? {}) as Record<string, unknown>
      if (data.byTab && typeof data.byTab === 'object') return data

      const shadowLayers = Array.isArray(data.shadowLayers)
        ? (data.shadowLayers as ShadowLayer[]).map(sanitizeShadowLayer)
        : null
      const lightLayers = Array.isArray(data.lightLayers)
        ? (data.lightLayers as LightLayer[]).map(sanitizeLightLayer)
        : null
      if (!shadowLayers && !lightLayers) return data

      const layers = getTabsStore(TABS_SCOPES.shadow).getState().layers
      const seed = createDefaultShadowConfig()
      if (shadowLayers && shadowLayers.length > 0) {
        seed.shadowLayers = shadowLayers
        seed.activeShadowId =
          typeof data.activeShadowId === 'string' &&
          shadowLayers.some(layer => layer.id === data.activeShadowId)
            ? data.activeShadowId
            : shadowLayers[0].id
      }
      if (lightLayers && lightLayers.length > 0) {
        seed.lightLayers = lightLayers
        seed.activeLightId =
          typeof data.activeLightId === 'string' &&
          lightLayers.some(layer => layer.id === data.activeLightId)
            ? data.activeLightId
            : lightLayers[0].id
      }
      if (typeof data.linkFocus === 'boolean') seed.linkFocus = data.linkFocus
      const byTab: Record<string, ShadowTabConfig> = {}
      for (const layer of layers) byTab[layer.id] = { ...seed }
      return { byTab }
    }
  })
)

export const selectTabConfig = (tabId: string) => (state: ShadowState) =>
  state.byTab[tabId] ?? createDefaultShadowConfig()

export const getActiveShadow = (tabId: string) => (state: ShadowState) => {
  const config = selectTabConfig(tabId)(state)
  return (
    config.shadowLayers.find(layer => layer.id === config.activeShadowId) ?? config.shadowLayers[0]
  )
}

export const getActiveLight = (tabId: string) => (state: ShadowState) => {
  const config = selectTabConfig(tabId)(state)
  const layer =
    config.lightLayers.find(item => item.id === config.activeLightId) ?? config.lightLayers[0]
  return sanitizeLightLayer(layer)
}

export { createDefaultShadowConfig }
export default useShadowStore
