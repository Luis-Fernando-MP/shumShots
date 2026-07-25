import { create, type StateCreator } from 'zustand'

export type Picture = {
  url: string
}

type PicturesState = {
  picture: Picture | null
  setPicture: (picture: Picture | null) => void
}

const state: StateCreator<PicturesState> = set => ({
  picture: null,
  setPicture: picture => set({ picture })
})

const usePicturesStore = create(state)

export default usePicturesStore
