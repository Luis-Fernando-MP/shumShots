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

const normalizeFrameAspect = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null

const normalizeTabConfig = (raw: Partial<FrameTabConfig> | undefined): FrameTabConfig => {
  const base = createDefaultFrameConfig()
  if (!raw || typeof raw !== 'object') return base
  return {
    frameId: typeof raw.frameId === 'string' || raw.frameId === null ? raw.frameId : base.frameId,
    frameAspect: normalizeFrameAspect(raw.frameAspect),
    fitMode:
      raw.fitMode === 'cover' || raw.fitMode === 'contain' || raw.fitMode === 'fill'
        ? raw.fitMode
        : base.fitMode
  }
}

const syncResolvedFramesToPictures = (resolve: (slotId: string) => FrameTabConfig) => {
  const { pictures, setFrameMeta } = usePicturesStore.getState()
  for (const picture of pictures) {
    const next = resolve(picture.id)
    if (picture.frameId !== next.frameId || picture.frameAspect !== next.frameAspect) {
      setFrameMeta(picture.id, next.frameId, next.frameAspect)
    }
  }
}

const state: StateCreator<FrameState> = (set, get) => ({
  byTab: {},
  slotPan: {},

  syncTabs: layers => {
    set(s => ({ byTab: syncTabBuckets(s.byTab, layers, createDefaultFrameConfig) }))
    get().syncResolvedFramesToPictures()
  },

  setFrameId: (tabId, frameId, frameAspect = null) => {
    set(s => {
      const current = s.byTab[tabId] ?? createDefaultFrameConfig()
      return {
        byTab: {
          ...s.byTab,
          [tabId]: {
            ...current,
            frameId,
            frameAspect: frameId ? normalizeFrameAspect(frameAspect) : null
          }
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
      if (data.byTab && typeof data.byTab === 'object') {
        const byTab: Record<string, FrameTabConfig> = {}
        for (const [id, value] of Object.entries(data.byTab as Record<string, Partial<FrameTabConfig>>)) {
          byTab[id] = normalizeTabConfig(value)
        }
        return { ...data, byTab }
      }

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
        byTab[layer.id] = {
          frameId: frameId as string | null,
          frameAspect: null,
          fitMode: fitMode as FrameFitMode
        }
      }
      return { byTab, slotPan }
    },
    merge: (persisted, current) => {
      const data = (persisted ?? {}) as Partial<{
        byTab: Record<string, Partial<FrameTabConfig>>
        slotPan: Record<string, SlotPan>
      }>
      const byTab: Record<string, FrameTabConfig> = {}
      if (data.byTab && typeof data.byTab === 'object') {
        for (const [id, value] of Object.entries(data.byTab)) {
          byTab[id] = normalizeTabConfig(value)
        }
      }
      return {
        ...current,
        byTab: Object.keys(byTab).length > 0 ? byTab : current.byTab,
        slotPan:
          data.slotPan && typeof data.slotPan === 'object' ? data.slotPan : current.slotPan
      }
    },
    onRehydrateStorage: () => state => {
      if (state) state.syncResolvedFramesToPictures()
    }
  })
)

export { createDefaultFrameConfig, defaultSlotPan }
export type { FrameFitMode, FrameTabConfig, SlotPan }
export default useFrameStore
