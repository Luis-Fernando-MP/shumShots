import { newKey } from '@/shared/key'
import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Picture {
  key: string
  url: string
}

interface IPicturesStore {
  pictures: Picture[]
  _validateMaxPictures: (newPictures: Picture[]) => boolean
  addPicture: (picture: Picture) => void
  addPictures: (pictures: Picture[]) => void
  getCurrentPicture: () => Picture | null
}

export const MAX_PICTURES = 5

const state: StateCreator<IPicturesStore> = (set, get) => ({
  pictures: [
    {
      key: newKey('picture'),
      url: 'https://www.worldhistory.org/img/r/p/500x600/17979.jpeg?v=1732060864-1696316611'
    },
    {
      key: newKey('picture'),
      url: 'https://cdnb.artstation.com/p/assets/images/images/052/554/635/large/maya-valkyria-tsutsui-kamehouse1.jpg'
    },
    {
      key: newKey('picture'),
      url: 'https://maximilianocosta.com.ar/wp/wp-content/uploads/2017/07/5_kamehouse.jpg'
    },
    {
      key: newKey('picture'),
      url: 'https://cdnb.artstation.com/p/assets/images/images/052/554/635/large/maya-valkyria-tsutsui-kamehouse1.jpg'
    },
    {
      key: newKey('picture'),
      url: 'https://media.meer.com/attachments/3a8840c888aafb1bee1dfae64d42984dc9ac6b5d/store/fill/1090/613/12a7fb9ca8b5a049b80eb391386afe4858f4555f510e2d3086e68f1694bc/La-ultima-cena-1495-1498.jpg'
    }
  ],
  _validateMaxPictures: (newPictures: Picture[]) => {
    const pictures = get().pictures
    if (pictures.length + newPictures.length > MAX_PICTURES) return false

    set({ pictures: [...newPictures, ...pictures] })
    return true
  },
  addPicture: picture => {
    const setPictures = get()._validateMaxPictures([picture])
    return setPictures
  },
  addPictures: pictures => {
    const setPictures = get()._validateMaxPictures(pictures)
    return setPictures
  },
  getCurrentPicture: () => {
    const pictures = get().pictures
    if (pictures.length === 0) return null
    return pictures[0]
  }
})

// const usePicturesStore = create(persist(state, { name: 'pictures' }))
const usePicturesStore = create(state)

export default usePicturesStore
