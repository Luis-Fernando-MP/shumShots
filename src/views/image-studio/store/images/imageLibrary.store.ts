import { createJSONStorage, persist } from 'zustand/middleware'
import { create, type StateCreator } from 'zustand'

import { createId } from '@views/image-studio/utils/createId'
import { deleteImageBlob, putImageBlob } from '@views/image-studio/utils/imageBlobDb'
import { moveById } from '@views/image-studio/utils/moveById'

export const MAX_LIBRARY_IMAGES = 10

export type LibraryImage = {
  id: string
  name: string
  width: number
  height: number
  bytes: number
  createdAt: number
  active: boolean
}

type LibraryState = {
  images: LibraryImage[]
  addImage: (input: {
    dataUrl: string
    width: number
    height: number
    bytes: number
    preferredName?: string
  }) => Promise<LibraryImage>
  removeImage: (id: string) => void
  renameImage: (id: string, name: string) => boolean
  setActive: (id: string, active: boolean) => void
  reorderImages: (activeId: string, overId: string) => void
  getById: (id: string) => LibraryImage | undefined
}

const STORAGE_KEY = 'pixis-image-library'
const STORAGE_VERSION = 2

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'img'

const uniqueName = (base: string, images: LibraryImage[], ignoreId?: string) => {
  const root = slugify(base)
  const taken = new Set(images.filter(item => item.id !== ignoreId).map(item => item.name))
  if (!taken.has(root)) return root
  let i = 2
  while (taken.has(`${root}-${i}`)) i += 1
  return `${root}-${i}`
}

const stripHeavy = (item: Record<string, unknown>): LibraryImage | null => {
  if (typeof item.id !== 'string' || typeof item.name !== 'string') return null
  return {
    id: item.id,
    name: item.name,
    width: typeof item.width === 'number' ? item.width : 0,
    height: typeof item.height === 'number' ? item.height : 0,
    bytes: typeof item.bytes === 'number' ? item.bytes : 0,
    createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
    active: item.active !== false
  }
}

const nextPixiName = (images: LibraryImage[]) => {
  const taken = new Set(images.map(item => item.name))
  let n = 1
  while (taken.has(`pixi-${String(n).padStart(4, '0')}`)) n += 1
  return `pixi-${String(n).padStart(4, '0')}`
}

const state: StateCreator<LibraryState> = (set, get) => ({
  images: [],

  addImage: async input => {
    const images = [...get().images]
    const id = createId('img')
    const name = input.preferredName
      ? uniqueName(input.preferredName, images)
      : nextPixiName(images)

    await putImageBlob(id, input.dataUrl)

    const next: LibraryImage = {
      id,
      name,
      width: input.width,
      height: input.height,
      bytes: input.bytes,
      createdAt: Date.now(),
      active: true
    }

    images.push(next)
    while (images.length > MAX_LIBRARY_IMAGES) {
      const removed = images.shift()
      if (removed) void deleteImageBlob(removed.id)
    }

    set({ images })
    return next
  },

  removeImage: id => {
    void deleteImageBlob(id)
    set(s => ({ images: s.images.filter(item => item.id !== id) }))
  },

  renameImage: (id, name) => {
    const trimmed = slugify(name)
    if (!trimmed) return false
    const images = get().images
    const unique = uniqueName(trimmed, images, id)
    set({
      images: images.map(item => (item.id === id ? { ...item, name: unique } : item))
    })
    return true
  },

  setActive: (id, active) =>
    set(s => ({
      images: s.images.map(item => (item.id === id ? { ...item, active } : item))
    })),

  reorderImages: (activeId, overId) =>
    set(s => {
      const images = moveById(s.images, activeId, overId)
      return images ? { images } : s
    }),

  getById: id => get().images.find(item => item.id === id)
})

const useImageLibraryStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({ images: s.images }),
    merge: (persisted, current) => {
      const data = (persisted ?? {}) as { images?: unknown }
      if (!Array.isArray(data.images)) return current
      const images = data.images
        .map(item => (item && typeof item === 'object' ? stripHeavy(item as Record<string, unknown>) : null))
        .filter((item): item is LibraryImage => item != null)
      return { ...current, images }
    },
    migrate: async persisted => {
      if (!persisted || typeof persisted !== 'object') return { images: [] }
      const raw = (persisted as { images?: unknown }).images
      if (!Array.isArray(raw)) return { images: [] }

      const images: LibraryImage[] = []
      for (const entry of raw) {
        if (!entry || typeof entry !== 'object') continue
        const record = entry as Record<string, unknown>
        const meta = stripHeavy(record)
        if (!meta) continue
        if (typeof record.dataUrl === 'string' && record.dataUrl.length > 0) {
          await putImageBlob(meta.id, record.dataUrl)
        }
        images.push(meta)
      }
      return { images }
    }
  })
)

export default useImageLibraryStore
