import { StateCreator, create } from 'zustand'

type layoutType = 'grid' | 'rose' | 'default' | 'circle'

interface Props {
  currentLayout: layoutType
  layoutCounter: number
  setLayoutCounter: (layoutCounter: number) => void
  setCurrentLayout: (layout: layoutType) => void
}

const state: StateCreator<Props> = set => ({
  currentLayout: 'default',
  layoutCounter: 2,

  setCurrentLayout: layout => set({ currentLayout: layout }),
  setLayoutCounter: layoutCounter => set({ layoutCounter })
})

const useImagesLayoutStore = create(state)

export default useImagesLayoutStore
