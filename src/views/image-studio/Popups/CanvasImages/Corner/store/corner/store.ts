import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { resolveTabConfig, syncTabBuckets } from '@views/image-studio/Popups/common/components/tabs/resolveTabConfig'

import { createDefaultCornerConfig, STORAGE_KEY, STORAGE_VERSION } from './initialState'
import type CornerState from './type.corner'
import type { CornerTabConfig } from './type.corner'

const state: StateCreator<CornerState> = (set, get) => ({
  byTab: {},

  syncTabs: layers => {
    set(s => ({ byTab: syncTabBuckets(s.byTab, layers, createDefaultCornerConfig) }))
  },

  patchBorder: (tabId, patch) => {
    set(s => {
      const current = s.byTab[tabId] ?? createDefaultCornerConfig()
      return {
        byTab: {
          ...s.byTab,
          [tabId]: {
            ...current,
            border: { ...current.border, ...patch }
          }
        }
      }
    })
  },

  patchRadius: (tabId, patch) => {
    set(s => {
      const current = s.byTab[tabId] ?? createDefaultCornerConfig()
      return {
        byTab: {
          ...s.byTab,
          [tabId]: {
            ...current,
            radius: { ...current.radius, ...patch }
          }
        }
      }
    })
  },

  reset: () => {
    const layers = getTabsStore(TABS_SCOPES.corner).getState().layers
    const byTab: Record<string, CornerTabConfig> = {}
    for (const layer of layers) byTab[layer.id] = createDefaultCornerConfig()
    set({ byTab })
  },

  resolveForSlot: slotId => {
    const layers = getTabsStore(TABS_SCOPES.corner).getState().layers
    return resolveTabConfig(layers, get().byTab, slotId, createDefaultCornerConfig())
  }
})

const useCornerStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({ byTab: s.byTab })
  })
)

export { createDefaultCornerConfig }
export type {
  CornerBorderConfig,
  CornerRadiusConfig,
  CornerTabConfig
} from './type.corner'
export default useCornerStore
