import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { resolveTabConfig, syncTabBuckets } from '@views/image-studio/Popups/common/components/tabs/resolveTabConfig'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'

import {
  clamp01,
  createDefaultFrameConfig,
  DEFAULT_PAN,
  defaultSlotPan,
  STORAGE_KEY
} from './initialState'
import type FrameState from './type.frame'
import type { FrameFitMode, FrameTabConfig, SlotPan } from './type.frame'

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
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({
      byTab: s.byTab,
      slotPan: s.slotPan
    }),
    migrate: persisted => {
      const data = (persisted ?? {}) as Record<string, unknown>
      if (data.byTab && typeof data.byTab === 'object') return data

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
    },
    onRehydrateStorage: () => state => {
      if (state) state.syncResolvedFramesToPictures()
    }
  })
)

export { createDefaultFrameConfig, defaultSlotPan }
export type { FrameFitMode, FrameTabConfig, SlotPan }
export default useFrameStore
