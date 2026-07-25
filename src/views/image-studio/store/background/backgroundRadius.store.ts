import { StateCreator, create } from 'zustand'

export interface IBorderRadiusStore {
  activeIndividualBorder: boolean
  borderLTRadius: number
  borderRTRadius: number
  borderLBRadius: number
  borderRBRadius: number
  borderRadius: number
  setActiveIndividualBorder: (activeIndividualBorder: boolean) => void
  setBorderRadius: (borderRadius: number) => void
  setBorderLTRadius: (borderLTRadius: number) => void
  setBorderRTRadius: (borderRTRadius: number) => void
  setBorderLBRadius: (borderLBRadius: number) => void
  setBorderRBRadius: (borderRBRadius: number) => void
  resetBackgroundRadius?: () => void
  getStyleBorderRadius: () => { [key: string]: string }
}

const RADIUS_DEFAULTS = {
  activeIndividualBorder: false,
  borderLTRadius: 20,
  borderRTRadius: 20,
  borderLBRadius: 20,
  borderRBRadius: 20,
  borderRadius: 20
}

const state: StateCreator<IBorderRadiusStore> = (set, get) => ({
  ...RADIUS_DEFAULTS,
  setActiveIndividualBorder: activeIndividualBorder => set({ activeIndividualBorder }),
  setBorderRadius: borderRadius => set({ borderRadius }),
  setBorderLTRadius: borderLTRadius => set({ borderLTRadius }),
  setBorderRTRadius: borderRTRadius => set({ borderRTRadius }),
  setBorderLBRadius: borderLBRadius => set({ borderLBRadius }),
  setBorderRBRadius: borderRBRadius => set({ borderRBRadius }),
  resetBackgroundRadius: () => set(RADIUS_DEFAULTS),
  getStyleBorderRadius: () => {
    if (!get().activeIndividualBorder) return { borderRadius: `${get().borderRadius}px` }
    return {
      borderRadius: `${get().borderLTRadius}px ${get().borderRTRadius}px ${get().borderRBRadius}px ${get().borderLBRadius}px`
    }
  }
})

const useBackgroundRadiusStore = create(state)

export default useBackgroundRadiusStore
