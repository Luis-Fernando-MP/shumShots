import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import usePicturesStore from '@views/image-studio/store/images/pictures.store'

export type FrameFitMode = 'cover' | 'contain' | 'fill'
export type SlotPan = { x: number; y: number }

const STORAGE_KEY = 'pixis:image-studio:frame-config'
const STORAGE_VERSION = 1
const DEFAULT_PAN: SlotPan = { x: 0.5, y: 0.5 }

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type FrameState = {
  frameId: string | null
  fitMode: FrameFitMode
  slotPan: Record<string, SlotPan>
  selectedSlotIds: string[]
  setFrameId: (frameId: string | null) => void
  setFitMode: (fitMode: FrameFitMode) => void
  setSelectedSlotIds: (ids: string[]) => void
  setPanForSelected: (pan: SlotPan) => void
  getPanForSlot: (slotId: string) => SlotPan
  reset: () => void
}

type PersistedFrameState = {
  frameId: string | null
  fitMode: FrameFitMode
  slotPan: Record<string, SlotPan>
  selectedSlotIds: string[]
}

const syncFrameToPictures = (frameId: string | null) => {
  usePicturesStore.getState().setFrameIdForAll(frameId)
}

const state: StateCreator<FrameState> = (set, get) => ({
  frameId: null,
  fitMode: 'cover',
  slotPan: {},
  selectedSlotIds: [],

  setFrameId: frameId => {
    set({ frameId })
    syncFrameToPictures(frameId)
  },

  setFitMode: fitMode => set({ fitMode }),

  setSelectedSlotIds: ids => set({ selectedSlotIds: ids }),

  setPanForSelected: pan => {
    const next = {
      x: clamp01(pan.x),
      y: clamp01(pan.y)
    }
    const selected = get().selectedSlotIds
    const pictures = usePicturesStore.getState().pictures
    const targets = selected.length > 0 ? selected : pictures.map(item => item.id)
    set(s => {
      const slotPan = { ...s.slotPan }
      for (const id of targets) slotPan[id] = next
      return { slotPan }
    })
  },

  getPanForSlot: slotId => get().slotPan[slotId] ?? DEFAULT_PAN,

  reset: () => {
    set({
      frameId: null,
      fitMode: 'cover',
      slotPan: {},
      selectedSlotIds: []
    })
    syncFrameToPictures(null)
  }
})

const mergePersisted = (
  persisted: Partial<PersistedFrameState> | undefined,
  current: FrameState
): FrameState => {
  const frameId = typeof persisted?.frameId === 'string' || persisted?.frameId === null
    ? (persisted.frameId ?? null)
    : current.frameId

  const fitMode =
    persisted?.fitMode === 'cover' ||
    persisted?.fitMode === 'contain' ||
    persisted?.fitMode === 'fill'
      ? persisted.fitMode
      : current.fitMode

  const slotPan =
    persisted?.slotPan && typeof persisted.slotPan === 'object' ? persisted.slotPan : current.slotPan

  const selectedSlotIds = Array.isArray(persisted?.selectedSlotIds)
    ? persisted.selectedSlotIds.filter((id): id is string => typeof id === 'string')
    : current.selectedSlotIds

  if (frameId !== current.frameId) syncFrameToPictures(frameId)

  return {
    ...current,
    frameId,
    fitMode,
    slotPan,
    selectedSlotIds
  }
}

const useFrameStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: (s): PersistedFrameState => ({
      frameId: s.frameId,
      fitMode: s.fitMode,
      slotPan: s.slotPan,
      selectedSlotIds: s.selectedSlotIds
    }),
    merge: (persisted, current) =>
      mergePersisted(persisted as Partial<PersistedFrameState> | undefined, current),
    onRehydrateStorage: () => state => {
      if (state) syncFrameToPictures(state.frameId)
    }
  })
)

export const defaultSlotPan = DEFAULT_PAN
export default useFrameStore
