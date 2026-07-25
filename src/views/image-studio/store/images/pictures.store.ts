import { create, type StateCreator } from 'zustand'

export type PictureItem = {
  id: string
  url: string | null
  frameId: string | null
  width: number
  height: number
  aspectRatio: number
}

type PicturesState = {
  pictures: PictureItem[]
  count: number
  selectedId: string
  setCount: (count: number) => void
  setSelected: (id: string) => void
  setPictureUrl: (id: string, url: string | null) => void
  setFrameId: (id: string, frameId: string | null) => void
  setFrameIdForAll: (frameId: string | null) => void
  setPictureSize: (id: string, size: { width: number; height: number; aspectRatio: number }) => void
  getSelected: () => PictureItem | null
}

const createPicture = (index: number): PictureItem => ({
  id: `picture-${index + 1}`,
  url: null,
  frameId: null,
  width: 320,
  height: 240,
  aspectRatio: 4 / 3
})

const buildPictures = (count: number, previous: PictureItem[] = []): PictureItem[] => {
  const inheritedFrameId = previous.find(item => item.frameId)?.frameId ?? null
  return Array.from({ length: count }, (_, index) => {
    const existing = previous[index]
    if (existing) return { ...existing, id: `picture-${index + 1}` }
    return { ...createPicture(index), frameId: inheritedFrameId }
  })
}

const INITIAL_COUNT = 1
const initialPictures = buildPictures(INITIAL_COUNT)

const state: StateCreator<PicturesState> = (set, get) => ({
  pictures: initialPictures,
  count: INITIAL_COUNT,
  selectedId: initialPictures[0].id,
  setCount: count => {
    const nextCount = Math.min(5, Math.max(1, Math.round(count)))
    const pictures = buildPictures(nextCount, get().pictures)
    const selectedStillExists = pictures.some(item => item.id === get().selectedId)
    set({
      count: nextCount,
      pictures,
      selectedId: selectedStillExists ? get().selectedId : pictures[0].id
    })
  },
  setSelected: id => {
    if (!get().pictures.some(item => item.id === id)) return
    set({ selectedId: id })
  },
  setPictureUrl: (id, url) =>
    set(state => ({
      pictures: state.pictures.map(item => (item.id === id ? { ...item, url } : item))
    })),
  setFrameId: (id, frameId) =>
    set(state => ({
      pictures: state.pictures.map(item => (item.id === id ? { ...item, frameId } : item))
    })),
  setFrameIdForAll: frameId =>
    set(state => ({
      pictures: state.pictures.map(item => ({ ...item, frameId }))
    })),
  setPictureSize: (id, size) =>
    set(state => ({
      pictures: state.pictures.map(item =>
        item.id === id
          ? { ...item, width: size.width, height: size.height, aspectRatio: size.aspectRatio }
          : item
      )
    })),
  getSelected: () => {
    const { pictures, selectedId } = get()
    return pictures.find(item => item.id === selectedId) ?? pictures[0] ?? null
  }
})

const usePicturesStore = create(state)

export default usePicturesStore
