import { StateCreator, create } from 'zustand'

interface Image {
  selected?: boolean
  url: string
}

interface IImagesStore {
  scale: number
  width: number
  height: number
  aspectRatio: number
  setScale: (scale: number) => void
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  setAspectRatio: (aspectRatio: number) => void
}

const state: StateCreator<IImagesStore> = (set, get) => ({
  scale: 1,
  width: 624,
  height: 416,
  aspectRatio: 3 / 2,
  setScale: scale => set({ scale }),
  setWidth: width => set({ width }),
  setHeight: height => set({ height }),
  setAspectRatio: aspectRatio => set({ aspectRatio })
})

const useImagesStore = create(state)

export default useImagesStore
