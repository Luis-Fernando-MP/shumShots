import { createJSONStorage, persist } from 'zustand/middleware'
import { create, type StateCreator } from 'zustand'

import {
  clampSlotQuantity,
  SLOT_QUANTITY_CONFIG
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'
import { moveById } from '@views/image-studio/utils/moveById'

export type PictureItem = {
  id: string
  libraryId: string | null
  frameId: string | null
  /** Cached from Frame store when a device frame is applied. */
  frameAspect: number | null
  width: number
  height: number
  aspectRatio: number
}

type PicturesState = {
  pictures: PictureItem[]
  count: number
  selectedId: string
  setCount: (count: number) => string[]
  setSelected: (id: string) => void
  setLibraryId: (slotId: string, libraryId: string | null) => void
  setFrameMeta: (id: string, frameId: string | null, frameAspect: number | null) => void
  setFrameIdForAll: (frameId: string | null, frameAspect?: number | null) => void
  setPictureSize: (id: string, size: { width: number; height: number; aspectRatio: number }) => void
  reorderSlots: (activeId: string, overId: string) => void
  clearLibraryRefs: (libraryId: string) => void
  getSelected: () => PictureItem | null
}

export const formatSlotId = (index: number) => `slot-${String(index + 1).padStart(2, '0')}`

export const normalizeSlotId = (id: string, index: number) => {
  const pictureMatch = id.match(/^picture-(\d+)$/i)
  if (pictureMatch) return formatSlotId(Math.max(0, Number(pictureMatch[1]) - 1))
  const slotMatch = id.match(/^slot-0*(\d+)$/i)
  if (slotMatch) return formatSlotId(Math.max(0, Number(slotMatch[1]) - 1))
  return formatSlotId(index)
}

const createPicture = (index: number): PictureItem => ({
  id: formatSlotId(index),
  libraryId: null,
  frameId: null,
  frameAspect: null,
  width: 420,
  height: 315,
  aspectRatio: 4 / 3
})

const nextUnusedSlotId = (used: Set<string>) => {
  let index = 0
  while (used.has(formatSlotId(index))) index += 1
  return formatSlotId(index)
}

const buildPictures = (count: number, previous: PictureItem[] = []): PictureItem[] => {
  const inheritedFrameId = previous.find(item => item.frameId)?.frameId ?? null
  const inheritedFrameAspect = previous.find(item => item.frameId)?.frameAspect ?? null
  const used = new Set<string>()
  return Array.from({ length: count }, (_, index) => {
    const existing = previous[index]
    if (existing) {
      const id = normalizeSlotId(existing.id, index)
      used.add(id)
      return {
        ...existing,
        id,
        frameAspect:
          typeof existing.frameAspect === 'number' && existing.frameAspect > 0
            ? existing.frameAspect
            : null
      }
    }
    const id = nextUnusedSlotId(used)
    used.add(id)
    return {
      ...createPicture(index),
      id,
      frameId: inheritedFrameId,
      frameAspect: inheritedFrameAspect
    }
  })
}

const INITIAL_COUNT = SLOT_QUANTITY_CONFIG.ONE
const initialPictures = buildPictures(INITIAL_COUNT)
const STORAGE_KEY = 'pixis-picture-slots'

const state: StateCreator<PicturesState> = (set, get) => ({
  pictures: initialPictures,
  count: INITIAL_COUNT,
  selectedId: initialPictures[0].id,

  setCount: count => {
    const prev = get().pictures
    const nextCount = clampSlotQuantity(count)
    const pictures = buildPictures(nextCount, prev)
    const removedIds = prev.slice(nextCount).map(item => item.id)
    const selectedStillExists = pictures.some(item => item.id === get().selectedId)
    set({
      count: nextCount,
      pictures,
      selectedId: selectedStillExists ? get().selectedId : pictures[0].id
    })
    return removedIds
  },

  setSelected: id => {
    if (!get().pictures.some(item => item.id === id)) return
    set({ selectedId: id })
  },

  setLibraryId: (slotId, libraryId) =>
    set(s => ({
      pictures: s.pictures.map(item => (item.id === slotId ? { ...item, libraryId } : item))
    })),

  setFrameMeta: (id, frameId, frameAspect) =>
    set(s => ({
      pictures: s.pictures.map(item =>
        item.id === id
          ? {
              ...item,
              frameId,
              frameAspect:
                frameId && typeof frameAspect === 'number' && frameAspect > 0 ? frameAspect : null
            }
          : item
      )
    })),

  setFrameIdForAll: (frameId, frameAspect = null) =>
    set(s => ({
      pictures: s.pictures.map(item => ({
        ...item,
        frameId,
        frameAspect:
          frameId && typeof frameAspect === 'number' && frameAspect > 0 ? frameAspect : null
      }))
    })),

  setPictureSize: (id, size) =>
    set(s => {
      const current = s.pictures.find(item => item.id === id)
      if (
        current &&
        current.width === size.width &&
        current.height === size.height &&
        current.aspectRatio === size.aspectRatio
      ) {
        return s
      }
      return {
        pictures: s.pictures.map(item =>
          item.id === id
            ? { ...item, width: size.width, height: size.height, aspectRatio: size.aspectRatio }
            : item
        )
      }
    }),

  reorderSlots: (activeId, overId) =>
    set(s => {
      const pictures = moveById(s.pictures, activeId, overId)
      return pictures ? { pictures } : s
    }),

  clearLibraryRefs: libraryId =>
    set(s => ({
      pictures: s.pictures.map(item =>
        item.libraryId === libraryId ? { ...item, libraryId: null } : item
      )
    })),

  getSelected: () => {
    const { pictures, selectedId } = get()
    return pictures.find(item => item.id === selectedId) ?? pictures[0] ?? null
  }
})

const usePicturesStore = create(
  persist(state, {
    name: STORAGE_KEY,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    migrate: persisted => persisted,
    partialize: s => ({
      pictures: s.pictures,
      count: s.count,
      selectedId: s.selectedId
    }),
    merge: (persisted, current) => {
      const data = (persisted ?? {}) as Partial<PicturesState>
      const raw =
        Array.isArray(data.pictures) && data.pictures.length > 0 ? data.pictures : current.pictures
      const pictures = raw.map((item, index) => ({
        ...item,
        id: normalizeSlotId(item.id, index),
        frameAspect:
          typeof item.frameAspect === 'number' && item.frameAspect > 0 ? item.frameAspect : null,
        aspectRatio:
          typeof item.aspectRatio === 'number' && item.aspectRatio > 0
            ? item.aspectRatio
            : item.width / Math.max(1, item.height || 1)
      }))
      const count = clampSlotQuantity(
        typeof data.count === 'number' ? data.count : pictures.length || current.count
      )
      const selectedId =
        typeof data.selectedId === 'string'
          ? normalizeSlotId(data.selectedId, 0)
          : (pictures[0]?.id ?? current.selectedId)
      const resolvedSelected = pictures.some(item => item.id === selectedId)
        ? selectedId
        : (pictures[0]?.id ?? current.selectedId)
      return { ...current, pictures, count, selectedId: resolvedSelected }
    }
  })
)

export default usePicturesStore
