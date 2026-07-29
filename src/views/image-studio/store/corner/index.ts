import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { BorderFinish } from '@views/image-studio/utils/borderFinish'
import type { BorderType } from '@views/image-studio/store/border/createBorderStore'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore, type TabLayer } from '@views/image-studio/shared/components/tabs/store'
import { resolveTabConfig, syncTabBuckets } from '@views/image-studio/shared/resolveTabConfig'

export type CornerBorderConfig = {
  color: string
  size: number
  gradient: string | null
  type: BorderType
  finish: BorderFinish
  blendMode: string
  matEnabled: boolean
  matColor: string
  matTop: number
  matRight: number
  matBottom: number
  matLeft: number
}

export type CornerRadiusConfig = {
  activeIndividualBorder: boolean
  borderLTRadius: number
  borderRTRadius: number
  borderLBRadius: number
  borderRBRadius: number
  borderRadius: number
  borderSmooth: number
}

export type CornerTabConfig = {
  border: CornerBorderConfig
  radius: CornerRadiusConfig
}

const DEFAULT_BORDER: CornerBorderConfig = {
  color: 'rgba(255, 255, 255, 1)',
  size: 5,
  type: 'none',
  finish: 'soft',
  gradient: null,
  blendMode: 'normal',
  matEnabled: false,
  matColor: 'rgba(255, 255, 255, 1)',
  matTop: 0,
  matRight: 0,
  matBottom: 0,
  matLeft: 0
}

const DEFAULT_RADIUS: CornerRadiusConfig = {
  activeIndividualBorder: false,
  borderLTRadius: 20,
  borderRTRadius: 20,
  borderLBRadius: 20,
  borderRBRadius: 20,
  borderRadius: 20,
  borderSmooth: 0
}

export const createDefaultCornerConfig = (): CornerTabConfig => ({
  border: { ...DEFAULT_BORDER },
  radius: { ...DEFAULT_RADIUS }
})

type CornerState = {
  byTab: Record<string, CornerTabConfig>
  syncTabs: (layers: TabLayer[]) => void
  patchBorder: (tabId: string, patch: Partial<CornerBorderConfig>) => void
  patchRadius: (tabId: string, patch: Partial<CornerRadiusConfig>) => void
  reset: () => void
  resolveForSlot: (slotId: string) => CornerTabConfig
}

const STORAGE_KEY = 'pixis:image-studio:corner'
const STORAGE_VERSION = 1

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

export default useCornerStore
