import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore, type TabLayer } from '@views/image-studio/shared/components/tabs/store'
import { resolveTabConfig, syncTabBuckets } from '@views/image-studio/shared/resolveTabConfig'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'

export type FrameFitMode = 'cover' | 'contain' | 'fill'
export type SlotPan = { x: number; y: number }

export type FrameTabConfig = {
  frameId: string | null
  fitMode: FrameFitMode
}

const STORAGE_KEY = 'pixis:image-studio:frame-config'
const STORAGE_VERSION = 2
const DEFAULT_PAN: SlotPan = { x: 0.5, y: 0.5 }

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const createDefaultFrameConfig = (): FrameTabConfig => ({
  frameId: null,
  fitMode: 'cover'
})

type FrameState = {
  byTab: Record<string, FrameTabConfig>
  slotPan: Record<string, SlotPan>
  syncTabs: (layers: TabLayer[]) => void
  setFrameId: (tabId: string, frameId: string | null) => void
  setFitMode: (tabId: string, fitMode: FrameFitMode) => void
  setPanForSlots: (slotIds: string[], pan: SlotPan) => void
  getPanForSlot: (slotId: string) => SlotPan
  resolveForSlot: (slotId: string) => FrameTabConfig
  syncResolvedFramesToPictures: () => void
  reset: () => void
}

const syncResolvedFramesToPictures = (resolve: (slotId: string) => FrameTabConfig) => {
  const { pictures, setFrameId } = usePicturesStore.getState()
  for (const picture of pictures) {
    const next = resolve(picture.id).frameId
    if (picture.frameId !== next) setFrameId(picture.id, next)
  }
}

const state: StateCreator<FrameState> = (set, get) => ({
  byTab: {},
  slotPan: {},

  syncTabs: layers => {
    set(s => ({ byTab: syncTabBuckets(s.byTab, layers, createDefaultFrameConfig) }))
    get().syncResolvedFramesToPictures()
  },

  setFrameId: (tabId, frameId) => {
    set(s => {
      const current = s.byTab[tabId] ?? createDefaultFrameConfig()
      return {
        byTab: {
          ...s.byTab,
          [tabId]: { ...current, frameId }
        }
      }
    })
    get().syncResolvedFramesToPictures()
  },

  setFitMode: (tabId, fitMode) => {
    set(s => {
      const current = s.byTab[tabId] ?? createDefaultFrameConfig()
      return {
        byTab: {
          ...s.byTab,
          [tabId]: { ...current, fitMode }
        }
      }
    })
  },

  setPanForSlots: (slotIds, pan) => {
    const next = { x: clamp01(pan.x), y: clamp01(pan.y) }
    const pictures = usePicturesStore.getState().pictures
    const targets = slotIds.length > 0 ? slotIds : pictures.map(item => item.id)
    set(s => {
      const slotPan = { ...s.slotPan }
      for (const id of targets) slotPan[id] = next
      return { slotPan }
    })
  },

  getPanForSlot: slotId => get().slotPan[slotId] ?? DEFAULT_PAN,

  resolveForSlot: slotId => {
    const layers = getTabsStore(TABS_SCOPES.frame).getState().layers
    return resolveTabConfig(layers, get().byTab, slotId, createDefaultFrameConfig())
  },

  syncResolvedFramesToPictures: () => {
    syncResolvedFramesToPictures(slotId => get().resolveForSlot(slotId))
  },

  reset: () => {
    const layers = getTabsStore(TABS_SCOPES.frame).getState().layers
    const byTab: Record<string, FrameTabConfig> = {}
    for (const layer of layers) byTab[layer.id] = createDefaultFrameConfig()
    set({ byTab, slotPan: {} })
    get().syncResolvedFramesToPictures()
  }
})

const useFrameStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({
      byTab: s.byTab,
      slotPan: s.slotPan
    }),
    migrate: (persisted, version) => {
      const data = (persisted ?? {}) as Record<string, unknown>
      if (version < 2) {
        const frameId =
          typeof data.frameId === 'string' || data.frameId === null ? data.frameId : null
        const fitMode =
          data.fitMode === 'cover' || data.fitMode === 'contain' || data.fitMode === 'fill'
            ? data.fitMode
            : 'cover'
        const slotPan =
          data.slotPan && typeof data.slotPan === 'object'
            ? (data.slotPan as Record<string, SlotPan>)
            : {}
        const layers = getTabsStore(TABS_SCOPES.frame).getState().layers
        const byTab: Record<string, FrameTabConfig> = {}
        for (const layer of layers) {
          byTab[layer.id] = { frameId: frameId as string | null, fitMode: fitMode as FrameFitMode }
        }
        return { byTab, slotPan }
      }
      return data
    },
    onRehydrateStorage: () => state => {
      if (state) state.syncResolvedFramesToPictures()
    }
  })
)

export const defaultSlotPan = DEFAULT_PAN
export default useFrameStore
