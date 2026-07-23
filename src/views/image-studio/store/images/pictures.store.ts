import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Picture {
  url: string
}

interface IPicturesStore {
  pictures: Picture[]
  setFirstPicture: (pictures: Picture) => void
  addPicture: (picture: Picture) => void
  addPictures: (pictures: Picture[]) => void
  getCurrentPicture: () => Picture | null
}

const state: StateCreator<IPicturesStore> = (set, get) => ({
  pictures: [],
  setFirstPicture: picture => {
    const prev = get().pictures
    set({ pictures: [picture, ...prev] })
  },
  addPicture: picture => {
    const prev = get().pictures
    const newPictures = [...prev, picture]
    set({ pictures: newPictures })
  },
  addPictures: pictures => {
    const prev = get().pictures
    const newPictures = [...prev, ...pictures]
    set({ pictures: newPictures })
  },
  getCurrentPicture: () => {
    const pictures = get().pictures
    if (pictures.length === 0) return null
    return pictures[0]
  }
})

const usePicturesStore = create(persist(state, { name: 'pictures' }))
// const usePicturesStore = create(state)

export default usePicturesStore
