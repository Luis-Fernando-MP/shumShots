import { StateCreator, create } from 'zustand'
import type { IBorderRadiusStore } from '../background/backgroundRadius.store'

const RADIUS_DEFAULTS = {
  activeIndividualBorder: false,
  borderLTRadius: 20,
  borderRTRadius: 20,
  borderLBRadius: 20,
  borderRBRadius: 20,
  borderRadius: 20,
  borderSmooth: 0
}

const state: StateCreator<IBorderRadiusStore> = (set, get) => ({
  ...RADIUS_DEFAULTS,
  setActiveIndividualBorder: activeIndividualBorder => set({ activeIndividualBorder }),
  setBorderRadius: borderRadius => set({ borderRadius }),
  setBorderLTRadius: borderLTRadius => set({ borderLTRadius }),
  setBorderRTRadius: borderRTRadius => set({ borderRTRadius }),
  setBorderLBRadius: borderLBRadius => set({ borderLBRadius }),
  setBorderRBRadius: borderRBRadius => set({ borderRBRadius }),
  setBorderSmooth: borderSmooth => set({ borderSmooth: Math.min(100, Math.max(0, borderSmooth)) }),
  getStyleBorderRadius: () => {
    if (!get().activeIndividualBorder) return { borderRadius: `${get().borderRadius}px` }
    return {
      borderRadius: `${get().borderLTRadius}px ${get().borderRTRadius}px ${get().borderRBRadius}px ${get().borderLBRadius}px`
    }
  }
})

const useImagesRadiusStore = create(state)

export default useImagesRadiusStore
